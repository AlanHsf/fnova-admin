<?php
/*
 * AnasVR 隐藏logo插件
 * ============================================================================
 * 技术支持：2015-2017 江西安纳斯信息科技有限公司
 * 官网地址: http://vrcloud.anasit.com
 * ----------------------------------------------------------------------------
 * $Author: RyaneMax cio#anasit.com $
 
*/

$plugins['showlogo'] = array(
		'plugin_name' => '隐藏logo',
		"enable" => 1,    			
		"edit_container" => "option_group",
		"edit_sort" => 4,
		"view_container" => "",
		"view_sort" => 1,
		"view_resource"=>1,
		"table"=>"worksmain",
  		"column"=>"hidelogo_flag"
	);


?>