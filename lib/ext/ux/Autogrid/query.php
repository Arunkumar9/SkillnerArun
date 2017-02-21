<?php

// Define Collumns
$_reader_root = "rows";
$_reader_id = 0;
$_reader_fields = Array(
    Array(
        'name' => "id", // not that withoud a header value the field will not be shown
        'type' => "int",
    ),
    Array(
        'name' => "group"
    ),    
    Array(
        'name' => "company",
        'header' => "Company",
        'width' => 'auto',
        'editor' => Array(
            'type'=>'TextField',
            'config' => Array('allowBlank' => false),
        ),        
    ),
    Array(
        'name' => "price",
        'header' => "Price",
        'width' => 100
    ),
    Array(
        'name' => "date",
        'header' => "Last Updated",
        'width' => 100
    )
);

if($_POST['style'] == "s2") array_pop($_reader_fields);

// Dummy Data
$data = Array(
    Array("id" => 0, "group" => "Nice companies", "company" => "3m Co", "price" => "71.72", "date" => "2007-06-10", "info" => "Hello"),
    Array("id" => 1, "group" => "Stupid ones", "company" => "Alcoa Inc", "price" => "29.01", "date" => "2007-06-11", "info" => "World"),
    Array("id" => 2, "group" => "Nice companies", "company" => "Altria Group Inc", "price" => "83.81", "date" => "2007-07-01", "info" => "!!!"),
    Array("id" => 3, "group" => "Nice companies", "company" => "Microsoft", "price" => "100.10", "date" => "2007-08-01", "info" => "testing"),
    Array("id" => 4, "group" => "Stupid ones", "company" => "IBM", "price" => "120.81", "date" => "2007-08-10", "info" => "autogrid"),
    Array("id" => 5, "group" => "Nice companies", "company" => "NOVELL", "price" => "211.15", "date" => "2007-09-03", "info" => "paging"),
    Array("id" => 6, "group" => "Nice companies", "company" => "PHP Group", "price" => "453.11", "date" => "2007-09-05", "info" => "and"),
    Array("id" => 7, "group" => "Stupid ones", "company" => "MySQL Group", "price" => "233.41", "date" => "2007-10-01", "info" => "more"),
    Array("id" => 8, "group" => "Stupid ones", "company" => "BOTECH", "price" => "843.81", "date" => "2007-11-04", "info" => "testing..."),
);

// Define Rows (using start & limit)
$rows = Array();

$start = isset($_POST['start']) ? $_POST['start'] : 0;
$limit = isset($_POST['limit']) ? $_POST['limit'] : count($data);

$rows = array_slice($data, $start, $limit);


$json = Array();

// if requested send meta data
if(isset($_REQUEST['meta'])) {  
    $json['metaData'] = Array(
        'root' => $_reader_root,
        'id' => $_reader_id,
        'totalProperty' => "totalCount",        
        'fields' => $_reader_fields
    );
}

$json[$_reader_root] = Array();        
foreach ($rows as $i => $row) {
    $jrow = Array();
        
    // For each field, add the according value to the data row
    foreach($_reader_fields as $field) {
        $jrow[$field['name']] = $row[$field['name']];
    }

    // push this row to the rows array
    array_push($json[$_reader_root], $jrow);            
}
$json['totalCount'] = count($data);

echo json_encode($json);