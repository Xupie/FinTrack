<?php

require_once __DIR__ . '/load_env.php';
loadEnv(__DIR__ . '/../.env');

function getConnection(): mysqli {
    $host = getenv('DB_HOST') ?: $_ENV['DB_HOST'];
    $port = getenv('DB_PORT') ?: $_ENV['DB_PORT'];
    $user = getenv('DB_USER') ?: $_ENV['DB_PORT'];
    $pass = getenv('DB_PASS') ?: $_ENV['DB_PASS'];
    $name = getenv('DB_NAME') ?: $_ENV['DB_NAME'];

    // Create connection
    $conn = new mysqli($host, $user, $pass, $name, $port);

    // Check connection
    if ($conn->connect_error) {
        die("database error: " . $conn->connect_error);
    }

    // Set charset
    if (!$conn->set_charset("utf8")) {
        die("Error loading charset utf8: " . $conn->error);
    }

    return $conn;
}
?>