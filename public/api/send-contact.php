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
    $limit_file = sys_get_temp_dir() . '/ard_interior_contact_' . md5($ip) . '.txt';
    
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
    $log_dir = sys_get_temp_dir() . '/ard_interior_logs';
    if (!is_dir($log_dir)) {
        @mkdir($log_dir, 0755, true);
        @chmod($log_dir, 0755);
    }
    
    $log_file = $log_dir . '/contact_' . date('Y-m-d') . '.log';
    $log_entry = date('Y-m-d H:i:s') . ' | ' . $status . ' | ' . $data['email'] . ' | ' . $data['name'] . ' | ' . $message . "\n";
    @file_put_contents($log_file, $log_entry, FILE_APPEND);
    @chmod($log_file, 0644);
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

$required = ['name', 'email', 'message'];
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
    'phone' => isset($input['phone']) ? sanitizeInput($input['phone']) : '',
    'message' => sanitizeInput($input['message'])
];

function generateContactEmailHTML($data) {
    $phone_section = '';
    if (!empty($data['phone'])) {
        $phone_section = "
                    <div class='info-row'>
                        <div class='label'>Telefón:</div>
                        <div class='value'>{$data['phone']}</div>
                    </div>";
    }
    
    return "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; }
            .container { max-width: 600px; margin: 0 auto; background: #faf5f1; padding: 20px; }
            .header { background: linear-gradient(135deg, #a27d4f 0%, #8a6a42 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: white; padding: 30px; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 16px; font-weight: bold; color: #a27d4f; border-bottom: 2px solid #a27d4f; padding-bottom: 10px; margin-bottom: 15px; }
            .info-row { margin-bottom: 12px; }
            .label { font-weight: 600; color: #333; }
            .value { color: #666; margin-top: 5px; }
            .footer { background: #faf5f1; padding: 20px; text-align: center; color: #999; font-size: 12px; border-radius: 0 0 8px 8px; }
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
                    {$phone_section}
                </div>
                
                <div class='section'>
                    <div class='section-title'>Správa</div>
                    <div class='info-row'>
                        <div class='value' style='white-space: pre-wrap; line-height: 1.6;'>{$data['message']}</div>
                    </div>
                </div>
                
                <p style='color: #888; font-size: 12px; margin-top: 25px;'>
                    Čas prijatia: <strong>" . date('d. m. Y H:i:s') . "</strong>
                </p>
            </div>
            
            <div class='footer'>
                <p>© 2026 ARD Interiér. Všetky práva vyhradené.</p>
            </div>
        </div>
    </body>
    </html>";
}

function generateConfirmationEmailHTML($data) {
    $phone_section = '';
    if (!empty($data['phone'])) {
        $phone_section = "
                    <div class='info-row'>
                        <div class='label'>Váš telefón:</div>
                        <div class='value'>{$data['phone']}</div>
                    </div>";
    }
    
    return "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #faf5f1; padding: 20px; }
            .header { background: linear-gradient(135deg, #a27d4f 0%, #8a6a42 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0 0 10px 0; font-size: 32px; font-weight: 600; }
            .header-subtitle { margin: 0; font-size: 14px; opacity: 0.95; }
            .content { background: white; padding: 40px 30px; }
            .section { margin-bottom: 35px; }
            .section-title { font-size: 16px; font-weight: 700; color: #a27d4f; border-bottom: 2px solid #a27d4f; padding-bottom: 12px; margin-bottom: 18px; text-transform: uppercase; letter-spacing: 0.5px; }
            .info-row { margin-bottom: 16px; }
            .label { font-weight: 700; color: #333; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #a27d4f; }
            .value { color: #333; margin-top: 6px; font-size: 14px; line-height: 1.5; }
            .message-box { background: #faf5f1; padding: 20px; border-left: 4px solid #a27d4f; border-radius: 4px; }
            .message-box .label { margin-bottom: 8px; }
            .message-box .value { white-space: pre-wrap; line-height: 1.7; color: #333; }
            .contact-section { background: linear-gradient(135deg, #f5ede4 0%, #faf5f1 100%); padding: 25px; border-radius: 6px; margin-top: 30px; }
            .contact-info { display: table; width: 100%; }
            .contact-item { display: table-cell; padding: 0 15px; }
            .contact-item:first-child { padding-left: 0; }
            .contact-item:last-child { padding-right: 0; }
            .contact-item-label { font-size: 11px; color: #a27d4f; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; }
            .contact-item-value { font-size: 14px; color: #333; font-weight: 600; }
            .timestamp { margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center; }
            .footer { background: #faf5f1; padding: 25px 30px; text-align: center; color: #999; font-size: 11px; border-radius: 0 0 8px 8px; border-top: 1px solid #e8dfd9; }
            .footer-text { margin: 0; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>✓ Vaša správa bola prijatá!</h1>
                <p class='header-subtitle'>Ďakujeme za kontakt. Naš tím sa s vami čoskoro skontaktuje.</p>
            </div>
            
            <div class='content'>
                <div class='section'>
                    <div class='section-title'>Vaše údaje</div>
                    <div class='info-row'>
                        <div class='label'>Meno</div>
                        <div class='value'>{$data['name']}</div>
                    </div>
                    <div class='info-row'>
                        <div class='label'>Email</div>
                        <div class='value'><a href='mailto:{$data['email']}' style='color: #a27d4f; text-decoration: none;'>{$data['email']}</a></div>
                    </div>
                    {$phone_section}
                </div>
                
                <div class='section'>
                    <div class='message-box'>
                        <div class='label'>Vaša správa:</div>
                        <div class='value'>{$data['message']}</div>
                    </div>
                </div>
                
                <div class='contact-section'>
                    <div class='section-title' style='margin-bottom: 15px; border-bottom: none; margin-top: 0;'>Kontaktujte nás</div>
                    <div class='contact-info'>
                        <div class='contact-item'>
                            <div class='contact-item-label'>Email</div>
                            <div class='contact-item-value'><a href='mailto:info@ardinterier.sk' style='color: #a27d4f; text-decoration: none;'>info@ardinterier.sk</a></div>
                        </div>
                        <div class='contact-item'>
                            <div class='contact-item-label'>Telefón</div>
                            <div class='contact-item-value'><a href='tel:+421917925011' style='color: #a27d4f; text-decoration: none;'>+421 917 925 011</a></div>
                        </div>
                    </div>
                </div>
                
                <div class='timestamp'>
                    Vaša správa bola prijatá: <strong>" . date('d.m.Y v H:i:s', time()) . "</strong>
                </div>
            </div>
            
            <div class='footer'>
                <p class='footer-text'>© 2026 ARD Interiér | Interiérový dizajn a realizácia<br/>Všetky práva vyhradené.</p>
            </div>
        </div>
    </body>
    </html>";
}

$htmlContent = generateContactEmailHTML($data);
$confirmationContent = generateConfirmationEmailHTML($data);

// Admin email
$adminEmail = 'info@ardinterier.sk';
$adminSubject = encodeSubject('Nová správa: ' . $data['name']);
$senderEmail = 'info@ardinterier.sk';
$senderName = 'ARD Interier';
$encodedSenderName = encodeSubject($senderName);
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: {$encodedSenderName} <{$senderEmail}>\r\n";
$headers .= "Return-Path: {$senderEmail}\r\n";
$headers .= "Reply-To: " . $data['email'] . "\r\n";

$adminMailSent = mail($adminEmail, $adminSubject, $htmlContent, $headers, "-f {$senderEmail}");
$adminMailError = $adminMailSent ? '' : (error_get_last()['message'] ?? 'unknown error');

// Customer confirmation
$customerEmail = $data['email'];
$customerSubject = encodeSubject('Potvrdenie - vaša správa bola prijatá');
$customerHeaders = "MIME-Version: 1.0\r\n";
$customerHeaders .= "Content-type: text/html; charset=UTF-8\r\n";
$customerHeaders .= "From: {$encodedSenderName} <{$senderEmail}>\r\n";
$customerHeaders .= "Return-Path: {$senderEmail}\r\n";
$customerHeaders .= "Reply-To: info@ardinterier.sk\r\n";

$customerMailSent = mail($customerEmail, $customerSubject, $confirmationContent, $customerHeaders, "-f {$senderEmail}");
$customerMailError = $customerMailSent ? '' : (error_get_last()['message'] ?? 'unknown error');

logContact(
    $data,
    'DEBUG',
    "Admin: " . ($adminMailSent ? 'OK' : "FAIL ({$adminMailError})") .
    " | Customer: " . ($customerMailSent ? 'OK' : "FAIL ({$customerMailError})")
);

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
