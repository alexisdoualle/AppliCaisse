<?php
define("HOST", "db674606904.db.1and1.com");
define("USER", "dbo674606904");
define("PASSWORD", "youpi007");
define("DATABASE", "db674606904");
$conn = new mysqli(HOST,USER,PASSWORD,DATABASE);
mysqli_set_charset($conn,"utf8");
if ($conn->connect_error) {
    die("Connection échouée: " . $conn->connect_error);
}
?>
