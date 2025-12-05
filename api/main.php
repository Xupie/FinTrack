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

    if ($category_name === "") {
        http_response_code(400);
        error("Category name is empty");
    }

    $stmt = $conn->prepare("INSERT INTO category (category_name, user_id) VALUES (?, ?)");

    if (!$stmt->execute([$category, $_SESSION['user_id']])) {
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

    if ($category_id === "" || $category_name === "") {
        http_response_code(400);
        error("Fill all fields");
    }

    $stmt = $conn->prepare("
        UPDATE category
        SET category_name = ?
        WHERE id = ?
    ");

    if (!$stmt->execute([$category_name, $category_id])) {
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
//   add income
// =================================================
if ($action === 'add_income') {
    $data = json_decode(file_get_contents("php://input"), true);
    $description = trim($data['description']);
    $category_id = trim($data['category']);
    $amount = trim($data['amount']);
    $created_datetime = date('Y-m-d H:i:s');

    if ($description === "" || $category_id === "" || $amount === "") {
        http_response_code(400);
        error("Fill all fields");
    }

    if (!ctype_digit($id)) {
        http_response_code(400);
        error("Invalid id");
    }

    $stmt = $conn->prepare("
        INSERT INTO income (description, category_id, amount, created_at, user_id)
        VALUES (?, ?, ?, ?, ?)
    ");

    if (!$stmt->execute([$description, $_SESSION['user_id'], $category_id, $amount, $created_datetime])) {
        http_response_code(400);
        error("DB Error");
    }

    response(["status" => "ok"]);
}

// =================================================
//   delete income
// =================================================
if ($action === 'delete_income') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = trim($data['id']);

    if (!ctype_digit($id)) {
        http_response_code(400);
        error("Invalid id");
    }

    $stmt = $conn->prepare("DELETE FROM income WHERE id = ?");

    if (!$stmt->execute([$id])) {
        http_response_code(400);
        error("DB Error");
    }

    response(["status" => "ok"]);
}

// =================================================
//   update income
// =================================================
if ($action === 'update_income') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = trim($data['id']);
    $description = trim($data['description']);
    $category_id = trim($data['category']);
    $amount = trim($data['amount']);
    $created_datetime = date('Y-m-d H:i:s');

    if (!ctype_digit($id)) {
        http_response_code(400);
        error("Invalid ID");
    }

    if ($description === "" || $category_id === "" || $amount === "") {
        http_response_code(400);
        error("Fill all fields");
    }

    $stmt = $conn->prepare("
        UPDATE income
        SET description = ?, category_id = ?, amount = ?, created_at = ?
        WHERE id = ?
    ");

    if (!$stmt->execute([$description, $category_id, $amount, $created_datetime])) {
        http_response_code(400);
        error("DB Error");
    }


    response(["status" => "ok"]);
}

// =================================================
//   add expence
// =================================================
if ($action === 'add_expence') {
    $data = json_decode(file_get_contents("php://input"), true);
    $description = trim($data['description']);
    $category_id = trim($data['category']);
    $amount = trim($data['amount']);
    $created_datetime = date('Y-m-d H:i:s');

    if ($description === "" || $category_id === "" || $amount === "") {
        http_response_code(400);
        error("Fill all fields");
    }

    if (!ctype_digit($id)) {
        http_response_code(400);
        error("Invalid id");
    }

    $stmt = $conn->prepare("
        INSERT INTO expence (description, category_id, amount, created_at, user_id)
        VALUES (?, ?, ?, ?, ?)
    ");

    if (!$stmt->execute([$description, $_SESSION['user_id'], $category_id, $amount, $created_datetime])) {
        http_response_code(400);
        error("DB Error");
    }

    response(["status" => "ok"]);
}
// =================================================
//   delete expence
// =================================================
if ($action === 'delete_expence') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = trim($data['id']);

    if (!ctype_digit($id)) {
        http_response_code(400);
        error("Invalid id");
    }

    $stmt = $conn->prepare("DELETE FROM income WHERE id = ?");

    if (!$stmt->execute([$id])) {
        http_response_code(400);
        error("DB Error");
    }

    response(["status" => "ok"]);
}
// =================================================
//   edit expence
// =================================================

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