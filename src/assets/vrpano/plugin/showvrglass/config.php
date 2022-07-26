<?php
/*
 * AnasVR vr切换插件
 * ============================================================================
 * 技术支持：2015-2017 江西安纳斯信息科技有限公司
 * 官网地址: http://vrcloud.anasit.com
 * ----------------------------------------------------------------------------
 * $Author: RyaneMax cio#anasit.com $
 
*/

$plugins['showvrglass'] = array(
		'plugin_name' => 'VR切换',
		"enable" => 1,    			
		"edit_container" => "option_group",
		"edit_sort" => 6,
		"view_container" => "right_top",
		"view_sort" => 1,
		"view_resource"=>1,
		"table"=>"worksmain",
  		"column"=>"hidevrglasses_flag"
	);

?>