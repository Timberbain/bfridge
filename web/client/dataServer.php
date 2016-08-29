<?php

    header('Content-Type: application/json');

    /* Connect to the database */
    $connection = mysqli_connect("mysql", "admin", "password", "mybase");
    if(!$connection){
        echo "Unable to connect to database.";
    }


    /* Handle requests */

    $action = isset($_REQUEST['action']) ? $_REQUEST['action'] : "";

    switch($action){
        case "get-fridge-items": output( get_fridge_items() );
    }

    function get_fridge_items(){
        $data = array(
            array("id" => 0, "name" => "Mjölk", "date" => "2015-10-25", "elapsed" => "15 days"),
            array("id" => 1, "name" => "Smör", "date" => "2015-10-30", "elapsed" => "10 days"),
            array("id" => 2, "name" => "Socker", "date" => "2015-11-04", "elapsed" => "5 days"),
            array("id" => 3, "name" => "Glass", "date" => "2015-11-08", "elapsed" => "1 day"),
            array("id" => 4, "name" => "Bakpulver", "date" => "2015-11-08", "elapsed" => "10 hours")
        );
        return $data;
    }

    function output($data, $utf8_encode = false){
        $outp = array(
            "error" => 0,
            "message" => "success",
            "data" => $data
        );

        echo json_encode($outp, $utf8_encode);
    }

?>
