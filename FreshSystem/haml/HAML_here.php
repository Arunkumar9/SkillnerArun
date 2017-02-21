<?php

require 'HAML.php';
// We're executing BEFORE the file the user actually requested.
// Treat it as HAML, reading it in directly, and die before PHP tries to execute it.
require haml($_SERVER['SCRIPT_FILENAME']);
die();

?>