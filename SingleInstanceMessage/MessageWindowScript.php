<?php
echo "
<html>
<head>
<script type='text/javascript'>
           var playerUrl = 'http://admin.local/?page=admin.Message&token=7694fc8eaf27d960ce0cb5445eb1d2ff88133e4d';
           var popupPlayer= window.open('http://admin.local/?page=admin.Message&token=7694fc8eaf27d960ce0cb5445eb1d2ff88133e4d', 'messageinstructor', 'width=150,height=100') ;
            if(popupPlayer.location == 'about:blank' ){
                 popupPlayer.location = playerUrl ;
            }
            popupPlayer.focus();
</script>
</head>
<body>
</body>
</html>

";

?>
