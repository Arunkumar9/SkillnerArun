<?php
/*
 * Created on 19.7.2006
 *
 * To change the template for this generated file go to
 * Window - Preferences - PHPeclipse - PHP - Code Templates
 */


class mailFilter extends MFbase
{
	protected $mailPath;
	protected $_msg;
	protected $_filterChain;
	protected $_workerChain;
	protected $_fp;
	
	public function __construct($mail="php://stdin")
	{
		$this->mailPath = $mail;
	}
	
	public function start()
	{
		$this->_fp = fopen($this->mailPath,"r");
		$this->mailParse();
		FUI::logNotice($this,"filter chain started");
		$res = $this->filterChain();
		FUI::logNotice($this,"filter chain result: $res");
		if ($res < FUI::IS_OK)
		{
			FUI::logError($this,FUI::ERR_FILTER_MSG,$res);
			return $res;
		}
				
		$res = $this->workerChain();
		if ($res < FUI::IS_OK)
		{
			FUI::logError($this,FUI::ERR_WORK_MSG,$res);
			return $res;
		}
		
	}

	public function stop()
	{
		//fclose($this->_fp);		
	}
	
	public function mailParse()
	{
		//if (!is_resource($this->_fp)) {
		//	FUI::logError($this,"not resource ",$this->mailPath);
		//	die(FUI::ERR_MAILPATH);
		//	return FUI::ERR_MAILPATH;
		//}
		$full = "";
		$fpin = fopen($this->mailPath,"r"); 
		if (!$fpin) {
			syslog(LOG_ERR,"mailwork G2: Cannot open STDIN");
			return;
		}
		
		while(!feof($fpin)) { 
		//	//DEBUG//fwrite($fp,"read stdin\r\n");
		    $full .= fgets($fpin,1024); 
		} 
		$tmpfname = tempnam("/var/www/html/tmp", "mwg2");
		//unlink($tmpfname);
		file_put_contents($tmpfname,$full);
		chmod($tmpfname,0644);
		FUI::logNotice($this,"tmpfname ".$tmpfname);
		$this->_msg = new mailParse($tmpfname);
	}

	public function filterChain($filters='')
	{
		if (!$filters)
			$filters = filterChain::AVAIL_FILTERS;
		$this->_filterChain = new filterChain($this->msg,$filters);
		return $this->_filterChain->doFilter();
	}
	
	public function workerChain($workers='')
	{
		if (!$workers)
			$workers = workerChain::AVAIL_WORKERS;
		$this->_workerChain = new workerChain($this->msg,$workers);
		return $this->_workerChain->doWork();
	}

	public function getMsg() { return $this->_msg; }
	
}

class mailEvaluate
{
	public $mail;

	public function __construct($m)
	{
		$this->mail = $m;
	}
	
/*
 *    condition
 * 		fields, sql, condition
 * 			$out = SQLFactory->getMe()->Ask($this->fields, $this->name);

 * 
 *    find person/subject
 * 	  find project
 * 	  find referenced mail 
 *    find phrase
 * 
 *    transform 
 *     headers -> daylog object
 *  
 *     
 * 	   rule -> new task object | 
 * 		
 * 	   action
 * 		 - in: field(s)
 * 		 - proces: calculation
 * 	     - out: assigment
 */	
	
	
	
}

class mailParse
{
	const LOG_PREPEND = "Fresh! mailfilter: ";
	const ATTACH_DIR = "./";
	const HEADER_ADDRESS_FIELDS = "To|From|Cc|cc|CC|Bcc|Delivered-To|X-Original-To|Return-Path|Reply-To";
	const HEADER_REFERENCE_FIELDS = "Message-ID|References|In-Reply-To|Content-ID";
	const HEADER_UNUSED_FIELDS  = "Content-Transfer-Encoding|Content-Type|Content-Disposition";

	public $headers = null;
	public $texts = array();
	public $attachments = array();
	public $inlines = array();	
	protected $msg;
	public $flags;

	function __set($name,$value)
	{
		$this->headers[ucfirst(strtolower($name))] = $value;
	}

	function __get($name)
	{
		return $this->headers[ucfirst(strtolower($name))];
	}

