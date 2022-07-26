<?php
/*
 * AnasVR 项目简介插件
 * ============================================================================
 * 技术支持：2015-2017 江西安纳斯信息科技有限公司
 * 官网地址: http://vrcloud.anasit.com
 * ----------------------------------------------------------------------------
 * $Author: RyaneMax cio#anasit.com $
 * $Id: bind.php 28028 2016-06-19Z wanghao $
*/

$plugins['profile'] = array(
		'plugin_name' => '隐藏项目简介',
		"enable" => 1,    			
		"edit_container" => "option_group",
		"edit_sort" => 7,
		"view_container" => "right_bottom",
		"view_sort" => 3,
		"view_resource"=>1,       //是否加载了其他资源 比如弹框等
		"table"=>"worksmain",
  		"column"=>"hideprofile_flag"
	);


?>