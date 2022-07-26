<?php
/*
 * AnasVR 足迹插件
 * ============================================================================
 * 技术支持：2015-2017 江西安纳斯信息科技有限公司
 * 官网地址: http://vrcloud.anasit.com
 * ----------------------------------------------------------------------------
 * $Author: RyaneMax cio#anasit.com $
 
*/

$plugins['footmarker'] = array(
		'plugin_name' => '足迹',
		"enable" => 1,    			
		"edit_container" => "option_group",
		"edit_sort" => 2,
		"view_container" => "right_bottom",
		"view_sort" => 1,
		"view_resource"=>1,
		"table"=>"pano_config",
  		"column"=>"footmark"
	);


?>