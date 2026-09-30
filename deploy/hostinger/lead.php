<?php
/**
 * Visit-request handler for the static build on Hostinger.
 * The site's form (lead.static.ts) POSTs JSON here; we validate and email it
 * to the centre. On any failure the form falls back to a pre-filled email,
 * so a lead is never lost.
 */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

const LEAD_TO = 'universalblooming@gmail.com';
const FROM    = 'Universal Blooming Website <noreply@universalblooming.com>';

function done(int $code, array $body): void { http_response_code($code); echo json_encode($body); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') done(405, ['ok' => false]);

// Same-site only: the form lives on this domain (or its preview subdomain).
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && !preg_match('#^https://([a-z0-9-]+\.)?universalblooming\.com$#i', $origin)) done(403, ['ok' => false]);

$raw = file_get_contents('php://input', false, null, 0, 20000);
$in  = json_decode($raw ?: '[]', true);
if (!is_array($in)) done(400, ['ok' => false]);

$get = function (string $k, int $max = 300) use ($in): string {
  $v = isset($in[$k]) && is_string($in[$k]) ? $in[$k] : '';
  return trim(mb_substr(str_replace(["\r", "\0"], '', $v), 0, $max));
};

if ($get('company') !== '') done(200, ['ok' => true]);                     // honeypot
$started = (int) $get('started', 20);
if ($started > 0 && (microtime(true) * 1000 - $started) < 2500) done(200, ['ok' => true]); // too fast = bot

$name  = $get('parentName', 80);
$phone = $get('phone', 30);
$email = $get('email', 120);
if (mb_strlen($name) < 2) done(422, ['ok' => false, 'error' => 'name']);
$digits = preg_replace('/\D/', '', $phone);
if (strlen($digits) < 8 || strlen($digits) > 15) done(422, ['ok' => false, 'error' => 'phone']);
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) done(422, ['ok' => false, 'error' => 'email']);
$message = $get('message', 1500);
if (preg_match_all('#https?://#i', $message) > 2) done(200, ['ok' => true]); // link spam

$fields = [
  'Name' => $name, 'Mobile / WhatsApp' => $phone, 'Email' => $email,
  'Best way to reach' => $get('contactPref', 20), "Child's age" => $get('childAge', 30),
  'Program' => $get('program', 40), 'Start' => $get('startWhen', 40), 'Message' => $message,
  'Page' => $get('page', 200), 'Source' => $get('source', 120),
  'First touch' => $get('firstTouch', 1000), 'Last touch' => $get('lastTouch', 1000),
  'Received' => gmdate('Y-m-d H:i') . ' UTC', 'IP' => $_SERVER['REMOTE_ADDR'] ?? '',
];
$body = '';
foreach ($fields as $k => $v) if ($v !== '') $body .= str_pad($k . ':', 20) . $v . "\n";

$subject = 'New visit request: ' . $name . ($fields['Program'] ? ' (' . $fields['Program'] . ')' : '');
$headers = ['From: ' . FROM, 'Content-Type: text/plain; charset=UTF-8', 'X-Mailer: universalblooming-site'];
if ($email !== '') $headers[] = 'Reply-To: ' . $email;

$sent = @mail(LEAD_TO, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));
done($sent ? 200 : 502, ['ok' => (bool) $sent]);
