<?php
/*
 * AnasVR 点赞插件
 * ============================================================================
 * 技术支持：2015-2017 江西安纳斯信息科技有限公司
 * 官网地址: http://vrcloud.anasit.com
 * ----------------------------------------------------------------------------
 * $Author: RyaneMax cio#anasit.com $
 * $Id: bind.php 28028 2016-06-19Z wanghao $
*/

$plugins['praise'] = array(
		'plugin_name' => '隐藏点赞',
		"enable" => 1,    			
		"edit_container" => "option_group",
		"edit_sort" => 8,
		"view_container" => "right_bottom",
		"view_sort" => 4,
		"table"=>"worksmain",
  		"column"=>"hidepraise_flag"
	);


?>