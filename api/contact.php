<?php
// Strict backend handling for contact form
// Author: Security-hardened endpoint that returns JSON only.

declare(strict_types=1);

session_start();

// Security and JSON headers
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

function respond(int $status, array $payload): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, [
        'success' => false,
        'message' => 'Method Not Allowed'
    ]);
}

// Accept JSON body (preferred), fallback to application/x-www-form-urlencoded
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    $data = $_POST ?? [];
}

// Basic rate-limiting (per-session, per-IP)
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$now = time();
$bucket = $_SESSION['contact_rate'] ?? ['count' => 0, 'start' => $now, 'last' => 0, 'ip' => $ip];
if (($bucket['ip'] ?? '') !== $ip) {
    $bucket = ['count' => 0, 'start' => $now, 'last' => 0, 'ip' => $ip];
}
// Window 60 detik
if ($now - (int)$bucket['start'] > 60) {
    $bucket['start'] = $now;
    $bucket['count'] = 0;
}
// Minimal jeda 3 detik antar request
if ($now - (int)$bucket['last'] < 3) {
    respond(429, [
        'success' => false,
        'message' => 'Terlalu sering. Coba lagi beberapa detik.'
    ]);
}

$bucket['count']++;
$bucket['last'] = $now;
if ($bucket['count'] > 10) {
    respond(429, [
        'success' => false,
        'message' => 'Batas permintaan terlampaui. Coba lagi nanti.'
    ]);
}
$_SESSION['contact_rate'] = $bucket;

// CSRF validation
$session_token = (string)($_SESSION['csrf_token'] ?? '');
$csrf = (string)($data['csrf_token'] ?? '');
if ($session_token === '' || $csrf === '' || !hash_equals($session_token, $csrf)) {
    respond(400, [
        'success' => false,
        'message' => 'Sesi keamanan tidak valid (CSRF). Muat ulang halaman.'
    ]);
}

// Honeypot (should be empty)
$honeypot = (string)($data['website'] ?? '');
if ($honeypot !== '') {
    respond(400, [
        'success' => false,
        'message' => 'Deteksi bot. Pengiriman ditolak.'
    ]);
}

// Extract and validate fields
$name = trim((string)($data['name'] ?? ''));
$phone = trim((string)($data['phone'] ?? ''));
$email = trim((string)($data['email'] ?? ''));
$message = trim((string)($data['message'] ?? ''));

// name: letters and spaces only, up to 100
if ($name === '' || mb_strlen($name) > 100 || !preg_match('/^[a-zA-Z\s]+$/u', $name)) {
    respond(422, [ 'success' => false, 'message' => 'Nama tidak valid.' ]);
}

// phone: digits + + - space (max 20)
if ($phone === '' || strlen($phone) > 20 || !preg_match('/^[0-9+\-\s()]+$/', $phone)) {
    respond(422, [ 'success' => false, 'message' => 'Nomor telepon tidak valid.' ]);
}

// email: standard validation (max 100)
if ($email === '' || strlen($email) > 100 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, [ 'success' => false, 'message' => 'Email tidak valid.' ]);
}

// message: required, up to 1000
if ($message === '' || mb_strlen($message) > 1000) {
    respond(422, [ 'success' => false, 'message' => 'Pesan wajib diisi dan maksimal 1000 karakter.' ]);
}

// Persist message securely (file log). You can switch to DB/email later.
$storageDir = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'storage';
if (!is_dir($storageDir)) {
    @mkdir($storageDir, 0755, true);
}
$logFile = $storageDir . DIRECTORY_SEPARATOR . 'contact.log';

$entry = [
    'time'   => gmdate('c'),
    'ip'     => $ip,
    'ua'     => substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 512),
    'name'   => $name,
    'phone'  => $phone,
    'email'  => $email,
    'message'=> $message,
];

$written = @file_put_contents($logFile, json_encode($entry, JSON_UNESCAPED_UNICODE) . PHP_EOL, FILE_APPEND | LOCK_EX);
if ($written === false) {
    respond(500, [
        'success' => false,
        'message' => 'Gagal menyimpan data. Coba lagi nanti.'
    ]);
}

// Regenerate CSRF token after successful submission
try {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
} catch (Throwable $e) {
    // Fallback if random_bytes fails
    $_SESSION['csrf_token'] = bin2hex(openssl_random_pseudo_bytes(32));
}

respond(200, [
    'success' => true,
    'message' => 'Terima kasih! Pesan Anda sudah kami terima.',
    'new_csrf_token' => $_SESSION['csrf_token'],
]);
