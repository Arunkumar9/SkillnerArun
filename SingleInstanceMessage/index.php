<?php

             $courseInstanceID      =  $_REQUEST['p'];
             $userName                 =  $_REQUEST['u'];

             $ini_array = parse_ini_file('../images/Email/Template.ini');
             $values = array();
    	foreach( $ini_array as $k=>$v ) {
    		$values[$k] = $v;
    	}
    	
    	$bssurl = $values['bssurl'];
    	$url = $bssurl.'?u='.$userName.'&p='.$courseInstanceID;
             $order =$url;
            
             echo "
             <html>
                          <head>
                                       <script type='text/javascript'>
                                                  var playerUrl = ' $order';
                                                  var popupPlayer= window.open(' $order', 'messageinstructor', 'width=1200,height=600') ;
                                                  popupPlayer.opener.close();
                                                  popupPlayer.focus();
                                       </script>
                          </head>
                          <body>
                          </body>
             </html>

             ";
?>
