<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($uri === '/health' || $uri === '/api/health') {
    echo json_encode([
        "status" => "healthy",
        "framework" => "PHP Laravel Native API",
        "php_version" => phpversion(),
        "timestamp" => gmdate("c")
    ], JSON_PRETTY_PRINT);
    exit;
}

echo json_encode([
    "service" => "Universal PHP Dev Hub Service",
    "routes" => ["/health", "/api/health"]
], JSON_PRETTY_PRINT);
