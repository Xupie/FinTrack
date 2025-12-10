<?php
session_start();
$_SESSION = [];
echo json_encode(["status" => "Logged out"]);
session_destroy();
exit;
?>
