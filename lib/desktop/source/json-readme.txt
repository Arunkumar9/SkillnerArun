Use this class if your server does not have built-in json support.

Usage:

/* Create a new instance of Services_JSON */
require_once("json.php");
$json = new Services_JSON();

$encoded = $json->encode($items);

Or:

$decoded = $json->decode($items);