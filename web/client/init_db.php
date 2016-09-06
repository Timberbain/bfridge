<?
    header("Content-Type: text/plain");



    $link = mysqli_connect("mysql", "fridgemaster", "inafridge");


    if(!$link){
        die("Error: could not connect to database");
    }

    $db_name = "bfridged";
    echo "Selecting database: $db_name \r\n";
    if(!$link->select_db($db_name)){
        echo "Database not found, creating ...";
        $query = "CREATE DATABASE $db_name";
        if ($link->query($query) === TRUE) {
            echo "Database created successfully!";
            $link->select_db($db_name);
        } else {
            close($link, "Error creating database: " . $link->error);
        }
    }

    printf("Initial character set: %s\n", $link->character_set_name());

    /* Setting character set of database*/
    if (!$link->set_charset("utf8")) {
        die("Unable to load character set utf8");
    }

    printf("New character set: %s\n", $link->character_set_name());


    /* Creating tables */

    $query = "CREATE TABLE IF NOT EXISTS fridge_items(
        id INT(4) NOT NULL PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(30) NOT NULL,
        expiration INT(4))";

    if(!$link->query($query)){
        close($link, "Error creating table: " . $link->error);
    }
    echo "Successfully created fridge_items table \r\n";


    $query = "CREATE TABLE IF NOT EXISTS fridge_items_history(
        hid INT(4) NOT NULL PRIMARY KEY AUTO_INCREMENT,
        fid INT(4) NOT NULL,
        charted DATETIME NOT NULL,
        queued DATETIME,
        closed DATETIME,
        userid INT(4))";

    if(!$link->query($query)){
        close($link, "Error creating table: " . $link->error);
    }
    echo "Successfully created fridge_items_history table \r\n";






    function close($link, $message){
        echo $message." \r\n";
        $link->close();
        die();
    }
