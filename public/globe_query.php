<?php
$config = json_decode(file_get_contents("../config.json"), true);

$precision = isset($_GET['precision']) ? $_GET['precision'] : -1;
$keyphrase = isset($_GET['q']) ? $_GET['q'] : null;

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if(!is_numeric($precision)){
    echo "[]";
    die(1);
}

// Create connection
$conn = new mysqli($config['host'], $config['user'], $config['password'], $config['database']);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$where_clause = isset($keyphrase) ? " WHERE text LIKE '%" . $conn->real_escape_string($keyphrase) . "%'" : "";

$sql = "SELECT ROUND(longitude, " . $precision . "), ROUND(latitude, " . $precision . "), COUNT(*) FROM tweets" . $where_clause . " GROUP BY ROUND(longitude, " . $precision . "), ROUND(latitude, " . $precision . ")";

$result = $conn->query($sql . ";");

$result_array = array();
if ($result) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
    	$result_array[] = array(
    		'long' => (float)$row['ROUND(longitude, ' . $precision . ')'],
    		'lat' => (float)$row['ROUND(latitude, ' . $precision . ')'],
    		'count' => (int)$row['COUNT(*)']
    	);
    }
    echo json_encode($result_array);
} else {
    echo "[]";
}
$conn->close();

?>