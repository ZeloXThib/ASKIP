<?
header("Access-Control-Allow-Origin: *");  

$connect = new PDO("mysql:host=twommexdgn1622.mysql.db;dbname=twommexdgn1622;charset=utf8", "twommexdgn1622", "Aqwzsxedc123");
//$connect = new PDO("mysql:host=localhost.mysql.db;dbname=stations;charset=utf8", "root", "");

$req = $connect->query('SELECT * FROM stations');

$data = array();

while ($row = $req->fetch()) {
    $data[ $row['station_uid'] ] = $row; 
}

echo json_encode($data); 