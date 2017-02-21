<?php

$formConfig = array(
    "labelAlign"=>"right",
    "columnCount"=>2,
    "labelWidth"=>80,
    "defaults"=>array(
        "width"=>180,
		"msgTarget"=>"side",
		"labelSeparator"=>""
    )
);
$fields = array(
    // company name
    array(
        "name"=>"compName",
        "fieldLabel"=>"Company",
        "editor"=>array(  
        	"width" => 140,     	
            "allowBlank"=>false
        )
    ),
    array(
         "name"=>"compForm",
         "fieldLabel"=>"Legal Form",
         "editor"=>array(
         	 "width" => 140,
             "allowBlank"=>false
         )
    ),
    array(
        "name"=>"clientFrom",
        "fieldLabel"=>"Client Since",
        "editor"=>array(
        	"width" => 110,
            "xtype"=>"datefield",
            "format"=>"M d, Y"
        )
    ),
    array(
        "name"=>"clientTill",
        "fieldLabel"=>"Client Till",
        "editor"=>array(
        	"width" => 110,
        	"allowBlank" => false,
        	"blankText" => "This Field Is Mandatory",
            "xtype" => "datefield",
            "format" =>"M d, Y"
        )
    ),
    array(
    	'name' => 'continent',
    	'fieldLabel' => 'Continent',
    	'editor' => array(
    		'width' => 140,
    		'allowBlank' => false,
    		'xtype' => 'continentcombo',
    		'plugins' => array(
	    		array(
	    			'xtype' => 'comboloader',
	    			'baseParams' => array('query' => 'continent'),
	    			'url' => 'php/test.php',
	    			'target' => 'country_combo'
	    		)
    		)
    	)
    ),
    array(
    	'name' => 'country',
    	'fieldLabel' => 'Country',
    	'editor' => array(
    		'width' => 140,
    		'allowBlank' => false,
    		'xtype' => 'countrycombo'
    	)
    ),
    array(
        "name"=>"compNote",
        "fieldLabel"=>"Note",
        "editor"=>array(
             "xtype"=>"textarea"
        )
    )
);

$config = array(
    "success"=>true,
    "metaData"=>array(
        "fields"=>$fields,
        "formConfig"=>$formConfig
    ),
    "data"=>array(
        "compName"=>"My Company",
        "compNote"=>"Company Note",
        "clientFrom"=>"Feb 20, 2008"
    )
);
echo json_encode($config);

// end of file
?> 