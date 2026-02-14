<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(json_encode(['status' => 'ok']));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Metóda nie je povolená']));
}

// Rate limiting - max 1 správa za 60 sekúnd z IP
function checkRateLimit() {
    $ip = $_SERVER['REMOTE_ADDR'];
    $limit_file = sys_get_temp_dir() . '/ardelivery_contact_' . md5($ip) . '.txt';
    
    if (file_exists($limit_file)) {
        $last_request = (int)file_get_contents($limit_file);
        if (time() - $last_request < 60) {
            return false;
        }
    }
    
    @file_put_contents($limit_file, time());
    return true;
}

function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

function encodeSubject($subject) {
    return '=?UTF-8?B?' . base64_encode($subject) . '?=';
}

function logContact($data, $status, $message = '') {
    $log_dir = sys_get_temp_dir() . '/ardelivery_logs';
    if (!is_dir($log_dir)) {
        @mkdir($log_dir, 0777, true);
        chmod($log_dir, 0777);
    }
    
    $log_file = $log_dir . '/contact_' . date('Y-m-d') . '.log';
    $log_entry = date('Y-m-d H:i:s') . ' | ' . $status . ' | ' . $data['email'] . ' | ' . $data['subject'] . ' | ' . $message . "\n";
    @file_put_contents($log_file, $log_entry, FILE_APPEND);
    @chmod($log_file, 0666);
}

if (!checkRateLimit()) {
    http_response_code(429);
    exit(json_encode(['error' => 'Príliš veľa žiadostí. Skúste znova neskôr.']));
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    exit(json_encode(['error' => 'Neplatná JSON požiadavka']));
}

$required = ['name', 'email', 'subject', 'message'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        exit(json_encode(['error' => "Pole '$field' je povinné"]));
    }
}

if (!isValidEmail($input['email'])) {
    http_response_code(400);
    exit(json_encode(['error' => 'Neplatný email']));
}

$data = [
    'name' => sanitizeInput($input['name']),
    'email' => filter_var($input['email'], FILTER_SANITIZE_EMAIL),
    'subject' => sanitizeInput($input['subject']),
    'message' => sanitizeInput($input['message'])
];

function generateContactEmailHTML($data) {
    return "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; }
            .container { max-width: 600px; margin: 0 auto; background: #f7f5e8; padding: 20px; }
            .header { background: linear-gradient(135deg, #D98324 0%, #768E7E 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: white; padding: 30px; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 16px; font-weight: bold; color: #D98324; border-bottom: 2px solid #D98324; padding-bottom: 10px; margin-bottom: 15px; }
            .info-row { margin-bottom: 12px; }
            .label { font-weight: 600; color: #333; }
            .value { color: #666; margin-top: 5px; }
            .footer { background: #f7f5e8; padding: 20px; text-align: center; color: #999; font-size: 12px; border-radius: 0 0 8px 8px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Nová Správa z Kontaktného Formulára</h1>
            </div>
            
            <div class='content'>
                <div class='section'>
                    <div class='section-title'>Informácie o Odosielateľovi</div>
                    <div class='info-row'>
                        <div class='label'>Meno:</div>
                        <div class='value'>{$data['name']}</div>
                    </div>
                    <div class='info-row'>
                        <div class='label'>Email:</div>
                        <div class='value'><a href='mailto:{$data['email']}'>{$data['email']}</a></div>
                    </div>
                </div>
                
                <div class='section'>
                    <div class='section-title'>Správa</div>
                    <div class='info-row'>
                        <div class='label'>Predmet:</div>
                        <div class='value'>{$data['subject']}</div>
                    </div>
                    <div class='info-row'>
                        <div class='label'>Správa:</div>
                        <div class='value' style='white-space: pre-wrap; line-height: 1.6;'>{$data['message']}</div>
                    </div>
                </div>
                
                <p style='color: #888; font-size: 12px; margin-top: 25px;'>
                    Čas prijatia: <strong>" . date('d. m. Y H:i:s') . "</strong>
                </p>
            </div>
            
            <div class='footer'>
                <p>© 2026 AR Delivery. Všetky práva vyhradené.</p>
            </div>
        </div>
    </body>
    </html>";
}

function generateConfirmationEmailHTML($data) {
    return "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; }
            .container { max-width: 600px; margin: 0 auto; background: #f7f5e8; padding: 20px; }
            .header { background: linear-gradient(135deg, #D98324 0%, #768E7E 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: white; padding: 30px; }
            .footer { background: #f7f5e8; padding: 20px; text-align: center; color: #999; font-size: 12px; border-radius: 0 0 8px 8px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>🍊 Vaša správa bola prijatá!</h1>
            </div>
            
            <div class='content'>
                <p>Ďakujeme vám za vašu správu! Naša tím sa s vami čoskoro skontaktuje.</p>
                
                <h3 style='color: #D98324;'>Detaily vašej správy:</h3>
                <p><strong>Predmet:</strong> {$data['subject']}</p>
                <p style='white-space: pre-wrap; line-height: 1.6;'><strong>Správa:</strong><br/>{$data['message']}</p>
                
                <hr style='border: none; border-top: 1px solid #ddd; margin: 25px 0;' />
                
                <p style='color: #888; font-size: 12px;'>
                    Ak máte ďalšie otázky, napíšte nám na <strong>order@ardelivery.sk</strong> alebo nám zavolajte na <strong>+421 917 925 011</strong>.
                </p>
            </div>
            
            <div class='footer'>
                <p>© 2026 AR Delivery. Všetky práva vyhradené.</p>
            </div>
        </div>
    </body>
    </html>";
}

$htmlContent = generateContactEmailHTML($data);
$confirmationContent = generateConfirmationEmailHTML($data);

// Admin email
$adminEmail = 'order@ardelivery.sk';
$adminSubject = encodeSubject('Nová správa: ' . $data['subject']);
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: order@ardelivery.sk\r\n";
$headers .= "Return-Path: order@ardelivery.sk\r\n";
$headers .= "Reply-To: " . $data['email'] . "\r\n";

$adminMailSent = @mail($adminEmail, $adminSubject, $htmlContent, $headers);

// Customer confirmation
$customerEmail = $data['email'];
$customerSubject = encodeSubject('Potvrdenie - vaša správa bola prijatá');
$customerHeaders = "MIME-Version: 1.0\r\n";
$customerHeaders .= "Content-type: text/html; charset=UTF-8\r\n";
$customerHeaders .= "From: order@ardelivery.sk\r\n";
$customerHeaders .= "Return-Path: order@ardelivery.sk\r\n";
$customerHeaders .= "Reply-To: order@ardelivery.sk\r\n";

$customerMailSent = @mail($customerEmail, $customerSubject, $confirmationContent, $customerHeaders);

logContact($data, 'DEBUG', "Admin: " . ($adminMailSent ? 'OK' : 'FAIL') . " | Customer: " . ($customerMailSent ? 'OK' : 'FAIL'));

if ($adminMailSent && $customerMailSent) {
    logContact($data, 'SUCCESS');
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Ďakujeme za vašu správu!'
    ]);
} else {
    logContact($data, 'FAILED', ($adminMailSent ? '' : 'Admin fail. ') . ($customerMailSent ? '' : 'Customer fail.'));
    http_response_code(500);
    echo json_encode(['error' => 'Chyba pri odosielaní správy. Skúste neskôr.']);
}
?>
