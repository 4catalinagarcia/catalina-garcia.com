<?php
/**
 * contact.php — Contact form handler for catalinagarcia.com
 * Expects a POST request with: name, email, subject, message
 * Returns JSON: { "success": bool, "message": string }
 */

// JSON response headers
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// ----------------------------------------------------------------
// Collect & sanitize
// ----------------------------------------------------------------
$name    = trim(strip_tags($_POST['name']    ?? ''));
$email   = trim(filter_var($_POST['email']   ?? '', FILTER_SANITIZE_EMAIL));
$subject = trim(strip_tags($_POST['subject'] ?? ''));
$message = trim(strip_tags($_POST['message'] ?? ''));

// ----------------------------------------------------------------
// Validation
// ----------------------------------------------------------------
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    echo json_encode([
        'success' => false,
        'message' => 'Please fill in all required fields.'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Please provide a valid email address.'
    ]);
    exit;
}

// Length limits (prevent abuse)
if (strlen($name) > 120 || strlen($subject) > 250 || strlen($message) > 6000) {
    echo json_encode([
        'success' => false,
        'message' => 'One or more fields exceed the maximum allowed length.'
    ]);
    exit;
}

// Simple spam guard: reject if message contains too many URLs
if (substr_count($message, 'http') > 3) {
    echo json_encode([
        'success' => false,
        'message' => 'Your message was flagged as potential spam. Please remove excessive links.'
    ]);
    exit;
}

// ----------------------------------------------------------------
// Compose email
// ----------------------------------------------------------------
$to          = '4catalinagarcia@gmail.com';
$mailSubject = '[catalinagarcia.com] ' . $subject;

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "From: Portfolio Contact <noreply@catalinagarcia.com>\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

$body  = "New message from your portfolio website\n";
$body .= str_repeat('=', 48) . "\n\n";
$body .= "Name:    {$name}\n";
$body .= "Email:   {$email}\n";
$body .= "Subject: {$subject}\n\n";
$body .= "Message:\n{$message}\n\n";
$body .= str_repeat('-', 48) . "\n";
$body .= "Sent via catalinagarcia.com contact form\n";

// ----------------------------------------------------------------
// Send
// ----------------------------------------------------------------
$sent = mail($to, $mailSubject, $body, $headers);

if ($sent) {
    echo json_encode([
        'success' => true,
        'message' => "Thank you, {$name}! Your message has been sent. I'll be in touch soon."
    ]);
} else {
    // mail() can silently fail on some hosts — log and inform user
    error_log('[catalinagarcia.com] mail() failed for: ' . $email . ' | ' . date('Y-m-d H:i:s'));
    echo json_encode([
        'success' => false,
        'message' => 'The message could not be delivered right now. Please email me directly at 4catalinagarcia@gmail.com.'
    ]);
}
