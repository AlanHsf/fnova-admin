/**
 * 前端自动生成签名，配置指南
 * step 1、填写好appkey以及对应的masterSecret
 * step 2、isFrontSignature改为true
 */
/**
 * 服务端生成签名，配置指南
 * step 1、填写好appkey，不填masterSecret，masterSecret放在服务端
 * step 2、isFrontSignature改为false
 * step 3、填写signatureApiUrl
 * step 4、在自己的服务端上开发出生成签名的post类型接口
 */
/**
 * 服务端生成签名的api详解：
 * 前端接口的调用相关的代码已经写好，开发者只需要配置好signatureApiUrl，并在服务端提供签名api接口即可
 * 服务端接收post请求，收到json数据，json数据结构如下:
 * {
 *   timestamp: new Date().getTime(),
 *   appkey: authPayload.appkey,
 *   randomStr: authPayload.randomStr
 * }
 * 根据json数据及masterSecret生成签名，返回string类型格式的response给前端:
 * 如: '7db047a67a9d7293850ac69d14cc82bf'
 */
/**
 * 注意:
 * 签名的生成有前端和服务端两种方式，任选其中之一即可
 * 建议在生产环境中使用服务端生成签名，否则masterSecret有暴露的风险
 */

// randomStr : 随机字符串, 作为签名加 salt 使用
let randomStr = '404';

// appkey : 开发者在飞马平台注册的 IM 应用 appkey
let appkey = 'ddb2388ff7af7e4a67451cc4';

// masterSecret : 密钥，由前端生成签名时需要填写，有暴露的风险
let masterSecret = '0fb1212b1b92e15df85089bc';

// isFrontSignature : 是否由前端生成签名，值为true则由前端自动生成签名，值为false则由服务端生成签名，开发者需要在服务端提供post类型接口
let isFrontSignature = true;

// signatureApiUrl : 由服务端生成签名时，前端调用服务端post类型接口的url，仅在isFrontSignature为false时可用
let signatureApiUrl = '';

// JIM 应用配置
export let authPayload = {
    appkey,
    masterSecret,
    randomStr,
    // flag : 是否启用消息漫游，值为0不开启，值为1开启
    flag: 1,
    isFrontSignature,
    signatureApiUrl
};

// 自定义滚动条配置
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

export let PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
    minScrollbarLength: 40
};

// js中静态资源的路径
export let imgRouter = '../../../assets/images/emoji/';

export let jpushRouter = '../../../assets/images/jpush/';

// 消息列表中滚动加载的每页消息的条数
export let pageNumber = 20;

// demo 签名配置项，开发者不用理会
let signature = '7db047a67a9d7293850ac69d14cc82bf';
let timestamp = 1507882399401;
export let demoInitConfig = {
    signature,
    timestamp
};
