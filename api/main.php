<?php
include "db.php";

header('Content-Type: application/json');

$conn = getConnection();
$method = $_SERVER["REQUEST_METHOD"];

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// =================================================
// HELPERS
// =================================================
function response($data)
{
    echo json_encode($data);
    exit;
}

function error($msg)
{
    response(["status" => "error", "message" => $msg]);
}

if (!$conn) {
    error("Database connection error");
}

$data = json_decode(file_get_contents("php://input"), true) ?? [];
$action = $data['action']
    ?? $_POST['action']
    ?? $_GET['action']
    ?? null;

// =================================================
// login tarkistus
// =================================================

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    http_response_code(401);
    error("käyttäjä ei ole kirjautunut sisään");
    exit;
}

// =================================================
//   add category
// =================================================
if ($action === 'add_category') {
    $data = json_decode(file_get_contents("php://input"), true);
    $category_name = trim($data['category_name']);
    $user_id = $_SESSION['user_id'];
    $type = trim($data['type']); // income or expense

    if ($category_name === "") {
        http_response_code(400);
        error("Category name is empty");
    }

    $stmt = $conn->prepare("INSERT INTO category (category_name, user_id, type) VALUES (?, ?, ?)");

    if (!$stmt->execute([$category, $user_id, $type])) {
        http_response_code(400);
        error("DB Error");
    }

    response(["status" => "ok"]);
}

// =================================================
//   edit category
// =================================================
if ($action === 'update_category') {
    $data = json_decode(file_get_contents("php://input"), true);
    $category_id = trim($data['category_id']);
    $category_name = trim($data['category_name']);
    $user_id = $_SESSION['user_id'];
    $type = trim($data['type']); // income or expense

    if ($category_id === "" || $category_name === "" || $type === "") {
        http_response_code(400);
        error("Fill all fields");
    }

    $stmt = $conn->prepare("
        UPDATE category
        SET category_name = ?, type = ?
        WHERE id = ?
          AND user_id = ?
    ");

    if (!$stmt->execute([$category_name, $type, $category_id, $user_id])) {
        http_response_code(400);
        error("DB Error");
    }

    response(["status" => "ok"]);
}

// =================================================
//   delete category
// =================================================
if ($action === 'delete_category') {

    $data = json_decode(file_get_contents("php://input"), true);
    $category_id = trim($data['category_id']);

    if ($category_id === "") {
        http_response_code(400);
        error("Category id is empty");
    }

    $stmt = $conn->prepare("DELETE FROM category WHERE id = ?");

    if (!$stmt->execute([$category_id])) {
        http_response_code(400);
        error("DB Error");
    }

    response(["status" => "ok"]);
}

// =================================================
//   add income or expense
// =================================================
if ($action === 'add_transaction') {
    $data = json_decode(file_get_contents("php://input"), true);
    $description = trim($data['description']);
    $category_id = trim($data['category']);
    $amount = trim($data['amount']);
    $created_datetime = date('Y-m-d H:i:s');
    $user_id = $_SESSION['user_id'];
    $type = trim($data['type']); // income or expense

    if ($description === "" || $category_id === "" || $amount === "" || $type === "") {
        http_response_code(400);
        error("Fill all fields");
    }

    if (!ctype_digit($id)) {
        http_response_code(400);
        error("Invalid id");
    }

    $stmt = $conn->prepare("
        INSERT INTO transaction (description, category_id, amount, created_at, user_id, type)
        VALUES (?, ?, ?, ?, ?, ?)
    ");

    if (!$stmt->execute([$description, $category_id, $amount, $created_datetime, $user_id, $type])) {
        http_response_code(400);
        error("DB Error");
    }

    response(["status" => "ok"]);
}

// =================================================
//   delete income or expense
// =================================================
if ($action === 'delete_transaction') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = trim($data['id']);

    if (!ctype_digit($id)) {
        http_response_code(400);
        error("Invalid id");
    }

    $stmt = $conn->prepare("DELETE FROM transaction WHERE id = ?");

    if (!$stmt->execute([$id])) {
        http_response_code(400);
        error("DB Error");
    }

    response(["status" => "ok"]);
}

// =================================================
//   update income or expense
// =================================================
if ($action === 'update_transaction') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = trim($data['id']);
    $description = trim($data['description']);
    $category_id = trim($data['category']);
    $amount = trim($data['amount']);
    $created_datetime = date('Y-m-d H:i:s');
    $type = trim($data['type']); // income or expense

    if (!ctype_digit($id)) {
        http_response_code(400);
        error("Invalid ID");
    }

    if ($description === "" || $category_id === "" || $amount === "" || $type === "") {
        http_response_code(400);
        error("Fill all fields");
    }

    $stmt = $conn->prepare("
        UPDATE transaction
        SET description = ?, category_id = ?, amount = ?, created_at = ?, type = ?
        WHERE id = ?
    ");

    if (!$stmt->execute([$description, $category_id, $amount, $created_datetime, $type])) {
        http_response_code(400);
        error("DB Error");
    }


    response(["status" => "ok"]);
}


// =================================================
//   sorted by categories
// =================================================

// =================================================
//   statistics on specific dates
// =================================================

// =================================================
//   budget scheme
// =================================================
response(["status" => "error", "message" => "Unknown action"]);

?>