<?php

    header('Content-Type: application/json');

    $connection;

    /* Handle requests */

    $action = isset($_REQUEST['action']) ? $_REQUEST['action'] : "";
    $data = isset($_REQUEST['data']) ? $_REQUEST['data'] : array();
    switch($action){
        case "get-charted-fridge-items":
            connect();
            output( get_charted_fridge_items() );
        case "get-available-fridge-items":
            connect();
            output( get_available_fridge_items() );
        case "create-fridge-item":
            connect();
            output( create_new_fridge_item($data) );
        case "add-items-to-chart":
            connect();
            output( add_fridge_item_to_chart($data) );
    }

    function connect(){
        /* Connect to the database */
        global $connection;
        $connection = mysqli_connect("mysql", "fridgemaster", "inafridge", "bfridged");
        if(!$connection){
            return "Unable to connect to database.";
        }
        if(!$connection->select_db("bfridged")){
            return "Unable to select database";
        }
        $connection->set_charset('utf8');
    }

    function add_fridge_item_to_chart($data){
        global $connection;

        if( !isset($data['id']) ){
            return 0;
        }

        $id = $data['id'];
        $id = $connection->escape_string($id);
        if(is_valid_fridge_id($id)){
            $timestamp = date('Y-m-d H:i:s');

            // State = queued, checkout, closed
            $query = "INSERT INTO fridge_items_history (fid, timestamp, state, userid)
                        VALUES ($id, '$timestamp', 'queued', 0)";
            $result = $connection->query($query);
            return $result;
        }
        return "invalid input";

    }

    function create_new_fridge_item($data){
        global $connection;

        if( !isset($data['name']) || !isset($data['expiration']) ){
            return 0;
        }
        $name = $data['name'];
        $expiration = $data['expiration'];

        $name = $connection->escape_string($name);
        $expiration = $connection->escape_string($expiration);

        if(is_valid_fridge_name($name) && is_valid_fridge_expiration($expiration)){
            $query = "INSERT INTO fridge_items (name, expiration)
                        VALUES ('$name', $expiration)";
            $result = $connection->query($query);
            return $result;
        }
        return "invalid input";

    }
    function get_available_fridge_items(){
        global $connection;
        $query = "SELECT id, name, expiration from fridge_items";
        $result = $connection->query($query);
        $data = array();
        while($row = $result->fetch_assoc()){
            $data[] = $row;
        }
        return $data;
    }


    function get_charted_fridge_items(){

        global $connection;
        $query = "SELECT fi.id, fi.name, fi.expiration, fih.timestamp, fih.state
            FROM fridge_items fi, fridge_items_history fih
            WHERE fi.id = fih.fid";
        $result = $connection->query($query);
        $data = array();
        while($row = $result->fetch_assoc()){
            $elapsed = (time() - strtotime($row['timestamp'])) / 60 / 60 / 24;
            $data[] = array(
                "id" => $row['id'],
                "name" => $row['name'],
                "date" => substr($row['timestamp'], 0, 10),
                "elapsed" => floor($elapsed),
                "expiration" => $row['expiration'],
                "expired" => $elapsed - $row['expiration']
            );
        }

        return $data;
    }

    function is_valid_fridge_id($id){
        // TODO
        return true;
    }

    function is_valid_fridge_expiration($expiration){
        // $expiration
        // TODO
        return true;
    }

    function is_valid_fridge_name($name){
        // TODO
        return true;
    }

    function output($data, $utf8_encode = false){
        $outp = array(
            "error" => 0,
            "message" => "success",
            "data" => $data
        );

        echo json_encode($outp, $utf8_encode);
        exit();
    }

?>
