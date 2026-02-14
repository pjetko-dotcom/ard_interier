<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Respond to preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(json_encode(['status' => 'ok']));
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Metóda nie je povolená']));
}

// Rate limiting - 1 objednávka za 60 sekúnd z jednej IP
function checkRateLimit() {
    $ip = $_SERVER['REMOTE_ADDR'];
    $limit_file = sys_get_temp_dir() . '/ardelivery_rate_' . md5($ip) . '.txt';
    
    if (file_exists($limit_file)) {
        $last_request = (int)file_get_contents($limit_file);
        if (time() - $last_request < 60) {
            return false; // Príliš často
        }
    }
    
    file_put_contents($limit_file, time());
    return true;
}

// Validácia emailu
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// Sanitizácia textu
function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

// Enkódovanie subjektu pre UTF-8 diakritiku
function encodeSubject($subject) {
    return '=?UTF-8?B?' . base64_encode($subject) . '?=';
}

// Logovanie
function logOrder($data, $status, $message = '') {
    $log_dir = sys_get_temp_dir() . '/ardelivery_logs';
    if (!is_dir($log_dir)) {
        @mkdir($log_dir, 0777, true);
        chmod($log_dir, 0777);
    }
    
    $log_file = $log_dir . '/orders_' . date('Y-m-d') . '.log';
    $log_entry = date('Y-m-d H:i:s') . ' | ' . $status . ' | ' . $data['email'] . ' | ' . $data['phone'] . ' | ' . $message . "\n";
    @file_put_contents($log_file, $log_entry, FILE_APPEND);
    @chmod($log_file, 0666);
}

// Skontroluj rate limit
if (!checkRateLimit()) {
    http_response_code(429);
    exit(json_encode(['error' => 'Príliš veľa žiadostí. Skúste znova neskôr.']));
}

// Parse JSON
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    exit(json_encode(['error' => 'Neplatná JSON požiadavka']));
}

// Validácia povinných polí
$required = ['name', 'email', 'phone', 'address', 'deliveryDate'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        exit(json_encode(['error' => "Pole '$field' je povinné"]));
    }
}

// Validácia emailu
if (!isValidEmail($input['email'])) {
    http_response_code(400);
    exit(json_encode(['error' => 'Neplatný email']));
}

// Sanitizácia dát
$data = [
    'name' => sanitizeInput($input['name']),
    'email' => filter_var($input['email'], FILTER_SANITIZE_EMAIL),
    'phone' => sanitizeInput($input['phone']),
    'address' => sanitizeInput($input['address']),
    'deliveryDate' => sanitizeInput($input['deliveryDate']),
    'specialInstructions' => sanitizeInput($input['specialInstructions'] ?? ''),
    'cart' => $input['cart'] ?? [],
];

// Výpočet ceny
$totalPrice = 0;
if (is_array($data['cart'])) {
    foreach ($data['cart'] as $item) {
        $totalPrice += ($item['price'] ?? 0) * ($item['quantity'] ?? 0);
    }
}

// Vytvorenie HTML emailu
$htmlContent = generateEmailHTML($data, $totalPrice);

// Nastavenie emailu pre ADMIN
$adminEmail = 'order@ardelivery.sk';
$adminSubject = encodeSubject('Nová objednávka z AR Delivery - ' . $data['name']);
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type: text/html; charset=UTF-8" . "\r\n";
$headers .= "From: order@ardelivery.sk" . "\r\n";
$headers .= "Return-Path: order@ardelivery.sk" . "\r\n";
$headers .= "Reply-To: " . $data['email'] . "\r\n";

// Pošli email ADMINOVI
$adminMailSent = mail($adminEmail, $adminSubject, $htmlContent, $headers);

// Pošli POTVRDENIE ZÁKAZNÍKOVI
$customerEmail = $data['email'];
$customerSubject = encodeSubject('Vaša objednávka bola prijatá - AR Delivery');
$customerHeaders = "MIME-Version: 1.0" . "\r\n";
$customerHeaders .= "Content-type: text/html; charset=UTF-8" . "\r\n";
$customerHeaders .= "From: order@ardelivery.sk" . "\r\n";
$customerHeaders .= "Return-Path: order@ardelivery.sk" . "\r\n";
$customerHeaders .= "Reply-To: order@ardelivery.sk" . "\r\n";

$customerMailSent = mail($customerEmail, $customerSubject, $htmlContent, $customerHeaders);

logOrder($data, 'DEBUG', "Admin mail: " . ($adminMailSent ? 'OK' : 'FAILED') . " | Customer mail: " . ($customerMailSent ? 'OK' : 'FAILED'));

