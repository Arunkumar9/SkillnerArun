<?php
/**
 * TDbCache class file
 *
 * @author Jan Rosa <jan.rosa@freshconcept.cz>
 * @link http://www.freshconcept.cz/
 * @copyright Copyright &copy; 2005-2007 Freshconcept
 * @license http://www.pradosoft.com/license/
 * @version $Id: FHitCounter.php 2348 2013-12-20 10:20:54Z arun $
 * @package FreshSystem
 */

Prado::using('System.Data.TDbConnection');

/**
 * FHitCounter
 *
 */
class FHitCounter extends TModule
{
	/**
	 * @var string the ID of TDataSourceConfig module
	 */
	private $_connID='';
	/**
	 * @var TDbConnection the DB connection instance
	 */
	private $_db;
	/**
	 * @var string name of the DB cache table
	 */
	private $_counterTable='cms_hit_counts';
	/**
	 * @var boolean whether the cache DB table should be created automatically
	 */
	private $_autoCreate=true;
	private $_username='';
	private $_password='';
	private $_connectionString='';

	/**
	 * Destructor.
	 * Disconnect the db connection.
	 */
	public function __destruct()
	{
		if($this->_db!==null)
			$this->_db->setActive(false);
	}


        public function getHitKey()
        {
             return $this->getRequest()->getPathInfo();
            // return md5($this->getRequest()->getPathInfo());
        }

	/**
	 * Initializes this module.
	 * This method is required by the IModule interface. It checks if the DbFile
	 * property is set, and creates a SQLiteDatabase instance for it.
	 * The database or the cache table does not exist, they will be created.
	 * Expired values are also deleted.
	 * @param TXmlElement configuration for this module, can be null
	 * @throws TConfigurationException if sqlite extension is not installed,
	 *         DbFile is set invalid, or any error happens during creating database or cache table.
	 */
	public function init($config)
	{
		$db=$this->getDbConnection();
		$db->setActive(true);
                //$container = Prado::getApplication()->getModule('cms')->getContainer
		$sql='INSERT INTO '.$this->_counterTable.' ( itemkey,container,count ) VALUES ( "'.$this->getHitKey().'",0,1) ON DUPLICATE KEY UPDATE count=count+1';
		$db->createCommand($sql)->execute();
/*                try
		{
			$db->createCommand($sql)->execute();
		}
		catch(Exception $e)
		{
			// DB table not exists
			if($this->_autoCreate)
			{
				$driver=$db->getDriverName();
				if($driver==='mysql')
					$blob='LONGBLOB';
				else if($driver==='pgsql')
					$blob='BYTEA';
				else
					$blob='BLOB';

				$sql='CREATE TABLE '.$this->_counterTable." (itemkey CHAR(128) PRIMARY KEY, count BIGINT(20), container INT)";
				$db->createCommand($sql)->execute();
			}
			else
				throw TConfigurationException('db_cachetable_inexistent',$this->_cacheTable);
		}

*/		parent::init($config);
	}

	/**
	 * Creates the DB connection.
	 * @param string the module ID for TDataSourceConfig
	 * @return TDbConnection the created DB connection
	 * @throws TConfigurationException if module ID is invalid or empty
	 */
	protected function createDbConnection()
	{
		if($this->_connID!=='')
		{
			$config=$this->getApplication()->getModule($this->_connID);
			if($config instanceof TDataSourceConfig)
				return $config->getDbConnection();
			else
				throw new TConfigurationException('dbcache_connectionid_invalid',$this->_connID);
		}
		else
		{
			$db=new TDbConnection;
			if($this->_connectionString!=='')
			{
				$db->setConnectionString($this->_connectionString);
				if($this->_username!=='')
					$db->setUsername($this->_username);
				if($this->_password!=='')
					$db->setPassword($this->_password);
			}
			else
			{
				// default to SQLite3 database
				$dbFile=$this->getApplication()->getRuntimePath().'/sqlite3.cache';
				$db->setConnectionString('sqlite:'.$dbFile);
			}
			return $db;
		}
	}

