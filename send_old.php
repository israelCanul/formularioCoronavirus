<?php

return true;
    exit(0);

   header('Access-Control-Allow-Origin: *'); 
   header('Content-Type: application/json');

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
    
    
    $correo = 'citasroyalresorts@amerimedhospitals.com';
    $correoCC = 'media@royalresorts.com';
    $correoP = 'acastrom@royalresorts.com';
    switch ($guests->guest[0]->resort) {
        case 'The Royal Haciendas':
            // echo "entro aqui RS";
            $correoP = 'acastrom@royalresorts.com';
            $correo = 'citasroyalhaciendas@amerimedhospitals.com';
            break;
        default:
        $correoP = 'acastrom@royalresorts.com';
        $correo = 'citasroyalresorts@amerimedhospitals.com';
            break;
    }
    if($isDev){
        $correo =  $correoP;
        $correoCC = $correoP;
    }

    // var_dump($correo);
    // var_dump($correoCC);
    // exit(0);

       $soapUrl = "https://wprdinternet.servicesrr.com:444/generalservice/Generalservice.asmx?op=wmSendGmailEmail"; // asmx URL of WSDL
		$xml_post_string = '<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
            <wmSendGmailEmail xmlns="http://tempuri.org/">
            <userEmail>icanul@royalresorts.com</userEmail>
            <userPassword>singfsingf2809</userPassword>
            <strEmailFrom>noreply@royalresorts.com</strEmailFrom>
            <strEmailTo>
                <string>'.$correo.'</string>	
            </strEmailTo>
            <strEmailCc>
                <string>'.$correoCC.'</string>	
            </strEmailCc>
            <strEmailBcc>
            </strEmailBcc>
            <strSubject>RESERVATION - COVID-19 Test</strSubject>
            <strBody>
                '.$message.'
            </strBody>
            <blnIsHTML>false</blnIsHTML>
            </wmSendGmailEmail>
        </soap:Body>
        </soap:Envelope>'; // data from the form, e.g. some ID number




        $headers = array(
            "Content-type: text/xml;charset=\"utf-8\"",
            "Accept: text/xml",
            "Cache-Control: no-cache",
            "Pragma: no-cache",
            "SOAPAction: http://tempuri.org/wmSendGmailEmail", 
            "Content-length: ".strlen($xml_post_string),
        ); //SOAPAction: your op URL

            $url = $soapUrl;

            // PHP cURL  for https connection with auth
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 1);
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_DIGEST);
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $xml_post_string); // the SOAP request
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); //IMP if the url has https and you don't want to verify source certificate

            // converting
            $response = curl_exec($ch); 
            curl_close($ch);

            // converting
            $response1 = str_replace("<soap:Body>","",$response);
            $response2 = str_replace("</soap:Body>","",$response1);

            // convertingc to XML
            $parser = simplexml_load_string($response2);
            //    var_dump($parser);
            echo json_encode($parser);
            // user $parser to get your data out of XML response and to display it.
		
		

?>