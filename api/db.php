<?php

require_once __DIR__ . '/load_env.php';
loadEnv(__DIR__ . '/../.env');

function getConnection(): mysqli {
    $host = $_ENV['DB_HOST'];
    $port = $_ENV['DB_PORT'];
    $user = $_ENV['DB_USER'];
    $pass = $_ENV['DB_PASS'];
    $name = $_ENV['DB_NAME'];

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