	/**
	 * @return TDbConnection the DB connection instance
	 */
	public function getDbConnection()
	{
		if($this->_db===null)
			$this->_db=$this->createDbConnection();
		return $this->_db;
	}

	/**
	 * @return string the ID of a {@link TDataSourceConfig} module. Defaults to empty string, meaning not set.
	 * @since 3.1.1
	 */
	public function getConnectionID()
	{
		return $this->_connID;
	}

	/**
	 * Sets the ID of a TDataSourceConfig module.
	 * The datasource module will be used to establish the DB connection for this cache module.
	 * The database connection can also be specified via {@link setConnectionString ConnectionString}.
	 * When both ConnectionID and ConnectionString are specified, the former takes precedence.
	 * @param string ID of the {@link TDataSourceConfig} module
	 * @since 3.1.1
	 */
	public function setConnectionID($value)
	{
		$this->_connID=$value;
	}

	/**
	 * @return string The Data Source Name, or DSN, contains the information required to connect to the database.
	 */
	public function getConnectionString()
	{
		return $this->_connectionString;
	}

	/**
	 * @param string The Data Source Name, or DSN, contains the information required to connect to the database.
	 * @see http://www.php.net/manual/en/function.pdo-construct.php
	 */
	public function setConnectionString($value)
	{
		$this->_connectionString=$value;
	}

	/**
	 * @return string the username for establishing DB connection. Defaults to empty string.
	 */
	public function getUsername()
	{
		return $this->_username;
	}

	/**
	 * @param string the username for establishing DB connection
	 */
	public function setUsername($value)
	{
		$this->_username=$value;
	}

	/**
	 * @return string the password for establishing DB connection. Defaults to empty string.
	 */
	public function getPassword()
	{
		return $this->_password;
	}

	/**
	 * @param string the password for establishing DB connection
	 */
	public function setPassword($value)
	{
		$this->_password=$value;
	}

	/**
	 * @return string the name of the DB table to store cache content. Defaults to 'pradocache'.
	 * @see setAutoCreateCacheTable
	 */
	public function getCacheTableName()
	{
		return $this->_counterTable;
	}

	/**
	 * Sets the name of the DB table to store cache content.
	 * Note, if {@link setAutoCreateCacheTable AutoCreateCacheTable} is false
	 * and you want to create the DB table manually by yourself,
	 * you need to make sure the DB table is of the following structure:
	 * (itemkey CHAR(128) PRIMARY KEY, value BLOB, expire INT)
	 * Note, some DBMS might not support BLOB type. In this case, replace 'BLOB' with a suitable
	 * binary data type (e.g. LONGBLOB in MySQL, BYTEA in PostgreSQL.)
	 * @param string the name of the DB table to store cache content
	 * @see setAutoCreateCacheTable
	 */
	public function setCacheTableName($value)
	{
		$this->_counterTable=$value;
	}

	/**
	 * @return boolean whether the cache DB table should be automatically created if not exists. Defaults to true.
	 * @see setAutoCreateCacheTable
	 */
	public function getAutoCreateCacheTable()
	{
		return $this->_autoCreate;
	}

	/**
	 * @param boolean whether the cache DB table should be automatically created if not exists.
	 * @see setCacheTableName
	 */
	public function setAutoCreateCacheTable($value)
	{
		$this->_autoCreate=TPropertyValue::ensureBoolean($value);
	}

	/**
	 * Retrieves count of a specified key.
	 * This is the implementation of the method declared in the parent class.
	 * @param string a unique key identifying the counter value
	 * @return integer
	 */

        public function getCount($key)
	{
		$sql='SELECT count FROM '.$this->_counterTable.' WHERE itemkey=\''.$key.'\' ';
		return (int)$this->_db->createCommand($sql)->queryScalar();
	}

        public function getCountOfReferrer()
        {
            $key = parse_url($this->getRequest()->getUrlReferrer(),PHP_URL_PATH);
            return $this->getCount($key);
        }

}

