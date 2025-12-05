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

// ================================================================
//   show all expenses and incomes sorted by time when it was created
// ================================================================
if ($action === 'show_all') {
    $user_id = $_SESSION['user_id'];

    $stmt = $conn->prepare("
        SELECT t.id, t.description, t.amount, t.type, t.created_at,
               c.category_name
        FROM transaction t
        JOIN category c ON t.category_id = c.id
        WHERE t.user_id = ?
        ORDER BY t.created_at DESC
    ");

    $stmt->execute([$user_id]);

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC); // data about transactions in this variable

    response($rows);
}
// =================================================
//   sorted by categories
// =================================================
if ($action === 'sorted_by_categories') {

    $data = json_decode(file_get_contents("php://input"), true);

    $category_name = trim($data['category_name']);
    $user_id = $_SESSION['user_id'];

    if ($category_name === "") {
        http_response_code(400);
        error("Category name is empty");
    }

    // find the user's category by name
    $stmt = $conn->prepare("
        SELECT id 
        FROM category
        WHERE user_id = ?
          AND category_name = ?
        LIMIT 1
    ");
    $stmt->execute([$user_id, $category_name]);
    $cat = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$cat) {
        http_response_code(404);
        error("Category not found");
    }

    $category_id = $cat['id'];

    // get all transactions in this category
    $stmt = $conn->prepare("
        SELECT t.id, t.description, t.amount, t.type, t.created_at,
               c.category_name
        FROM transaction t
        JOIN category c ON t.category_id = c.id
        WHERE t.user_id = ?
          AND t.category_id = ?
        ORDER BY t.created_at DESC
    ");
    $stmt->execute([$user_id, $category_id]);

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    response($rows);
}


// =================================================
//   statistics on specific dates
// =================================================
if ($action === 'sorted_by_day') {

    $data = json_decode(file_get_contents("php://input"), true);
    $date = trim($data['date']); // YYYY-MM-DD

    if ($date === "") {
        http_response_code(400);
        error("Date is empty");
    }

    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
        http_response_code(400);
        error("Invalid date format (YYYY-MM-DD required)");
    }

    $user_id = $_SESSION['user_id'];

    $stmt = $conn->prepare("
        SELECT t.id, t.description, t.amount, t.type, t.created_at,
               c.category_name
        FROM transaction t
        JOIN category c ON t.category_id = c.id
        WHERE t.user_id = ?
          AND DATE(t.created_at) = ?
        ORDER BY t.created_at DESC
    ");

    $stmt->execute([$user_id, $date]);

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC); // data about transactions in this variable

    response($rows);
}

// =================================================
//   sorted by month
// =================================================
if ($action === 'sorted_by_month') {

    $data = json_decode(file_get_contents("php://input"), true);

    $year = trim($data['year']);
    $month = trim($data['month']);
    $user_id = $_SESSION['user_id'];

    if ($year === "" || $month === "") {
        http_response_code(400);
        error("Year or month is empty");
    }

    if (!preg_match('/^\d{4}$/', $year)) {
        http_response_code(400);
        error("Invalid year");
    }

    if (!preg_match('/^(0[1-9]|1[0-2])$/', $month)) {
        http_response_code(400);
        error("Invalid month (01-12)");
    }

    $stmt = $conn->prepare("
        SELECT t.id, t.description, t.amount, t.type, t.created_at,
               c.category_name
        FROM transaction t
        JOIN category c ON t.category_id = c.id
        WHERE t.user_id = ?
          AND YEAR(t.created_at) = ?
          AND MONTH(t.created_at) = ?
        ORDER BY t.created_at DESC
    ");

    $stmt->execute([$user_id, $year, $month]);

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC); // data about transactions in this variable

    response($rows);
}

// =================================================
//   sorted by year
// =================================================
if ($action === 'sorted_by_year') {

    $data = json_decode(file_get_contents("php://input"), true);

    $year = trim($data['year']);
    $user_id = $_SESSION['user_id'];

    if ($year === "") {
        http_response_code(400);
        error("Year is empty");
    }

    if (!preg_match('/^\d{4}$/', $year)) {
        http_response_code(400);
        error("Invalid year format (must be YYYY)");
    }

    $stmt = $conn->prepare("
        SELECT t.id, t.description, t.amount, t.type, t.created_at,
               c.category_name
        FROM transaction t
        JOIN category c ON t.category_id = c.id
        WHERE t.user_id = ?
          AND YEAR(t.created_at) = ?
        ORDER BY t.created_at DESC
    ");

    $stmt->execute([$user_id, $year]);

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC); // data about transactions in this variable
    response($rows);
}


// =================================================
//   result for month or year (nettobudjetti: tulot – menot) also you can choose category and see results for exact category for exact time also you can see transactions for your period which you chose
// =================================================
if ($action === 'summary') {

    $data = json_decode(file_get_contents("php://input"), true);
    $user_id = $_SESSION['user_id'];

    $year = isset($data['year']) ? trim($data['year']) : null;
    $month = isset($data['month']) ? trim($data['month']) : null;
    $category_name = isset($data['category_name']) ? trim($data['category_name']) : null;
    $include_transactions = !empty($data['include_transactions']); // true/false if you want to see transactions with result at one moment

    if (!$year) {
        http_response_code(400);
        error("Year is required");
    }

    if (!preg_match('/^\d{4}$/', $year)) {
        http_response_code(400);
        error("Invalid year format");
    }

    if ($month && !preg_match('/^(0[1-9]|1[0-2])$/', $month)) {
        http_response_code(400);
        error("Invalid month (01-12)");
    }

    $params = [$user_id];
    $date_conditions = " AND YEAR(t.created_at) = ? ";
    $params[] = $year;

    if ($month) {
        $date_conditions .= " AND MONTH(t.created_at) = ? ";
        $params[] = $month;
    }

    $category_condition = "";
    if ($category_name) {
        // choose category
        $stmt = $conn->prepare("
            SELECT id 
            FROM category 
            WHERE user_id = ? AND category_name = ? 
            LIMIT 1
        ");
        $stmt->execute([$user_id, $category_name]);
        $cat = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$cat) {
            http_response_code(404);
            error("Category not found");
        }

        $category_id = $cat['id'];
        $category_condition = " AND t.category_id = ? ";
        $params[] = $category_id;
    }

    // income
    $stmt = $conn->prepare("
        SELECT SUM(amount) as total
        FROM transaction t
        WHERE t.user_id = ?
          AND t.type = 'income'
          $date_conditions
          $category_condition
    ");
    $stmt->execute($params);
    $income = $stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;

    // expense
    $stmt = $conn->prepare("
        SELECT SUM(amount) as total
        FROM transaction t
        WHERE t.user_id = ?
          AND t.type = 'expense'
          $date_conditions
          $category_condition
    ");
    $stmt->execute($params);
    $expense = $stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;

    $nettobudjetti = $income - $expense;

    $response = [
        "income" => (float)$income,
        "expense" => (float)$expense,
        "nettobudjetti" => (float)$nettobudjetti
    ];

    // if you need to return transactions
    if ($include_transactions) {
        $stmt = $conn->prepare("
            SELECT t.id, t.description, t.amount, t.type, t.created_at, c.category_name
            FROM transaction t
            JOIN category c ON t.category_id = c.id
            WHERE t.user_id = ?
              $date_conditions
              $category_condition
            ORDER BY t.created_at DESC
        ");
        $stmt->execute($params);
        $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $response['transactions'] = $transactions;
    }

    response($response);
}


response(["status" => "error", "message" => "Unknown action"]);

?>