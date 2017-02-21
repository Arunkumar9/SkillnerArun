<?php

// appliend to the 'wizard' panel that will hold pages
$wizConfig = array(
	'activeItem' => 0
);

// settings applied to all froms on this wizard
$formConfig = array(    
     "labelAlign" => "right"
);

// settings applied to all fields in the forms of this wizard
$fieldConfig = array(
	"columnCount" => 2,
    "labelWidth" => 80,
	'msgTarget' => 'side',
	'labelSeparator' => ''
);

$pages = array(
 	array(
 		'index' => 0,
 		'html' => '<h1>Welcome To Wizard Test 4</h1><p>This is our fourth test bed for this component, click next to proceed.</p>'
 	),
 	array(
 		'index' => 1,
 		'layout' => 'form',
 		"defaults"=>array(
	        "width"=>130			
	    ),	
		'items' => array(
 			array(
 				'xtype' => 'textfield',
 				'fieldLabel' => "Company",
		        "name" => "compName",		        
		        "allowBlank" => false
		    ),
		    array(
		    	'xtype' => 'textfield',
		    	'fieldLabel' => 'Email',
		        'name' => 'compMail',		         
		        'allowBlank' => false,
		    	'vtype' => 'email'
		    ),
		    array(
		    	"xtype" => "datefield",
		        "name" => "clientFrom",
		        "fieldLabel" => "Client Since",		        
	            "format" => "j.n.y"
		    ),
		    array(
		    	'name' => 'continent',
		    	'fieldLabel' => 'Continent',
		    	'width' => 100,
	    		'allowBlank' => false,
	    		'xtype' => 'continentcombo',
	    		'plugins' => array(
		    		'xtype' => 'comboloader',
	    			'baseParams' => array('query' => 'continent'),
	    			'url' => '../combo-loader/php/test.php',
	    			'target' => 'country_combo'
	    		)
		    ),
		    array(
		    	'name' => 'country',
		    	'id' => 'country_combo',
		    	'fieldLabel' => 'Country',
		    	'width' => 110,
	    		'allowBlank' => false,
	    		'xtype' => 'countrycombo'
		    ),
		    array(
		    	'xtype' => 'textarea',
		    	'fieldLabel' => 'Description',
		    	'name' => 'desc',
		    	'width' => 250,
		    	"allowBlank" => false
		    )
 		)
 	),
 	array(
 		'index' => 2,
		'items' => array(
	 		array(
	 			'xtype' => 'fieldset',
	 			'title' => 'Phone Number',
	 			'collapsible' => true,
	 			'autoHeight' => true,
	 			'defaults' => array(
	 				'width' => 220
	 			),
	 			'defaultType' => 'textfield',
	 			'items' => array(
		 			array(
		 				'fieldLabel' => 'Home',
		 				'name' => 'home',
		 				'value' => '(888) 555-1212'
		 			),
		 			array(
		 				'fieldLabel' => 'Business',
		 				'name' => 'business'
		 			),
		 			array(
		 				'fieldLabel' => 'Fax',
		 				'name' => 'fax'
		 			)
	 			)	 			
	 		),
	 		array(
	 			'xtype' => 'tabpanel',
	 			'plain' => true,
	 			'activeTab' => 0,
	 			'height' => 100,
				'defaults' => array(
	 				'bodyStyle' => array(
	 					'padding' => '10px'
	 				)
	 			),
	 			'items' => array(
	 				array(
	 					'title' => 'Personal Details',
	 					'layout' => 'form',
	 					'defaultType' => 'textfield',
	 					'defaults' => array(
	 						'width' => 210
	 					),
	 					'items' => array(
				 			array(
				 				'fieldLabel' => 'Name',
				 				'name' => 'name'
				 			),
				 			array(
				 				'fieldLabel' => 'Occupation',
				 				'name' => 'job'
				 			),
				 			array(
				 				'fieldLabel' => 'Nationality',
				 				'name' => 'nation'
				 			)
			 			)
	 				),	 				
	 				array(
	 					'title' => 'Contact Details',
	 					'layout' => 'form',
	 					'defaultType' => 'textfield',
	 					'defaults' => array(
	 						'width' => 210
	 					),
	 					'items' => array(
				 			array(
				 				'fieldLabel' => 'Home',
				 				'name' => 'home1',
				 				'value' => '(888) 555-1212'
				 			),
				 			array(
				 				'fieldLabel' => 'Business',
				 				'name' => 'business1'
				 			),
				 			array(
				 				'fieldLabel' => 'Fax',
				 				'name' => 'fax1'
				 			)
			 			)
	 				)
	 			)
	 		)
 		)
 	),
 	array(
 		'index' => 3,
		'html' => '<h1>Page 4</h1>'
 	)
);

$config = array(
    "success"=>true,
    "metaData"=>array(
        "pages"=>$pages,
		'wizConfig' => $wizConfig,
		"fieldConfig"=>$fieldConfig,
        "formConfig"=>$formConfig
    ),
    "data"=>array(
        "compName"=>"My Company",
        "compNote"=>"Company Note",
        "clientFrom"=>"1.2.08"
    )
);

echo json_encode($config);

// end of file
?> 