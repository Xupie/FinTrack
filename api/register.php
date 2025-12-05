<?php
include "db.php";

header('Content-Type: application/json');
session_start();

$conn = getConnection();
$method = $_SERVER["REQUEST_METHOD"];

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Väärä pyyntömetodi"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['name']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(["error" => "Puuttuvat tiedot"]);
    exit;
}

$username = trim($data['name']);
$password = trim($data['password']);

if ($username === "" || $password === "") {
    http_response_code(400);
    echo json_encode(["error" => "Käyttäjänimi tai salasana puuttuu"]);
    exit;
}

// Check if username exists
$stmt = $conn->prepare("SELECT id FROM user WHERE username=?");
$stmt->bind_param("s", $username);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows > 0) {
    http_response_code(400);
    echo json_encode(["error" => "Käyttäjänimi on jo käytössä"]);
    exit;
}

// Hash password
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

// Insert user
$stmt = $conn->prepare("INSERT INTO user (username, password_hash) VALUES (?, ?)");
$stmt->bind_param("ss", $username, $passwordHash);

if ($stmt->execute()) {

    // Optional: login user automatically
    $_SESSION['username'] = $username;

    http_response_code(200);
    echo json_encode(["status" => "Rekisteröityminen onnistui"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Tietokantavirhe"]);
}