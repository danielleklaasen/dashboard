<?php

// get parameters
// $sReportStatus = $_GET['status'];

$iLastReportId = 0;
$ajReports = [];

// store content from file in sajReportsDatabase var
$sajReportsDatabase = file_get_contents( "reports.txt" );
// and convert to JSON.
$ajReportsDatabase = json_decode($sajReportsDatabase);

if( !is_array($ajReportsDatabase) ) {
    // data is corrupted
    echo '{"status":"error", "id":"001", "message":"could not work with the database"}';
    exit; // doei ( = bye, learned some Dutch today as well, hurray!)
}

// still here? Means we have data YEAH
$ajReportsToClient = [];

// run through each item in array and add to $ajReportsToClient
// doing this MINIMIZES server requests. You're welcome <3

foreach( $ajReportsDatabase as $key=>$jReport){

    if($key >= $iLastReportId && $jReport->status == "0" )
    {
        array_push( $ajReportsToClient, $jReport);
        $iLastReportId = $key;
    }
}

$sajReportsToClient = json_encode( $ajReportsToClient , JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE );

echo $sajReportsToClient;

?>