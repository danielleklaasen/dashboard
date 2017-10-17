<?php

// get parameters
$sReportId = $_GET['id'];
$sReportStatus = $_GET['status'];

$ajReports = [];

// store content from file in sajReportsDatabase var
$sajReports = file_get_contents( "reports.txt" );
// and convert to JSON.
$ajReports = json_decode($sajReports);

foreach ( $ajReports as $key=>$jReport ){
    if ( $sReportId == $key ){
        // update status
        $jReport->status = $sReportStatus;
        break;
    }
}

// convert array back to text
$sajReports = json_encode( $ajReports , JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE );

// save to file properties.txt
file_put_contents("reports.txt", $sajReports);

echo '{"status":"ok"}';


?>