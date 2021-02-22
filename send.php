<?php 
header('Access-Control-Allow-Origin: *'); 
header('Content-Type: application/json');
include 'funcionesSF.php';


$JSONData = file_get_contents("php://input");
$params = json_decode($JSONData);

if($params->language == "es"){
    $correo = SendMessage(rand_string('30').$params->guest->passport, 'APIformcovidEs', $params->guest->email, array("count"=>$params->count, "language"=> 'es-MX', "name" => $params->guest->name ));
} else {
    $correo = SendMessage(rand_string('30').$params->guest->passport, 'APIformcovidEn', $params->guest->email, array("count"=>$params->count,"language"=> 'en-US', "name" => $params->guest->name ));
}


echo json_encode(array("code"=>1, "result"=> "todo bien", "emailResponse" => $correo));

?>
