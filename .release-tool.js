'use strict'

/**
 * Nova Admin 专用自动化构建工具集
 * 一类工具：根据Nova后台代码规范及架构编制的命令与工具
 *    list 列出应用清单
 *    init 初始化环境为指定应用
 * 
 */
const fs = require('fs')
const fsex = require('fs-extra')
const path = require('path')
const colors = require('colors');

let AppSettingRootPath = path.join(__dirname,"config")
let CurrentApp,CurrentConfigPath = path.join(__dirname,"config.js")
if(fs.existsSync(CurrentConfigPath)){
    let mcode = fs.readFileSync(CurrentConfigPath).toString();
    CurrentApp= requireFromString(mcode,"current")
}


const Yargs = require('yargs');
const { inherits } = require('util');
Yargs.usage('usage: $0 <command>')
.command('list', '列出所有可用小程序清单',(yargs) => {
    yargs
        .positional('list', {
        describe: 'list all apps config',
        })
    }, (argv) => {
        list(argv)
}).command('init <appname>', '初始化小程序：根据appname',(yargs) => {
    yargs
        .positional('init', {
        describe: 'init wxapp by appname',
        })
        .option('name', {
        alias: 'n',
        type: 'string',
        default: null,
        description: '请输入APPNAME，即应用目录名'
        })
    }
    , (argv) => {
        argv.name = argv.name || argv.appname
        init(argv)
}
)

Yargs.parse();


function init(argv){
    console.log(`开始初始化应用：${argv.name}!`)
    let config = getAppConfig(argv);
    if(config){
        console.log(`已找到应用配置：${argv.name}|${config.version}|${config.appid}`)
        fsex.copySync(AppSettingRootPath+"/"+argv.name+"/",path.join(__dirname,"/"))
        console.log(`应用完成初始化：请启动开发者工具进行调试`)
    }else{
        console.error("该应用不存在或配置错误，请检查：",argv.name)
    }
}

function list(argv){
    let configMap = {}
    let configList = fs.readdirSync(AppSettingRootPath).filter(appname=>{
        let appPath = AppSettingRootPath+"/"+appname;
        let isdir = fs.lstatSync(appPath).isDirectory();
        if(isdir){
            let config = getAppConfig({name:appname})
            if(config){
                configMap[appname] = config
            }
        }
        return isdir
    })
 
    let noInit = true
    let currentName
    configList.forEach(appname=>{
        let info = `${appname}\t|\t${configMap[appname]["appname"] || '未命名'} ${configMap[appname]["version"] || '未命名'}\t|\t${configMap[appname]["appid"]}`
        if(CurrentApp&&((CurrentApp.appid == configMap[appname]["appid"])||CurrentApp.name == appname)){
            info = info.brightBlue
            currentName = appname
            noInit=false
        }
        console.log(info)
    })
    if(noInit){
        console.log(`请运行以下命令初始化小程序: npm run nova init <appname> \n`.brightBlue)
    }else{
        console.log(`当前应用: ${currentName}，如需切换可用: npm run nova init <appname> \n`.brightBlue)
    }
}









/** 工具：获取APP配置文件信息 */
function getAppConfig(argv){
    let name = argv&&argv.name || argv&&argv.appname
    if(!name){
        console.error("请输入应用名称：")
        return false
    }
    let appname = argv.name
    let apppath = AppSettingRootPath + "/" + argv.name
    let configpath = apppath+"/config.js";
    if(fs.existsSync(configpath)){
        let mcode = fs.readFileSync(configpath).toString();
        let json = requireFromString(mcode,appname)
        return json
    }else{
        return false
    }
}
/** 工具：解析ES6代码段加载Module */
function requireFromString(src, filename) {
    // Prefix: es6 import to node module.exports
    src = src.replace("export\ default\ config","module.exports=config")
    src = src.replace("export\ default\ \{","module.exports={")
    src = src.replace(/export\ default\ \{/g,"module.exports={")

    var Module = module.constructor;
    var m = new Module();
    m._compile(src, filename);
    return m.exports;
  }