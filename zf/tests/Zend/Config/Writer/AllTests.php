<?php
/**
 * Zend Framework
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://framework.zend.com/license/new-bsd
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@zend.com so we can send you a copy immediately.
 *
 * @category   Zend
 * @package    Zend_Config
 * @subpackage UnitTests
 * @copyright  Copyright (c) 2005-2011 Zend Technologies USA Inc. (http://www.zend.com)
 * @license    http://framework.zend.com/license/new-bsd     New BSD License
 * @version    $Id: AllTests.php 2348 2013-12-20 10:20:54Z arun $
 */

if (!defined('PHPUnit_MAIN_METHOD')) {
    define('PHPUnit_MAIN_METHOD', 'Zend_Config_Writer_AllTests::main');
}

require_once 'Zend/Config/Writer/ArrayTest.php';
require_once 'Zend/Config/Writer/IniTest.php';
require_once 'Zend/Config/Writer/JsonTest.php';
require_once 'Zend/Config/Writer/XmlTest.php';
require_once 'Zend/Config/Writer/YamlTest.php';

/**
 * @category   Zend
 * @package    Zend_Config
 * @subpackage UnitTests
 * @copyright  Copyright (c) 2005-2011 Zend Technologies USA Inc. (http://www.zend.com)
 * @license    http://framework.zend.com/license/new-bsd     New BSD License
 * @group      Zend_Config
 */
class Zend_Config_Writer_AllTests
{
    public static function main()
    {
        PHPUnit_TextUI_TestRunner::run(self::suite());
    }

    public static function suite()
    {
        $suite = new PHPUnit_Framework_TestSuite('Zend Framework - Zend_Config_Writer');

        $suite->addTestSuite('Zend_Config_Writer_ArrayTest');
        $suite->addTestSuite('Zend_Config_Writer_IniTest');
        $suite->addTestSuite('Zend_Config_Writer_JsonTest');
        $suite->addTestSuite('Zend_Config_Writer_XmlTest');
        $suite->addTestSuite('Zend_Config_Writer_YamlTest');

        return $suite;
    }
}

if (PHPUnit_MAIN_METHOD == 'Zend_Config_Writer_AllTests::main') {
    Zend_Config_Writer_AllTests::main();
}