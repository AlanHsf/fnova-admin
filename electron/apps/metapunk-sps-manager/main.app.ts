import { app, BrowserWindow, BrowserView, ipcMain } from "electron";
const electron = require('electron')
import * as path from "path";
import * as fs from "fs";


// IMPORTANT:通过apps/<appId>/加载应用独立配置
var appConfig = require(path.join(__dirname, `/config.js`)) // 默认加载包内config.js文件

var userConfig
/*********************
 * windows: process.env.PORTABLE_EXECUTABLE_DIR
 * linux:   process.env.OWD
 */
var OWN_DIR = process.env.PORTABLE_EXECUTABLE_DIR || process.env.OWD
if(OWN_DIR){
  let configPath = path.join(OWN_DIR, `/config.js`)
  if(fs.existsSync(configPath)){
    userConfig = require(configPath) // 用户独立配置config.js覆盖
    if(userConfig){
      Object.keys(userConfig).forEach(key=>{
        appConfig[key] = userConfig[key]
      })
    }
  }
}
// const reloader = require('electron-reloader')
// reloader(module)

import BotService from "./bot.serv"
var botServ = new BotService(electron,appConfig);

// reloader(module)
// IMPORTANT:通过协议挂载静态资源，路由及位置资源转向index.html
// const serve = require("nova-serve");
// const serve = require(path.join(__dirname, `/../plugins/nova-serve/`));
const serve = require(path.join(__dirname, `/plugins/nova-serve/`));
// const loadURL = serve({directory: path.join(__dirname, `/../../dist/nova-admin/`)});
const loadURL = serve({directory: path.join(__dirname, `/www/`)});
 

let mainWindow: BrowserWindow;
let splashWindow: BrowserWindow;
let splashView: BrowserView;
let adminView: BrowserView;

function setEnv(view,key,value?){
  value = process.env[key] || appConfig[key] || value
  view.webContents.executeJavaScript(`
      localStorage.setItem("${key}","${value}");
  `)
}

function InitEnvVariable(adminView,refresh?){
  if(true || refresh){
    adminView.webContents.executeJavaScript(`
      localStorage.clear();
      localStorage.setItem("isElectron","true");
  `)
  }

  // SETTING:设置客户端版本号、版本日期
  setEnv(adminView,"CLIENT_VERSION") // 0.0.1
  setEnv(adminView,"CLIENT_BUILD") // 20211126

  // SETTING:设置系统默认服务器
  setEnv(adminView,"PARSE_SERVERURL")
  setEnv(adminView,"PARSE_APPID")
  setEnv(adminView,"NOVA_SERVERURL")

  // SETTING:设置系统默认主页，打包应用时根据需求增加参数，限定系统主页
  setEnv(adminView,"NOVA_ADMIN_HOME")

  // SETTING:设置系统默认公司，打包应用时根据需求增加参数，限定系统主页
  setEnv(adminView,"company")
  setEnv(adminView,"META_GUILD")
  setEnv(adminView,"META_GUILD_PIN")

  // SETTING:设置系统首页默认标题名称
  setEnv(adminView,"title",appConfig.appName+" "+appConfig.version)

  // SETTING:设置系统默认隐藏layout标题及菜单，使用module内菜单规则
  setEnv(adminView,"hiddenMenu")

   // SETTING:设置默认登录背景图片
  setEnv(adminView,"BACKGROUP_LOGIN")

  // 首次启动，加载完环境变量后刷新首页
  adminView.webContents.executeJavaScript(`
    // if(location.href.indexOf("splash") == -1){
      // location.href = 'splash/index.html'
      location.reload() 
    // }
  `)
  adminView.webContents.executeJavaScript(`
            var electron = null;
            if(!electron){
                    var electron = require('electron');
            }
        `)
  // `)
}

function sleep(delay)
{
  var start = new Date().getTime();
  while (new Date().getTime() < start + delay);
}

/********************************
 * 将Splash单独作为一个View启动
 */
function newSplashView(){
  let {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
  splashView = new BrowserView()
  mainWindow.addBrowserView(splashView)
  splashView.setBackgroundColor("#000000")
  splashView.setBounds({width:width,height:height,x:0,y:0})
  // splashView.setBounds({width:300,height:300,x:0,y:0})
  splashView.webContents.loadURL(`file://${__dirname}/splash/index.html`)
}

/********************************
 * 将Admin单独作为View启动,启动后隐藏Splash
 */
function newAdminView(){
  let {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
  adminView = new BrowserView({webPreferences:{
    nodeIntegration:true,
    enableRemoteModule: true,
    contextIsolation:false
  }})
  mainWindow.addBrowserView(adminView)
  InitEnvVariable(adminView)
  adminView.webContents.once("dom-ready",()=>{
    if(process.env.NOVA_DEBUG || appConfig.NOVA_DEBUG){
      adminView.webContents.openDevTools({mode:'right'})
    }
  
    setTimeout(() => {
      if(splashWindow){
        splashWindow.destroy();
      }
      if(splashView){
        mainWindow.removeBrowserView(splashView);
        splashView = null;
      }
    }, 5000);
  })
  adminView.setBackgroundColor("#000000")
  adminView.setBounds({width:width,height:height,x:0,y:0})

  loadURL(adminView);
}

async function createWindow() {

  
  mainWindow = new BrowserWindow({ 
    fullscreen: true,
    backgroundColor:"000000",
    minWidth: 1200,
    minHeight: 800,
    frame: false,
    show: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation:false
    }
  });

  newAdminView();

  newSplashView();

  // mainWindow.once('')

  mainWindow.webContents.once('dom-ready', () => {
    mainWindow.show();
    mainWindow.setFullScreen(true)
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  botServ.init(mainWindow);
}

app.on("ready", createWindow);

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

function getImages() {
  const cwd = process.cwd();
  fs.readdir('.', {withFileTypes: true}, (err, files) => {
      if (!err) {
          const re = /(?:\.([^.]+))?$/;
          const images = files
            .filter(file => file.isFile() && ['jpg', 'png'].includes(re.exec(file.name)[1]))
            .map(file => `file://${cwd}/${file.name}`);
          mainWindow.webContents.send("getImagesResponse", images);
      }
  });
}

function isRoot() {
    return path.parse(process.cwd()).root == process.cwd();
}

function getDirectory() {
  fs.readdir('.', {withFileTypes: true}, (err, files) => {
      if (!err) {
          const directories = files
            .filter(file => file.isDirectory())
            .map(file => file.name);
          if (!isRoot()) {
              directories.unshift('..');
          }
          mainWindow.webContents.send("getDirectoryResponse", directories);
      }
  });
}

ipcMain.on("navigateDirectory", (event, path) => {
  process.chdir(path);
  getImages();
  getDirectory();
});