<?php
session_start();

include "db.php";

header('Content-Type: application/json');

$conn = getConnection();
$method = $_SERVER["REQUEST_METHOD"];

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

    if (!$stmt->execute([$category_name, $user_id, $type])) {
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

    $description = trim($data['description'] ?? '');
    $category_id = trim($data['category'] ?? '');
    $amount = trim($data['amount'] ?? '');
    $created_datetime = date('Y-m-d H:i:s');
    $user_id = $_SESSION['user_id'];

    if ($description === "" || $category_id === "" || $amount === "") {
        http_response_code(400);
        error("Fill all fields");
    }

    if (!ctype_digit($category_id)) {
        http_response_code(400);
        error("Invalid category id");
    }

    $stmt = $conn->prepare("
        INSERT INTO transaction (description, category_id, amount, created_at, user_id)
        VALUES (?, ?, ?, ?, ?)
    ");

    if (!$stmt->execute([$description, $category_id, $amount, $created_datetime, $user_id])) {
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
    $user_id = $_SESSION['user_id'];

    if (!ctype_digit($id)) {
        http_response_code(400);
        error("Invalid ID");
    }

    if ($description === "" || $category_id === "" || $amount === "") {
        http_response_code(400);
        error("Fill all fields");
    }

    // verification that the transaction belongs to the user
    $stmt = $conn->prepare("SELECT id FROM transaction WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $id, $user_id);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($res->num_rows === 0) {
        http_response_code(404);
        error("Transaction not found or access denied");
    }
    // updating the transaction
    $stmt = $conn->prepare("
        UPDATE transaction
        SET description = ?, category_id = ?, amount = ?, created_at = ?
        WHERE id = ? AND user_id = ?
    ");
    $stmt->bind_param("siisii", $description, $category_id, $amount, $created_datetime, $id, $user_id);

    if (!$stmt->execute()) {
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
        SELECT t.id, t.description, t.amount, c.type AS type, t.created_at,
               c.category_name
        FROM transaction t
        JOIN category c ON t.category_id = c.id
        WHERE t.user_id = ?
        ORDER BY t.created_at DESC
    ");

    $stmt->bind_param("i", $user_id); // binding the parameter
    $stmt->execute();

    $result = $stmt->get_result(); // getting the result of the request
    $rows = $result->fetch_all(MYSQLI_ASSOC); // we get all the strings as an array

    response($rows);
}

// =================================================
//   sorted by categories
// =================================================
if ($action === 'sorted_by_categories') {

    $data = json_decode(file_get_contents("php://input"), true);
    $user_id = $_SESSION['user_id'];

    $category_id = $data['category_id'] ?? null;
    if ($category_id === null || !ctype_digit((string)$category_id)) {
        http_response_code(400);
        error("Category ID is required and must be a number");
    }
    $category_id = (int)$category_id;

    $stmt = $conn->prepare("
        SELECT id 
        FROM category
        WHERE user_id = ? AND id = ?
        LIMIT 1
    ");
    $stmt->bind_param("ii", $user_id, $category_id);
    $stmt->execute();
    $res = $stmt->get_result();
    $cat = $res->fetch_assoc();

    if (!$cat) {
        http_response_code(404);
        error("Category not found");
    }

    $stmt = $conn->prepare("
        SELECT t.id, t.description, t.amount, c.type AS type, t.created_at, c.category_name
        FROM transaction t
        JOIN category c ON t.category_id = c.id
        WHERE t.user_id = ? AND t.category_id = ?
        ORDER BY t.created_at DESC
    ");
    $stmt->bind_param("ii", $user_id, $category_id);
    $stmt->execute();
    $res = $stmt->get_result();

    $rows = [];
    while ($row = $res->fetch_assoc()) {
        $rows[] = $row;
    }

    response($rows);
}

// =================================================
//   statistics on specific dates
// =================================================
if ($action === 'sorted_by_day') {
    $data = json_decode(file_get_contents("php://input"), true);
    $user_id = $_SESSION['user_id'];

    $date = isset($data['date']) ? trim($data['date']) : null; // YYYY-MM-DD
    $category_id = isset($data['category_id']) ? intval($data['category_id']) : null; // filter by category

    if (!$date) {
        http_response_code(400);
        error("Date is empty");
    }

    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
        http_response_code(400);
        error("Invalid date format (YYYY-MM-DD required)");
    }

    $sql = "
        SELECT t.id, t.description, t.amount, c.type AS type, t.created_at, c.category_name
        FROM transaction t
        JOIN category c ON t.category_id = c.id
        WHERE t.user_id = ?
          AND DATE(t.created_at) = ?
    ";

    $params = [$user_id, $date];

    // Adding a filter by category, if specified
    if ($category_id) {
        $sql .= " AND t.category_id = ?";
        $params[] = $category_id;
    }

    $sql .= " ORDER BY t.created_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    response($rows);
}

// =================================================
//   sorted by month
// =================================================
if ($action === 'sorted_by_month') {

    $data = json_decode(file_get_contents("php://input"), true);

    $year = isset($data['year']) ? trim($data['year']) : null;
    $month = isset($data['month']) ? trim($data['month']) : null;
    $category_id = isset($data['category_id']) ? trim($data['category_id']) : null;
    $user_id = $_SESSION['user_id'];

    if (!$year || !$month) {
        http_response_code(400);
        error("Year or month is empty");
    }

    if (!preg_match('/^\d{4}$/', $year)) {
        http_response_code(400);
        error("Invalid year format");
    }

    if (!preg_match('/^(0[1-9]|1[0-2])$/', $month)) {
        http_response_code(400);
        error("Invalid month (01-12)");
    }

    if ($category_id && !ctype_digit($category_id)) {
        http_response_code(400);
        error("Invalid category ID");
    }

    $query = "
        SELECT t.id, t.description, t.amount, c.type AS type, t.created_at, c.category_name
        FROM transaction t
        JOIN category c ON t.category_id = c.id
        WHERE t.user_id = ?
          AND YEAR(t.created_at) = ?
          AND MONTH(t.created_at) = ?
    ";

    $params = [$user_id, $year, $month];

    // Filter by category, if specified
    if ($category_id) {
        $query .= " AND t.category_id = ? ";
        $params[] = $category_id;
    }

    $query .= " ORDER BY t.created_at DESC ";

    $stmt = $conn->prepare($query);

    $types = str_repeat('i', count($params));
    $stmt->bind_param($types, ...$params);

    $stmt->execute();
    $res = $stmt->get_result();

    $rows = [];
    while ($row = $res->fetch_assoc()) {
        $rows[] = $row;
    }

    response($rows);
}

// =================================================
//   sorted by year
// =================================================
if ($action === 'sorted_by_year') {

    $data = json_decode(file_get_contents("php://input"), true);
    $year = isset($data['year']) ? trim($data['year']) : null;
    $category_id = isset($data['category_id']) ? trim($data['category_id']) : null;
    $user_id = $_SESSION['user_id'];

    if (!$year) {
        http_response_code(400);
        error("Year is empty");
    }

    if (!preg_match('/^\d{4}$/', $year)) {
        http_response_code(400);
        error("Invalid year format");
    }

    if ($category_id && !ctype_digit($category_id)) {
        http_response_code(400);
        error("Invalid category ID");
    }

    $query = "
        SELECT t.id, t.description, t.amount, c.type AS type, t.created_at, c.category_name
        FROM transaction t
        JOIN category c ON t.category_id = c.id
        WHERE t.user_id = ?
          AND YEAR(t.created_at) = ?
    ";
    $params = [$user_id, $year];

    if ($category_id) {
        $query .= " AND t.category_id = ? ";
        $params[] = $category_id;
    }

    $query .= " ORDER BY t.created_at DESC ";

    $stmt = $conn->prepare($query);
    $types = 'ii';
    if ($category_id) $types .= 'i';
    $stmt->bind_param($types, ...$params);

    $stmt->execute();
    $res = $stmt->get_result();

    $rows = [];
    while ($row = $res->fetch_assoc()) {
        $rows[] = $row;
    }

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
    $category_id = isset($data['category_id']) ? trim($data['category_id']) : null;
    $include_transactions = !empty($data['include_transactions']); // true/false

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
    if ($category_id && !ctype_digit($category_id)) {
        http_response_code(400);
        error("Invalid category ID");
    }

    $params = [$user_id];
    $date_conditions = " AND YEAR(t.created_at) = ? ";
    $params[] = $year;

    if ($month) {
        $date_conditions .= " AND MONTH(t.created_at) = ? ";
        $params[] = $month;
    }

    $category_condition = "";
    if ($category_id) {
        $category_condition = " AND t.category_id = ? ";
        $params[] = $category_id;
    }

    // --- Income ---
    $query_income = "
        SELECT SUM(t.amount) as total
        FROM transaction t
        JOIN category c ON t.category_id = c.id
        WHERE t.user_id = ?
          AND c.type = 'income'
          $date_conditions
          $category_condition
    ";
    $stmt = $conn->prepare($query_income);
    $types = str_repeat('i', count($params));
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $res = $stmt->get_result();
    $income = $res->fetch_assoc()['total'] ?? 0;

    // --- Expense ---
    $query_expense = "
        SELECT SUM(t.amount) as total
        FROM transaction t
        JOIN category c ON t.category_id = c.id
        WHERE t.user_id = ?
          AND c.type = 'expense'
          $date_conditions
          $category_condition
    ";
    $stmt = $conn->prepare($query_expense);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $res = $stmt->get_result();
    $expense = $res->fetch_assoc()['total'] ?? 0;

    $nettobudjetti = $income - $expense;

    $response = [
        "income" => (float)$income,
        "expense" => (float)$expense,
        "nettobudjetti" => (float)$nettobudjetti
    ];

    // if you need to refund transactions
    if ($include_transactions) {
        $query_trans = "
            SELECT t.id, t.description, t.amount, c.type AS type, t.created_at, c.category_name
            FROM transaction t
            JOIN category c ON t.category_id = c.id
            WHERE t.user_id = ?
              $date_conditions
              $category_condition
            ORDER BY t.created_at DESC
        ";
        $stmt = $conn->prepare($query_trans);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $res = $stmt->get_result();

        $transactions = [];
        while ($row = $res->fetch_assoc()) {
            $transactions[] = $row;
        }
        $response['transactions'] = $transactions;
    }

    response($response);
}
response(["status" => "error", "message" => "Unknown action"]);
?>