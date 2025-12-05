<?php
include "db.php";

header('Content-Type: application/json');

$conn = getConnection();
$method = $_SERVER["REQUEST_METHOD"];

session_start();

if ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['name']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(["error" => "Puuttuvat tiedot"]);
        exit;
    }

    $username = $data['name'];
    $password = $data['password'];

    $stmt = $conn->prepare("SELECT * FROM user WHERE username=?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $res = $stmt->get_result();

    if ($res->num_rows === 1) {
        $user = $res->fetch_assoc();

        if (password_verify($password, $user['password_hash'])) {
            $_SESSION['username'] = $username;
            http_response_code(200);
            echo json_encode(["status" => "Kirjautuminen onnistui"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Virhe käyttäjätunnuksessa tai salasanassa"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Kayttäjää ei löytynyt"]);
    }
}
