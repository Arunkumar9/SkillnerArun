<?php
/**
 * User: Arunkumar
 * Date: 24.04.2014
 * Time: 15:44
 */

class Hmac {
	const ALGO = 'sha256';
	private $key;

	function __construct($pPrivateKey) {
		$this->key = $pPrivateKey;
	}

	/**
	 * @param array $content
	 * @param int $time UTC time
	 * @return string
	 */
	public function getHash($content, $time) {
		if (is_array($content))
			$content = json_encode($content);

		$time = intval($time);

		$stringToEncode = $time.$content.$time;

		return hash_hmac(self::ALGO, $stringToEncode, $this->key);
	}
} 

?>