<?php
	class DB{
		
		// Resource identifier to the MySQL database connection;		
		private $connection;
		
		public $IsError;
		public $ErrorNumber;
		public $ErrorMessage;
		public $Id;
		public $query;
		
		public function __construct($host, $user, $password, $database){
			$this->connection = mysql_connect($host, $user, $password);
			if (!$this->connection){
				$this->setError();
				return;
			}
			
			if(!mysql_select_db($database, $this->connection)){
				$this->setError();
				return;
			}
		}
		
		public function Get($table_name, $where_array){
			$where = array();
			foreach($where_array as $column=>$value){
				if (is_numeric($value))
					$where[] = sprintf('`%s`=%s', $column, $value);
				else
					$where[] = sprintf('`%s`=\'%s\'',$column,mysql_real_escape_string($value));
			}
			
			if (count($where)>0)
				$where = 'where '.join(' AND ',$where);
			else
				$where = '';
			
			$this->query = sprintf('select * from `%s` %s;',$table_name,$where);
			$query = mysql_query($this->query,$this->connection);
			if (!$query){
				$this->setError();
				if ($this->ErrorNumber==1146){
					$this->IsError = false;
				}
				return array();
			}
			$result = array();
			while($row = mysql_fetch_assoc($query)){
				$result[] = $row;
			}
			return $result;
		}
		
		public function Insert($table_name, $data){
			$names = array();
			$values = array();
			foreach($data as $name=>$value){
				$names[] = '`'.$name.'`';
				if (is_numeric($value))
					$values[] = $value;
				else
					$values[] = '\''.mysql_real_escape_string($value).'\'';
			}
			$names = join(', ', $names);
			$values = join(', ', $values);
			$insert_query = sprintf('insert into `%s` (%s) values (%s)',$table_name, $names, $values);
			$query = mysql_query($insert_query, $this->connection);
			if (!$query){
				$this->setError();
				if ($this->ErrorNumber==1146){
					$this->IsError = false;
					$defs = array();
					foreach($data as $name=>$value){
						if (is_int($value)){
							$type = 'int';
						}else if (is_string($value)){
							$type = 'text';
						}
						$defs[] = sprintf('`%s` %s',$name,$type);
					}
					$create_query = sprintf(
						'create table `%s` ( `id` int not null auto_increment, %s, primary key(`id`));',
						$table_name, join(', ',$defs));
					$this->query = $create_query;
					$query = mysql_query($create_query,$this->connection);
					if (!$query){
						$this->setError();
						return false;
					}
					$query = mysql_query($insert_query, $this->connection);
					if (!$query){
						$this->setError();
						return false;
					}
					$this->Id = mysql_insert_id($this->connection);
					return $this->Id;
				}
				return false;
			}
		}
		
		function __destruct(){
			mysql_close($this->connection);
		}
		
		private function setError(){
			$this->IsError = true;
			$this->ErrorNumber = mysql_errno();
			$this->ErrorMessage = mysql_error();			
		}
	}
?>