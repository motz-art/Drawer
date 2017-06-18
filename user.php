<?php
	define('QW_USER_TABLE','users');
	define('QW_ROLE_TABLE','roles');
	define('QW_USER_ROLE_TABLE','user_role');
	
	if (isset($_SESSION['QW_LOGIN'])){
		$qw_logged_in = true;
		$qw_login = $_SESSION['QW_LOGIN'];
		$qw_user_id = $_SESSION['QW_USER_ID'];
		$qw_roles = $_SESSION['QW_ROLES'];
		$qw_user_data = $_SESSION['QW_USER_DATA'];
	}else{
		$qw_logged_in = false;
		$qw_login = 'guest';
		$qw_user_id = -1;
		$qw_roles = array('quest');
		$qw_user_data = array();
	}
	
	
	function qw_user_is($role){
		global $qw_roles;
		return in_array($role, $qw_roles);
	}
	
	function qw_login(){
		global $qw_logged_in, $qw_login, $qw_user_id, $qw_roles, $qw_user_data;
		
	}
?>