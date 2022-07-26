

- 第三方平台：https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/product/Third_party_platform_appid.html
    - 帮助开发者快速获取用户小程序资质
    - 开发模式:https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/product/how_to_dev.html
        - 服务商调接口代注册小程序
    - 代注册：
        - https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/api/Register_Mini_Programs/Fast_Registration_Interface_document.html
    - 试用小程序：
        - 试用版本创建：https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/api/beta_Mini_Programs/fastregister.html
        - 法人人脸认证：https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/api/beta_Mini_Programs/fastverify.html
        - 接口设置域名：
            - 服务域名：https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/api/Mini_Program_Basic_Info/Server_Address_Configuration.html
            - 业务域名：https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/api/Mini_Program_Basic_Info/setwebviewdomain.html
    - 代码管理：
        - 上传代码：https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/api/code/commit.html
        - 审核代码：https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/api/code/submit_audit.html
    
    ###第三方平台注册

    - 基本信息
        - 需要准备可访问的官网网站，创建第三方平台时需要填写官方网站地址   www.fmode.cn
        - logo 大小 108 * 108  大小不超过300kb

    - 开发设置
        - 授权发起页的域名: 用于从该域名跳转至授权页  
            - 授权发起页域名指公众号/小程序在登录授权给第三方平台时的授权回调域名，在公众号/小程序进行登录授权流程中，必须从本域名内网页跳转到登录授权页，才可完成登录授权  

            - 授权成功后会回调授权时提供的 URI，公众平台会检查 URI，必须保证 URI 所属域名与服务申请时提供的授权域名保持一致

            - 注意，不能以http或者https等协议开头， www.server.fomde.cn
        - 授权事件接收URL: 用于接收取消授权通知、授权成功通知、授权更新通知，也用于接收ticket等
        - 消息与事件接收URL: 用于接收公众号或小程序消息和事件推送
        - 小程序服务器域名: https://server.fmode.cn
        - 小程序业务域名: https://server.fmode.cn, 等
        - 测试小程序列表
            - 填写小程序原始id

        - 消息校验token：Wlfm888Nkkj666ServerFmode
            - 开发者在代替公众号/小程序接收到消息时，用此 Token 来校验消息。用法与普通公众号/小程序接 token 一致

        - 消息加解密 Key NaoKongKeJi666WeiLeiFeiMa888ServerFmodecCn9
            - 在代替公众号/小程序接收发消息过程中使用。必须是长度为 43 位的字符串，只能是字母和数字。用法与普通公众号/小程序接 symmetric_key 一致



            server.fmode.cn
            server.fmode.cn/api/openwx/callback/$APPID$
            Wlfm888Nkkj666ServerFmode
            NaoKongKeJi666WeiLeiFeiMa888ServerFmodecCn9
            server.fmode.cn
            server.fmode.cn;pwa.fmode.cn;test.fmode.cn
            server.fmode.cn;pwa.fmode.cn;test.fmode.cn
            gh_db4c68b8f114;
            106.7.175.154;139.9.59.179;139.159.212.215

            复制文件 ./opt/ansible/copy-nova.sh 命令

