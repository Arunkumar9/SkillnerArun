<?php
class FMailDaemon extends Daemon
{
   function __construct()
   {
      parent::__construct();
      $this->mail_dir = rtrim(FUI::getIniValues('values.mail_dir'),'/').'/';
      $this->processed_dir = rtrim(FUI::getIniValues('values.processed_dir'),'/').'/';
   }

   function _logMessage($msg, $status = DLOG_NOTICE)
   {
      if ($status & DLOG_TO_CONSOLE)
         print get_class($this).' '.$msg."\n";
      
	  syslog(LOG_ERR,get_class($this).' '.$msg);
   }
 
   function _doTask()
   {
		$files = scandir($this->mail_dir);
		
		foreach ($files as $file)
		{
			if (is_file($file) && $file[0] != '.')
			{
				$mf = new mailFilter($this->mail_dir.$file);
				$mf->start();
				rename($this->mail_dir.$file,$this->processed_dir.$file);
			}
		}		
		sleep(5);
   }  
}
/*
   function createSocketServer($host='127.0.0.1',$port=1234){
    if(!preg_match("/^d{1,3}.d{1,3}.d{1,3}.d{1,3}$/",$host)){
        trigger_error('Invalid IP address format.',E_USER_ERROR);
    }
    if(!is_int($port)||$port<1||$port>65535){
        trigger_error('Invalid TCP port number.',E_USER_ERROR);
    }
    set_time_limit(0);
    // create low level socket
    if(!$socket=socket_create(AF_INET,SOCK_STREAM,0)){
        trigger_error('Error creating new socket.',E_USER_ERROR);
    }
    // bind socket to TCP port
    if(!socket_bind($socket,$host,$port)){
        trigger_error('Error binding socket to TCP port.',E_USER_ERROR);
    }
     // begin listening connections
    if(!socket_listen($socket)){
        trigger_error('Error listening socket connections.',E_USER_ERROR);
    }
    // create communication socket
    if(!$comSocket=socket_accept($socket)){
        trigger_error('Error creating communication socket.',E_USER_ERROR);
    }
    // read socket input
    $socketInput=socket_read($comSocket,1024);
    // convert to uppercase socket input 
    $socketOutput=strtoupper(trim($socketInput))."n";     
    // write data back to socket server
    if(!socket_write($comSocket,$socketOutput,strlen($socketOutput))){
        trigger_error('Error writing socket output',E_USER_ERROR);
    }
    // close sockets
    socket_close($comSocket);
    socket_close($socket);
}
*/

?>