if ($adminMailSent && $customerMailSent) {
    logOrder($data, 'SUCCESS');
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Objednávka bola úspešne odoslaná!',
        'orderId' => 'ORD-' . date('YmdHis')
    ]);
} else {
    logOrder($data, 'FAILED', ($adminMailSent ? '' : 'Admin mail failed. ') . ($customerMailSent ? '' : 'Customer mail failed.'));
    http_response_code(500);
    echo json_encode(['error' => 'Chyba pri odosielaní emailu. Skúste znova neskôr.', 'debug' => 'Admin: ' . ($adminMailSent ? 'OK' : 'FAIL') . ' | Customer: ' . ($customerMailSent ? 'OK' : 'FAIL')]);
}

// HTML Email template
function generateEmailHTML($data, $totalPrice) {
    $deliveryDate = date('d. m. Y', strtotime($data['deliveryDate']));
    $cartItems = '';
    
    if (!empty($data['cart'])) {
        foreach ($data['cart'] as $item) {
            $itemPrice = $item['price'] * $item['quantity'];
            $cartItems .= "
            <tr style='border-bottom: 1px solid #ddd;'>
                <td style='padding: 12px; text-align: left; color: #333;'>{$item['name']}</td>
                <td style='padding: 12px; text-align: center; color: #888;'>{$item['quantity']} x {$item['unit']}</td>
                <td style='padding: 12px; text-align: right; color: #D98324; font-weight: bold;'>{$item['price']}€</td>
                <td style='padding: 12px; text-align: right; color: #333; font-weight: bold;'>" . number_format($itemPrice, 2, ',', ' ') . "€</td>
            </tr>";
        }
    }
    
    return "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; }
            .container { max-width: 600px; margin: 0 auto; background: #f7f5e8; padding: 20px; }
            .header { background: linear-gradient(135deg, #D98324 0%, #768E7E 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: white; padding: 30px; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 16px; font-weight: bold; color: #D98324; border-bottom: 2px solid #D98324; padding-bottom: 10px; margin-bottom: 15px; }
            .info-row { display: flex; margin-bottom: 12px; }
            .label { font-weight: 600; color: #333; width: 150px; }
            .value { color: #666; flex: 1; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th { background: #f5f5f5; padding: 12px; text-align: left; font-weight: 600; color: #333; font-size: 14px; }
            .total-row { background: #f5f5f5; font-weight: bold; font-size: 16px; }
            .total-row td { padding: 15px 12px; }
            .footer { background: #f7f5e8; padding: 20px; text-align: center; color: #999; font-size: 12px; border-radius: 0 0 8px 8px; }
            .btn { display: inline-block; background: #D98324; color: white; padding: 12px 24px; border-radius: 24px; text-decoration: none; margin-top: 15px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>🍊 Vaša objednávka bola prijatá!</h1>
            </div>
            
            <div class='content'>
                <p style='color: #666; margin-bottom: 20px;'>Ďakujeme za vašu objednávku! Nižšie nájdete podrobnosti.</p>
                
                <div class='section'>
                    <div class='section-title'>Osobné údaje</div>
                    <div class='info-row'>
                        <div class='label'>Meno:</div>
                        <div class='value'>{$data['name']}</div>
                    </div>
                    <div class='info-row'>
                        <div class='label'>Email:</div>
                        <div class='value'>{$data['email']}</div>
                    </div>
                    <div class='info-row'>
                        <div class='label'>Telefón:</div>
                        <div class='value'>{$data['phone']}</div>
                    </div>
                    <div class='info-row'>
                        <div class='label'>Adresa doručenia:</div>
                        <div class='value'>{$data['address']}</div>
                    </div>
                </div>
                
                <div class='section'>
                    <div class='section-title'>Podrobnosti doručenia</div>
                    <div class='info-row'>
                        <div class='label'>Dátum doručenia:</div>
                        <div class='value'>{$deliveryDate}</div>
                    </div>
                    <div class='info-row'>
                        <div class='label'>Čas doručenia:</div>
                        <div class='value'>Ráno (po príprave)</div>
                    </div>
                    " . (!empty($data['specialInstructions']) ? "
                    <div class='info-row'>
                        <div class='label'>Poznámka:</div>
                        <div class='value'>{$data['specialInstructions']}</div>
                    </div>
                    " : "") . "
                </div>
                
                <div class='section'>
                    <div class='section-title'>Zoznam produktov</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Produkt</th>
                                <th>Jednotka</th>
                                <th>Cena</th>
                                <th>Spolu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {$cartItems}
                            <tr class='total-row'>
                                <td colspan='3' style='text-align: right;'>Celková suma:</td>
                                <td>" . number_format($totalPrice, 2, ',', ' ') . "€</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <p style='color: #888; font-size: 14px; margin-top: 25px;'>
                    V prípade otázok nás kontaktujte na <strong>order@ardelivery.sk</strong> alebo <strong>+421 917 925 011</strong>.
                </p>
            </div>
            
            <div class='footer'>
                <p>© 2026 AR Delivery. Všetky práva vyhradené.</p>
            </div>
        </div>
    </body>
    </html>";
}
?>
