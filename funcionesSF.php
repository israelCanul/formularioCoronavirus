<?php 

function rand_string( $length ) {  
    $chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";  
    $size = strlen( $chars );  
    // echo "Random string =";  
    $strigRandom = 'HT';
    for( $i = 0; $i < $length; $i++ ) {  
        $str= $chars[ rand( 0, $size - 1 ) ];  
        $strigRandom = $strigRandom.$str;  
    }
    return $strigRandom;
} 

function SendMessage($messageKey, $keyDefinition, $contactKey, $vars){
    $objToken = getToken();
    if($objToken['code'] == 0){
        $data =array(
                "definitionKey"=> $keyDefinition,
                "recipient" => array(
                    "contactKey" =>  $contactKey,
                    "attributes" => $vars
                ),
            );
          
        $data_string = json_encode($data);
        $ch = curl_init($objToken ['token']["rest_instance_url"].'/messaging/v1/email/messages/'.$messageKey);  
        // var_dump($data_string);                                                           
        curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, false); 
        curl_setopt ($ch, CURLOPT_SSLVERSION, 6);
        curl_setopt ($ch, CURLOPT_POSTFIELDS, $data_string);
        curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt ($ch, CURLOPT_POST, true);
        // curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
        curl_setopt ($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json','Authorization:Bearer '.$objToken ['token']["access_token"],'Content-Length: ' . strlen($data_string)));
        $resultAdd = curl_exec($ch);
        $err = curl_error($ch);
        $resultAdd = (Array) json_decode($resultAdd);
        // var_dump($resultAdd);
        // exit(0);  
        return $resultAdd;
    }
}


function getToken(){
    include "credencialesSF.php";
    
    $data = array(
        "grant_type" => "client_credentials", 
        "client_id" =>$usserSalesforce, 
        "client_secret" =>$passSalesforce,
        "scope" => "data_extensions_write data_extensions_read email_write list_and_subscribers_read list_and_subscribers_write email_send",
        "account_id" => $accountIDSalesforce
    );  
    $ch = curl_init($urlSalesforce);

    $data_string = json_encode($data);

    curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, false); 
    curl_setopt ($ch, CURLOPT_SSLVERSION, 6);
    curl_setopt ($ch, CURLOPT_POSTFIELDS, $data_string);
    curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt ($ch, CURLOPT_POST, true);
    curl_setopt ($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json','Content-Length: ' . strlen($data_string)));
    $resultGetToken = curl_exec($ch);
    $resultGetToken = (Array) json_decode($resultGetToken);
    $resultLogin = array("code"=>0);
    if(!isset($resultGetToken["error"])){
        $resultLogin = array("code"=>0, "token"=> $resultGetToken);
    } else{
        $resultLogin = array("code"=>-1);
    }
    return $resultLogin;
  }

?>