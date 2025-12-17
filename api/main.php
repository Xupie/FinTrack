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
function response($data) // function to make code shorter and easier so you dont need to write this 10 times
{
    echo json_encode($data);
    exit;
}

function error($msg) // function to make code shorter and easier so you dont need to write this 10 times
{
    response(["status" => "error", "message" => $msg]);
}

if (!$conn) { // if connection problem comes then notification
    error("Database connection error");
}

$data = json_decode(file_get_contents("php://input"), true) ?? []; // gets json and turns it into an array and, if there is no data, substitutes an empty array
$action = $data['action'] // make action as variable to make code shorter and easier
    ?? $_POST['action'] // with what can work this "action" 
    ?? $_GET['action'] // with what can work this "action"
    ?? null; // with what can work this "action"

// =================================================
// login tarkistus
// =================================================
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    http_response_code(401);
    error("käyttäjä ei ole kirjautunut sisään");
    exit;
}
// =================================================
//   show all categories
// =================================================
if ($action === "show_categories") {
    $user_id = $_SESSION['user_id']; // taking user_id from session to save it in database

    // making sql request to get information from database
    $stmt = $conn->prepare("
        SELECT id, category_name, type
        FROM category
        WHERE user_id = ?
        ORDER BY category_name ASC
    ");

    $stmt->bind_param("i", $user_id); // binding the parameter
    $stmt->execute(); // executing what we have done

    $result = $stmt->get_result(); // getting results from database 
    $rows = $result->fetch_all(MYSQLI_ASSOC); // turn them into an array

    response($rows); // output for frontend
}

// =================================================
//   add category
// =================================================
if ($action === 'add_category') {
    $data = json_decode(file_get_contents("php://input"), true); // gets json and turns it into an array
    $category_name = trim($data['category_name']); // category name from user's input
    $user_id = $_SESSION['user_id']; // taking user id from session
    $type = trim($data['type']); // income or expense

    if ($category_name === "") { // scan for empty places
        http_response_code(400);
        error("Category name is empty");
    }

    if ($type === "") { // checking type for empty places
        http_response_code(400);
        error("Type is empty");
    }

    if ($type !== "income" && $type !== "expense") { // checking for wrong input 
        http_response_code(400);
        error("Invalid type");
    }

    $stmt = $conn->prepare("INSERT INTO category (category_name, user_id, type) VALUES (?, ?, ?)"); // making sql request to get information from database

    // executing our request if something wrong => error
    if (!$stmt->execute([$category_name, $user_id, $type])) {
        http_response_code(400);
        error("DB Error");
    }

    $newId = $conn->insert_id;

    response([
        "status" => "ok",
        "category_id" => $newId
    ]); // output
}

// =================================================
//   edit category
// =================================================
if ($action === 'update_category') {
    $data = json_decode(file_get_contents("php://input"), true); // gets json and turns it into an array
    $category_id = trim($data['category_id']); // taking category id from user's input
    $category_name = trim($data['category_name']); // taking category name from user's input
    $user_id = $_SESSION['user_id']; // taking user id from session
    $type = trim($data['type']); // income or expense

    if ($category_id === "" || $category_name === "" || $type === "") { // scanning for empty places
        http_response_code(400);
        error("Fill all fields");
    }

    if ($type !== "income" && $type !== "expense") { // checking for wrong input 
        http_response_code(400);
        error("Invalid type");
    }
    // making sql request to get information from database
    $stmt = $conn->prepare("
        UPDATE category
        SET category_name = ?, type = ?
        WHERE id = ?
          AND user_id = ?
    ");
    // executing our request if doesnt work => show error
    if (!$stmt->execute([$category_name, $type, $category_id, $user_id])) {
        http_response_code(400);
        error("DB Error");
    }

    response(["status" => "ok"]); // output
}

// =================================================
//   delete category
// =================================================
if ($action === 'delete_category') {

    $data = json_decode(file_get_contents("php://input"), true);
    $category_id = trim($data['category_id']); // taking category id from user's input

    if ($category_id === "") { // scanning for empty places
        http_response_code(400);
        error("Category id is empty");
    }

    // making sql request to get information from database
    $stmt = $conn->prepare("DELETE FROM category WHERE id = ?");

    // executing our request and if something wrong => error
    if (!$stmt->execute([$category_id])) {
        http_response_code(400);
        error("DB Error");
    }

    response(["status" => "ok"]); // output
}

// =================================================
//   add income or expense
// =================================================
if ($action === 'add_transaction') {
    $data = json_decode(file_get_contents("php://input"), true);

    $description = trim($data['description'] ?? ''); // taking description from user's input
    $category_id = trim($data['category'] ?? ''); // taking category id from user's input
    $amount = trim($data['amount'] ?? ''); // taking amount from user's input
    $created_datetime = date('Y-m-d H:i:s'); // taking time from user's pc
    $user_id = $_SESSION['user_id']; // taking user id from session

    if ($description === "" || $category_id === "" || $amount === "") { // scanning for empty places
        http_response_code(400);
        error("Fill all fields");
    }

    if (!ctype_digit($category_id)) { // check for type of input if it is wrong => error
        http_response_code(400);
        error("Invalid category id");
    }

    // making sql request to get information from database
    $stmt = $conn->prepare("
        INSERT INTO transaction (description, category_id, amount, created_at, user_id)
        VALUES (?, ?, ?, ?, ?)
    ");

    // executing our request if something wrong => error
    if (!$stmt->execute([$description, $category_id, $amount, $created_datetime, $user_id])) {
        http_response_code(400);
        error("DB Error");
    }

    response(["status" => "ok"]); // output
}

// =================================================
//   delete income or expense
// =================================================
if ($action === 'delete_transaction') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = trim($data['id']); // taking id from user's input
    $user_id = $_SESSION['user_id'];

    if (!ctype_digit($id)) { // checking for type of input if it is wrong => error
        http_response_code(400);
        error("Invalid id");
    }

    //verification that the transaction belongs to the user, making sql request to get information from database
    $stmt = $conn->prepare("SELECT id FROM transaction WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $id, $user_id);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($res->num_rows === 0) { // error if not
        http_response_code(404);
        error("Transaction not found or access denied");
    }

    // making sql request to get information from database
    $stmt = $conn->prepare("DELETE FROM transaction WHERE id = ?");

    // executing our request and if smthg wrong => error
    if (!$stmt->execute([$id])) {
        http_response_code(400);
        error("DB Error");
    }

    response(["status" => "ok"]); // putput
}

// =================================================
//   update income or expense
// =================================================
if ($action === 'update_transaction') {
    $data = json_decode(file_get_contents("php://input"), true);

    $id = trim($data['id']); // taking id from user's input
    $description = trim($data['description']); // taking description from user's input
    $category_id = trim($data['category']); // taking category id from user's input
    $amount = trim($data['amount']); // taking amount from user's input
    $created_datetime = date('Y-m-d H:i:s'); // taking time from user's pc
    $user_id = $_SESSION['user_id']; // taking user id from session

    if (!ctype_digit($category_id)) { // check for type of input if it is wrong => error
        http_response_code(400);
        error("Invalid category id");
    }

    if (!ctype_digit($id)) { // checking for type of input if wrong => error
        http_response_code(400);
        error("Invalid ID");
    }

    if ($description === "" || $category_id === "" || $amount === "") { // scanning for empty places
        http_response_code(400);
        error("Fill all fields");
    }

    //verification that the transaction belongs to the user, making sql request to get information from database
    $stmt = $conn->prepare("SELECT id FROM transaction WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $id, $user_id);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($res->num_rows === 0) { // error if not
        http_response_code(404);
        error("Transaction not found or access denied");
    }
    // updating the transaction
    $stmt = $conn->prepare("
        UPDATE transaction
        SET description = ?, category_id = ?, amount = ?, created_at = ?
        WHERE id = ? AND user_id = ?
    ");
    $stmt->bind_param("siisii", $description, $category_id, $amount, $created_datetime, $id, $user_id); // binding the parameter

    // error if excuting doesn't go
    if (!$stmt->execute()) {
        http_response_code(400);
        error("DB Error");
    }

    response(["status" => "ok"]); // output
}

// ================================================================
//   show all expenses and incomes sorted by time when it was created
// ================================================================
if ($action === 'show_all') {
    $user_id = $_SESSION['user_id']; // taking user id from session
    // making sql request to get information from database
    $stmt = $conn->prepare("
        SELECT t.id, t.description, t.amount, c.type AS type, t.created_at,
               c.category_name
        FROM transaction t
        JOIN category c ON t.category_id = c.id
        WHERE t.user_id = ?
        ORDER BY t.created_at DESC
    ");

    $stmt->bind_param("i", $user_id); // binding the parameter
    $stmt->execute(); // executing 

    $result = $stmt->get_result(); // getting the result of the request
    $rows = $result->fetch_all(MYSQLI_ASSOC); // we get all the strings as an array

    response($rows); // output
}

// =================================================
//   sorted by categories
// =================================================
if ($action === 'sorted_by_categories') {

    $data = json_decode(file_get_contents("php://input"), true);
    $user_id = $_SESSION['user_id']; // taking user id from session
    $category_id = $data['category_id'] ?? null; // taking category id from user's input
    // checking for type of input and for empty places
    if ($category_id === null || !ctype_digit((string)$category_id)) {
        http_response_code(400);
        error("Category ID is required and must be a number");
    }
    // making category id to number to work with every input
    $category_id = (int)$category_id;

    // making sql request to get information from database
    $stmt = $conn->prepare("
        SELECT id 
        FROM category
        WHERE user_id = ? AND id = ?
        LIMIT 1
    ");
    $stmt->bind_param("ii", $user_id, $category_id); // binding parameters
    $stmt->execute(); // executing
    $res = $stmt->get_result(); // getting result of request
    $cat = $res->fetch_assoc(); // all strings to array

    // check for availability
    if (!$cat) {
        http_response_code(404);
        error("Category not found");
    }

    // making sql request to get information from database
    $stmt = $conn->prepare("
        SELECT t.id, t.description, t.amount, c.type AS type, t.created_at, c.category_name
        FROM transaction t
        JOIN category c ON t.category_id = c.id
        WHERE t.user_id = ? AND t.category_id = ?
        ORDER BY t.created_at DESC
    ");
    $stmt->bind_param("ii", $user_id, $category_id); // binding parameters
    $stmt->execute(); // executing what we have done
    $res = $stmt->get_result(); // getting result of request

    $rows = []; // making array for results
    while ($row = $res->fetch_assoc()) { // saving results in array to output
        $rows[] = $row;
    }

    response($rows); // output
}

// =================================================
//   statistics on specific dates
// =================================================
if ($action === 'sorted_by_day') {
    $data = json_decode(file_get_contents("php://input"), true);
    $user_id = $_SESSION['user_id']; // taking user id from session

    $date = isset($data['date']) ? trim($data['date']) : null; // taking date from user also can be empty YYYY-MM-DD
    $category_id = isset($data['category_id']) ? intval($data['category_id']) : null; //taking category id from user's input also can be empty (filter by category)

    // check for availability
    if (!$date) {
        http_response_code(400);
        error("Date is empty");
    }
    // checking user's input
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
        http_response_code(400);
        error("Invalid date format (YYYY-MM-DD required)");
    }

    // making sql request to get information from database
    $sql = "
        SELECT t.id, t.description, t.amount, c.type AS type, t.created_at, c.category_name
        FROM transaction t
        JOIN category c ON t.category_id = c.id
        WHERE t.user_id = ?
          AND DATE(t.created_at) = ?
    ";

    $params = [$user_id, $date]; // making array with information from user

    // Adding a filter by category, if specified
    if ($category_id) {
        $sql .= " AND t.category_id = ?";
        $params[] = $category_id;
    }
    // to order infromation in desc
    $sql .= " ORDER BY t.created_at DESC";
    // making sql request
    $stmt = $conn->prepare($sql);
    // executing
    $stmt->execute($params);
    //getting result
    $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    response($rows); // output
}

// =================================================
//   sorted by month
// =================================================
if ($action === 'sorted_by_month') {

    $data = json_decode(file_get_contents("php://input"), true);

    $year = isset($data['year']) ? trim($data['year']) : null; // taking year from user
    $month = isset($data['month']) ? trim($data['month']) : null; // taking month from user
    $category_id = isset($data['category_id']) ? trim($data['category_id']) : null; // taking category id from user
    $user_id = $_SESSION['user_id']; // taking user id from session

    // scan for empty places
    if (!$year || !$month) {
        http_response_code(400);
        error("Year or month is empty");
    }

    // checking type of input
    if (!preg_match('/^\d{4}$/', $year)) {
        http_response_code(400);
        error("Invalid year format");
    }

    // cheking type of input
    if (!preg_match('/^(0[1-9]|1[0-2])$/', $month)) {
        http_response_code(400);
        error("Invalid month (01-12)");
    }

    // checking type of input
    if ($category_id && !ctype_digit($category_id)) {
        http_response_code(400);
        error("Invalid category ID");
    }

    // making sql request to get information from database
    $query = "
        SELECT t.id, t.description, t.amount, c.type AS type, t.created_at, c.category_name
        FROM transaction t
        JOIN category c ON t.category_id = c.id
        WHERE t.user_id = ?
          AND YEAR(t.created_at) = ?
          AND MONTH(t.created_at) = ?
    ";

    // making array with information from user
    $params = [$user_id, $year, $month];

    // Filter by category, if specified
    if ($category_id) {
        $query .= " AND t.category_id = ? ";
        $params[] = $category_id;
    }
    // order in desc
    $query .= " ORDER BY t.created_at DESC ";
    //making request
    $stmt = $conn->prepare($query);

    $types = str_repeat('i', count($params)); // make sql know that all parameters are numbers
    $stmt->bind_param($types, ...$params); // insert all the parameters from the array into the SQL query

    $stmt->execute(); // executing
    $res = $stmt->get_result(); // getting result

    $rows = []; // making array for output
    while ($row = $res->fetch_assoc()) { // saving information from database
        $rows[] = $row;
    }

    response($rows); // output
}

// =================================================
//   sorted by year
// =================================================
if ($action === 'sorted_by_year') {

    $data = json_decode(file_get_contents("php://input"), true);
    $year = isset($data['year']) ? trim($data['year']) : null; // taking year from user
    $category_id = isset($data['category_id']) ? trim($data['category_id']) : null; // taking category id from user
    $user_id = $_SESSION['user_id']; // taking user id from session

    // checking for empty places
    if (!$year) {
        http_response_code(400);
        error("Year is empty");
    }
    // checking for type of input
    if (!preg_match('/^\d{4}$/', $year)) {
        http_response_code(400);
        error("Invalid year format");
    }
    // checking for type of input
    if ($category_id && !ctype_digit($category_id)) {
        http_response_code(400);
        error("Invalid category ID");
    }
    // making sql request
    $query = "
        SELECT t.id, t.description, t.amount, c.type AS type, t.created_at, c.category_name
        FROM transaction t
        JOIN category c ON t.category_id = c.id
        WHERE t.user_id = ?
          AND YEAR(t.created_at) = ?
    ";
    $params = [$user_id, $year]; // making array with user's information

    /// ============== Builds an SQL query with an optional filter, adjusts the parameters automatically, and executes the query safely =================
    if ($category_id) {
        $query .= " AND t.category_id = ? ";
        $params[] = $category_id;
    }

    $query .= " ORDER BY t.created_at DESC ";

    $stmt = $conn->prepare($query);
    $types = 'ii';
    if ($category_id) $types .= 'i';
    $stmt->bind_param($types, ...$params);
    // =================================================================================================================================================

    $stmt->execute(); // executing 
    $res = $stmt->get_result(); // getting result

    $rows = [];
    while ($row = $res->fetch_assoc()) { // saving result for output from database
        $rows[] = $row;
    }

    response($rows); // output
}

// =================================================
//   result for month or year (nettobudjetti: tulot – menot) also you can choose category and see results for exact category for exact time also you can see transactions for your period which you chose
// =================================================
if ($action === 'summary') {

    $data = json_decode(file_get_contents("php://input"), true);
    $user_id = $_SESSION['user_id']; // taking user's id from session

    $year = isset($data['year']) ? trim($data['year']) : null; // taking year from user
    $month = isset($data['month']) ? trim($data['month']) : null; // taking month from user
    $category_id = isset($data['category_id']) ? trim($data['category_id']) : null; // taking category id from user
    $include_transactions = !empty($data['include_transactions']); // taking info about transactions to show them or not (true/false)

    // checking for empty places
    if (!$year) {
        http_response_code(400);
        error("Year is required");
    }
    // checking input type
    if (!preg_match('/^\d{4}$/', $year)) {
        http_response_code(400);
        error("Invalid year format");
    }
    // checking input type
    if ($month && !preg_match('/^(0[1-9]|1[0-2])$/', $month)) {
        http_response_code(400);
        error("Invalid month (01-12)");
    }
    // checking input type
    if ($category_id && !ctype_digit($category_id)) {
        http_response_code(400);
        error("Invalid category ID");
    }

    $params = [$user_id]; // making array with user id
    $date_conditions = " AND YEAR(t.created_at) = ? "; // condition with year (required) 
    $params[] = $year; // adding to array

    if ($month) { // if month exist in input then work with him
        $date_conditions .= " AND MONTH(t.created_at) = ? "; // adding it to our conditions
        $params[] = $month; // adding to array
    }

    $category_condition = ""; // making string type 
    if ($category_id) { // if exists => use
        $category_condition = " AND t.category_id = ? "; // adding to conditions
        $params[] = $category_id; // adding to array
    }

    // --- Income sql request ---
    $query_income = "
        SELECT SUM(t.amount) as total
        FROM transaction t
        JOIN category c ON t.category_id = c.id
        WHERE t.user_id = ?
          AND c.type = 'income'
          $date_conditions
          $category_condition
    ";
    $stmt = $conn->prepare($query_income); // making request
    $types = str_repeat('i', count($params)); //
    $stmt->bind_param($types, ...$params); // binding parameters
    $stmt->execute(); // executing
    $res = $stmt->get_result(); // getting result
    $income = $res->fetch_assoc()['total'] ?? 0; // making variable to save result and work with him in future

    // --- Expense sql request ---
    $query_expense = "
        SELECT SUM(t.amount) as total
        FROM transaction t
        JOIN category c ON t.category_id = c.id
        WHERE t.user_id = ?
          AND c.type = 'expense'
          $date_conditions
          $category_condition
    ";
    $stmt = $conn->prepare($query_expense); // making request
    $stmt->bind_param($types, ...$params); //
    $stmt->execute(); // executing request
    $res = $stmt->get_result(); // getting result
    $expense = $res->fetch_assoc()['total'] ?? 0; // saving in variable to work with information in future

    $nettobudjetti = $income - $expense; // making variable to budjet and using 2 variables who were appointed earlier

    $response = [ // making output as array and putting there our variables
        "income" => (float)$income,
        "expense" => (float)$expense,
        "nettobudjetti" => (float)$nettobudjetti
    ];

    // if you need to refund transactions
    if ($include_transactions) { // if exists in request
        //making request
        $query_trans = "
            SELECT t.id, t.description, t.amount, c.type AS type, t.created_at, c.id AS category_id, c.category_name
            FROM transaction t
            JOIN category c ON t.category_id = c.id
            WHERE t.user_id = ?
              $date_conditions
              $category_condition
            ORDER BY t.created_at DESC
        ";
        //preparing our request
        $stmt = $conn->prepare($query_trans);
        $stmt->bind_param($types, ...$params); // 
        $stmt->execute(); // excuting request
        $res = $stmt->get_result(); // getting result

        $transactions = []; // array for output
        while ($row = $res->fetch_assoc()) {
            $transactions[] = $row; // saving info in to array
        }
        $response['transactions'] = $transactions; // output
    }

    response($response); // output
}
response(["status" => "error", "message" => "Unknown action"]); // if action does not exist
