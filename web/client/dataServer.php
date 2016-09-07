<?php

    header('Content-Type: application/json');

    date_default_timezone_set("Europe/Stockholm");
    $connection;

    /* Handle requests */

    $action = isset($_REQUEST['action']) ? $_REQUEST['action'] : "";
    $data = isset($_REQUEST['data']) ? $_REQUEST['data'] : array();
    // output($action);
    switch($action){
        case "get-carted-and-queued-fridge-items":
            connect();
            output( get_carted_and_queued_fridge_items() );
        case "get-available-fridge-items":
            connect();
            output( get_available_fridge_items() );
        case "create-fridge-item":
            connect();
            output( create_new_fridge_item($data) );
        case "remove-item-from-cart":
            connect();
            output( remove_fridge_item_from_cart($data) );
        case "add-items-to-cart":
            connect();
            output( add_fridge_item_to_cart($data) );
        case "add-item-to-buy-queue":
            connect();
            output( add_item_to_buy_queue($data) );
        case "remove-item-from-buy-queue":
            connect();
            output( remove_item_from_buy_queue($data) );
        case "buy-all-queued-items":
            connect();
            output( buy_all_queued_items() );
        default:
            output("No action called: $action");
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

    function queue_item($hid){
        return change_item_state($hid, "queued");
    }
    function unqueue_item($hid){
        return change_item_state($hid, "carted");
    }
    function close_item($hid){
        return change_item_state($hid, "closed");
    }
    function open_item($hid){
        return change_item_state($hid, "queued");
    }

    function change_item_state($hid, $state){
        global $connection;
        $item = get_fridge_history_item($hid);
        if($item === false) return "Item not found";
        $queued = "null";
        $closed = "null";
        switch($state){
            case "carted":
                /* already set to null */
                break;
            case "queued":
                $queued = "'".now()."'";
                break;
            case "closed":
                if($item['queued'] == null){
                    $queued = "'".now()."'";
                }
                $closed = "'".now()."'";
                break;
        }
        $query = "UPDATE fridge_items_history SET queued=$queued, closed=$closed WHERE hid=$hid";

        if(!$connection->query($query)){
            return "Unable to update state of item";
        }

    }

    function handle_item_buy_queue($data, $add){
        global $connection;
        if( !isset($data['hid']) ){
            return "Item id is not set";
        }

        $id = $data['hid'];
        $id = $connection->escape_string($id);

        if(fridge_item_exists_in_cart($id)){
            if($add){
                return queue_item($id);
            } else {
                return unqueue_item($id);
            }
        }
        return "Item does now exist in cart";
    }



    function add_item_to_buy_queue($data){
        return handle_item_buy_queue($data, true);
    }

    function remove_item_from_buy_queue($data){
        return handle_item_buy_queue($data, false);
    }

    function buy_all_queued_items(){
        global $connection;

        $query = "SELECT * FROM fridge_items_history where queued is not null";
        if(!$result = $connection->query($query)){
            return "Unable to fetch queued items";
        }
        $hids = array();
        while($row = $result->fetch_assoc()){
            $hids[] = $row['hid'];
        }
        $closed = now();
        $hid_str = implode(",", $hids);
        $query = "UPDATE fridge_items_history SET closed='$closed' WHERE hid in ($hid_str)";

        if(!$connection->query($query)){
            return "Unable to buy queued items";
        } else {
            return "Successfully bought items";
        }
    }

    function add_fridge_item_to_cart($data){
        global $connection;

        if( !isset($data['id']) ){
            return 0;
        }

        $id = $data['id'];
        $id = $connection->escape_string($id);
        if(is_valid_fridge_id($id)){

            $timestamp = now();

            // State = carted, queued, closed
            $query = "INSERT INTO fridge_items_history (fid, carted, queued, closed, userid)
                        VALUES ($id, '$timestamp', null, null, 0)";
            $result = $connection->query($query);
            return $result;
        }
        return "invalid input";
    }

    function remove_fridge_item_from_cart($data){
        global $connection;

        if( !isset($data['hid']) ){
            return 0;
        }

        $hid = $data['hid'];
        $hid = $connection->escape_string($hid);
        if(fridge_item_exists_in_cart($hid)){
            $query = "DELETE FROM fridge_items_history WHERE hid=$hid";
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
    function get_fridge_history_item($hid){
        global $connection;
        $query = "SELECT * FROM fridge_items_history WHERE hid=$hid";
        $result = $connection->query($query);
        return $result->fetch_assoc();

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


    function get_carted_and_queued_fridge_items(){

        global $connection;
        $query = "SELECT fih.hid, fi.id as fid, fi.name, fi.expiration, fih.carted, fih.queued
            FROM fridge_items fi, fridge_items_history fih
            WHERE fi.id = fih.fid
            AND fih.closed is null";
        $result = $connection->query($query);
        $data = array();
        while($row = $result->fetch_assoc()){
            $elapsed = (time() - strtotime($row['carted'])) / 60 / 60 / 24;
            $data[] = array(
                "hid" => $row['hid'],
                "fid" => $row['fid'],
                "name" => $row['name'],
                "date" => substr($row['carted'], 0, 10),
                "queued" => $row['queued'] != null,
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

    function fridge_item_exists_in_cart($hid){
        global $connection;
        $query = "SELECT hid
            FROM fridge_items_history
            WHERE hid=$hid
            AND closed is null";

        $result = $connection->query($query);
        $rows = $result->num_rows;
        return $rows > 0;
    }

    function now(){
        return date('Y-m-d H:i:s');
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
