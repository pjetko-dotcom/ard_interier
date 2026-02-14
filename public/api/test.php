<?php
header('Content-Type: application/json');

// Test mail function
$testEmail = 'test@example.com';
$testSubject = 'Test - AR Delivery';
$testBody = 'Toto je test emailu z AR Delivery.';
$testHeaders = "MIME-Version: 1.0\r\n";
$testHeaders .= "Content-type: text/html; charset=UTF-8\r\n";
$testHeaders .= "From: noreply@ardelivery.sk\r\n";

// Test logovani
$log_dir = sys_get_temp_dir() . '/ardelivery_logs';
if (!is_dir($log_dir)) {
    @mkdir($log_dir, 0777, true);
    chmod($log_dir, 0777);
}

$test_log_file = $log_dir . '/test_' . date('Y-m-d') . '.log';
$test_entry = date('Y-m-d H:i:s') . " | TEST | mail() function test\n";
@file_put_contents($test_log_file, $test_entry, FILE_APPEND);

// Testuj mail()
$mailResult = @mail($testEmail, $testSubject, $testBody, $testHeaders);

// Odpoveď
echo json_encode([
    'timestamp' => date('Y-m-d H:i:s'),
    'mail_function' => function_exists('mail') ? 'OK' : 'NOT AVAILABLE',
    'mail_result' => $mailResult ? 'TRUE (mail() said OK)' : 'FALSE (mail() failed)',
    'log_dir' => $log_dir,
    'log_dir_exists' => is_dir($log_dir),
    'log_dir_writable' => is_writable($log_dir),
    'temp_dir' => sys_get_temp_dir(),
    'sendmail_path' => ini_get('sendmail_path'),
    'smtp' => ini_get('SMTP'),
    'smtp_port' => ini_get('smtp_port'),
    'from_address' => ini_get('sendmail_from'),
    'test_log_file' => $test_log_file,
    'test_log_written' => file_exists($test_log_file),
    'message' => 'Skontroluj dev tools → Network → test.php response'
]);
?>
