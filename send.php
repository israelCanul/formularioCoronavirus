<?php 

$isDev = false;

$JSONData = file_get_contents("php://input");
$guests = json_decode($JSONData);


$message = '';

    foreach ($guests->guest as $key => $value) {
        
        $message .= '
        Guest #'.$key.'
        FullName: '.$value->name.' 
        Email: '.$value->email.' 
        Birthdate: '.$value->birthdate.' 
        Resort: '.$guests->guest[0]->resort.' 
        TestType: '.$value->type.' 
        Villa: '.$value->villa.' 
        ReservationNumber: '.$value->reservation.' 
        Departure: '.$value->departure.'
        FlightTime: '.$value->flight.'
        ';
    }


    echo $message;
?>