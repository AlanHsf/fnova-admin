###微信小程序
- 文件夹规则
    - nova-wxapp
        - config 文件夹
        - 分包文件夹
            - pages 分包pages
                - index 分包主页面，承载四个tab栏的组件， 和底部tab栏
                    - index.js 首先getTabs 获取DiyTabs
                - tabs 的文件夹
        - 主包pages
        - styles 全局样式
        - utils
        - app.js 
        - app.json
        - app.wxss
        - config.js
        - index.js 主入口函数
        - index.wxml
        - index.wxss
        - package-lock.json
        - package.json
        - parse.weapp.js
        - project.config.json
        - project.private.config.js



        app.js


getApp().scope["nova-shop"] = {}
getApp().scope["nova-shop"].goodsList

setModuleData("nova-shop","goodsList", value){
    
}

- 用户登录
    - index.js 
        - onLoad() 用户登录 login() 函数，创建user，但是未获取用户信息, 获取用户的code, 调用add.js 
            checkAuth(), 检测用户是否有账号，没有则创建user ，以及account
    -   获取DiyTabs 调用根目录下面的utils/getTabs.js
    
    -  用户手动授权 调用 根目录下面的components/app-auth

    - 获取用户openId 调用 auth_wxapp 接口，返回用户的微信信息
    - 用户登录，创建User信息数据。
    - 