	public function __construct($fpin)
	{
		//die(get_resource_type($fpin));
		
		$this->msg = new MimeMessage("file",$fpin);
		FUI::logNotice($this,"msg created");
		$this->headers = $this->msg->data;
		$this->createAttachDir();
		$h = iconv_mime_decode_headers($this->msg->extract_headers(MAILPARSE_EXTRACT_RETURN),ICONV_MIME_DECODE_CONTINUE_ON_ERROR,'utf-8');
		FUI::logNotice($this,"header decoded");
		
		unset($this->headers['headers']);
		foreach ($h as $k=>$v)
			$this->headers['headers'][ucfirst($k)] = $v;

		foreach($this->headerUnusedFields() as $field)
			unset($this->headers['headers'][$field]);

		foreach($this->headers['headers'] as $field => $value)
			$this->headers[ucfirst($field)] = $value;

		unset($this->headers['headers']);

		foreach($this->headerAddressFields() as $field)
		{
			 if ($hf = mailparse_rfc822_parse_addresses($this->headers[$field]))
			 	$this->headers[ucfirst(strtolower($field))] = $hf;
		}
		foreach($this->headerReferenceFields() as $field)
		{
			 $a = mailparse_rfc822_parse_addresses($this->headers[$field]);
			 $this->headers[$field] = array();
			 foreach ($a as $val)
			 	$this->headers[$field][] = $val['address'];
		}
		
		$this->readPartInfo($this->msg);
		
		$fromTo = array();
		foreach($this->headers['From'] as $f)
			$fromTo[] = $f['address'];

		foreach($this->headers['To'] as $f)
			$fromTo[] = $f['address'];

		$this->headers['Alladdr'] = implode(',',$fromTo);

		FUI::logNotice($this,"constructed");
		
		//var_dump($this->headers);
		//var_dump($h);
		//die();

		
	}
	
	private function mimeDecodeString($text,$charset='utf-8')
	{
		return iconv_mime_decode($text,ICONV_MIME_DECODE_CONTINUE_ON_ERROR,$charset);
	}
	
	protected function headerAddressFields()
	{
		return FUI::arraySplit(self::HEADER_ADDRESS_FIELDS);
	} 
	
	protected function headerReferenceFields()
	{
		return FUI::arraySplit(self::HEADER_REFERENCE_FIELDS);
	} 

	protected function headerUnusedFields()
	{
		return FUI::arraySplit(self::HEADER_UNUSED_FIELDS);
	} 

	protected function createAttachDir()
	{
		//create attachdir
		$this->attachDir = FUI::getIniValue('values.attach_dir').date('Y-m-d').'/';
		@mkdir($this->attachDir,0777);
		chmod($this->attachDir,0777);
	} 
	
	/*
	 *  mailParser::writeAttachment
	 * 
	 * @param string	filename to parse
	 * @msgpart resource 
	 * @index integer	index in uuencoded attachments if any
	 * 
	 */
	protected function writeAttachment($filename,$msgpart,$index=null)
	{
		$filename = strtr(iconv('utf-8','us-ascii//TRANSLIT',$filename),array("'"=>''," "=>"_"));
		$f = $filename;
		$i = 1;
		while (file_exists($this->attachDir.$f))
		{
			$f = $filename.'.'.str_pad($i,2,'0',STR_PAD_LEFT);
			$f = preg_replace('/(\.[^.]*)(\.[0-9]{2,3})$/is','\\2\\1',$f);
			$i++;
		}
		$fpAttach = fopen($this->attachDir.$f,'w');
		if ($index === null)
			$res = $msgpart->extract_body(MAILPARSE_EXTRACT_STREAM,$fpAttach);
		else
			$res = $msgpart->extract_uue($index, MAILPARSE_EXTRACT_STREAM,$fpAttach);
		fclose($fpAttach);
//		chgrp($this->attachDir.$f,'apache');
		chmod($this->attachDir.$f,0644);
		return $f;
	}
	

	protected function readPartInfo($msgpart)
	{

		$headers = $msgpart->data;

		$n = $msgpart->get_child_count();
		FUI::logNotice($this,"msgpart data read $n children");

		if ($n == 0) {
			
			$headers['disposition-filename'] = $this->mimeDecodeString($headers['disposition-filename']);
			if (strtolower($headers['content-disposition']) == 'attachment' OR (!trim($headers['content-id']) && $headers['disposition-filename']) )
			{
				$this->attachments[] = $this->writeAttachment($headers['disposition-filename'],$msgpart);
			} 
			elseif (!stristr($headers['content-type'],'text'))
			{
				$this->inlines[$headers['content-id']] = $this->writeAttachment($headers['disposition-filename'],$msgpart);
			}
			elseif (!stristr($headers['content-type'],'error'))
			{
				$text = $msgpart->extract_body(MAILPARSE_EXTRACT_RETURN);
				if ($headers['charset'] && $headers['charset']!='utf-8')
					$text = iconv($headers['charset'],'utf-8',$text);
				if (trim($text))	
					$this->texts[] = array($text,$headers['content-type']);
			}
		
			// This function tells you about any uuencoded attachments
			// that are present in this part.
			$uue = $msgpart->enum_uue();
			if ($uue !== false) {
				foreach($uue as $index => $data) {
					// $data => array("filename" => "original filename",
					//                "filesize" => "size of extracted file",
					//               );

					$this->attachments[] = $this->writeAttachment($data['filename'],$msgpart,$index);
				}
			}

		} else {
			// Recurse and show children of that part
			for ($i = 0; $i < $n; $i++) {
				try {
					$part = $msgpart->get_child($i);
					FUI::logNotice($this,"msgpart read child $i");
					$this->readPartInfo($part);
				} catch (Exception $e) { 
					FUI::logNotice($this,"msgpart read child $i failed");	
				}
			}
		}
	}
	
}

?>