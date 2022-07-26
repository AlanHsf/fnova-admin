<?php
/*
 * AnasVR 隐藏人气插件
 * ============================================================================
 * 技术支持：2015-2017 江西安纳斯信息科技有限公司
 * 官网地址: http://vrcloud.anasit.com
 * ----------------------------------------------------------------------------
 * $Author: RyaneMax cio#anasit.com $
 
*/

$plugins['showviewnum'] = array(
		'plugin_name' => '隐藏人气',
		"enable" => 1,    			
		"edit_container" => "option_group",
		"edit_sort" => 5,
		"view_container" => "left_top",
		"view_sort" => 3,
		"view_resource"=>1,
		"table"=>"worksmain",
  		"column"=>"hideviewnum_flag"
	);


?>