<?php

             $courseInstanceID      =  $_REQUEST['courseInstanceID'];
             $userName                 =  $_REQUEST['userID'];

             $ini_array = parse_ini_file('../images/Email/Template.ini');
             $values = array();
    	foreach( $ini_array as $k=>$v ) {
    		$values[$k] = $v;
    	}
    	
    	$bssurl = $values['bssurl'];
    	$url = $bssurl.'?courseInstanceID='.$courseInstanceID.'&userID='.$userName.'&transactionType=messagingwin';
             $order =$url;
            
             echo "
             <html>
                          <head>
                                       <script type='text/javascript'>
                                                  var playerUrl = ' $order';
                                                  var popupPlayer= window.open(' $order', 'messageinstructor') ;
                                                  popupPlayer.opener.close();
                                                  popupPlayer.focus();
                                       </script>
                          </head>
                          <body>
                          </body>
             </html>

             ";
?>
