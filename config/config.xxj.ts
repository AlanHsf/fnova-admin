function makeAppConfig() {
    const date = new Date();
    const year = date.getFullYear();
 
    const AppConfig = {
        brand: '星星加区块链直播任务平台',
        user: 'StarPlus',
        year,
        layoutBoxed: false,                             // true, false
        navCollapsed: false,                            // true, false
        navBehind: false,                               // true, false
        fixedHeader: true,                              // true, false
        sidebarWidth: 'middle',                         // small, middle, large
        theme: 'light',                                 // light, gray, dark
        colorOption: '34',                              // 11,12,13,14,15,16; 21,22,23,24,25,26; 31,32,33,34,35,36
        AutoCloseMobileNav: true,                       // true, false. Automatically close sidenav on route change (Mobile only)
        productLink: 'https://app.hamukj.cn/donwload.html',
        // Global Config
        // rootPageId: "admin.user.login", // 设置默认首页
        icon: "assets/icon/icon-default.png", // 设置方形icon
        logo: "assets/icon/logo-default.png", // 设置登录页Logo
        background: "assets/img/background-default.svg", // 设置登录页背景，建议使用[Trianglify](http://qrohlf.com/trianglify-generator/)
        appId:"nova",
        serverURL:"https://server.hamukj.cn/parse",
        masterKey:"XiSAasdkqw",
        homeURL:"https://app.hamukj.cn/download.html",
        role:[{value:"admin",name:"管理"}],
        permission:{
            admin:[
                // 后台默认页面
                "admin.article.list",
                // 资讯管理
                "site", 
                "admin.article.list","admin.article.edit",
                "admin.category.article","admin.banner.list",
                // 用户认证
                "org",
                "admin.org.enterprise","admin.org.enterprise.category",
                "admin.certify.all","admin.certify.org.vip",
                "admin.user.org",
                // 消息管理
                "common-message"
            ]
        }
    };
 
    return AppConfig;
}
 
export const APPCONFIG = makeAppConfig();







// function makeAppConfig() {
//     const date = new Date();
//     const year = date.getFullYear();

//     const AppConfig = {
//         brand: '全栈数据云',
//         user: 'FutureStack',
//         year,
//         layoutBoxed: false,                             // true, false
//         navCollapsed: false,                            // true, false
//         navBehind: false,                               // true, false
//         fixedHeader: true,                              // true, false
//         sidebarWidth: 'middle',                         // small, middle, large
//         theme: 'light',                                 // light, gray, dark
//         colorOption: '34',                              // 11,12,13,14,15,16; 21,22,23,24,25,26; 31,32,33,34,35,36
//         AutoCloseMobileNav: true,                       // true, false. Automatically close sidenav on route change (Mobile only)
//         productLink: 'http://www.dreamstack.cn',
//         // Global Config
//         // rootPageId: "admin.user.login", // 设置默认首页
//         icon: "assets/icon/icon-default.png", // 设置方形icon
//         logo: "assets/icon/logo-default.png", // 设置登录页Logo
//         background: "assets/img/background-default.svg", // 设置登录页背景，建议使用[Trianglify](http://qrohlf.com/trianglify-generator/)
//         appId:"pipixia",
//         serverURL:"https://server.ncppx.com/parse",
//         masterKey:"proforfttt6",
//         homeURL:"https://server.ncppx.com",
//         role:[{value:"admin",name:"全栈管理"}],
//         permission:{
//             admin:[
//                 // 后台默认页面
//                 "admin.article.list",
//                 // 资讯管理
//                 "site",
//                 "admin.article.list","admin.article.edit",
//                 "admin.category.article","admin.banner.list",
//                 // 用户认证
//                 "org",
//                 "admin.org.enterprise","admin.org.enterprise.category",
//                 "admin.certify.all","admin.certify.org.vip",
//                 "admin.user.org",
//                 // 消息管理
//                 "common-message"
//             ]
//         }
//     };

//     return AppConfig;
// }

// export const APPCONFIG = makeAppConfig();
