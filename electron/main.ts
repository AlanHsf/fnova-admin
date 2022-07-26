import { app, screen, BrowserWindow, BrowserView, ipcMain, ipcRenderer } from "electron";
import { globalShortcut } from 'electron';
// const electron = require('electron')
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
if (OWN_DIR) {
  let configPath = path.join(OWN_DIR, `/config.js`)
  if (fs.existsSync(configPath)) {
    userConfig = require(configPath) // 用户独立配置config.js覆盖
    if (userConfig) {
      Object.keys(userConfig).forEach(key => {
        appConfig[key] = userConfig[key]
      })
    }
  }
}
// const reloader = require('electron-reloader')
// reloader(module)


// reloader(module)
// IMPORTANT:通过协议挂载静态资源，路由及位置资源转向index.html
// const serve = require("nova-serve");
// const serve = require(path.join(__dirname, `/../plugins/nova-serve/`));
const serve = require(path.join(__dirname, `/plugins/nova-serve/`));
// const loadURL = serve({directory: path.join(__dirname, `/../../dist/nova-admin/`)});
const loadURL = serve({ directory: path.join(__dirname, `/www/`) });


/*********************
 * 系统级C插件，限制锁屏功能
 * 参考：https://github.com/mad-hu/screenlock
 */

let lockScreen: any = undefined;
let userClose = process.platform == 'win32' ? false : true;

if (process.platform == 'win32') {
  if (process.arch == 'x32' || process.arch == "ia32") {
    lockScreen = require(path.join(__dirname, './screenlock_32.node'));
  } else {
    lockScreen = require(path.join(__dirname, './screenlock.node'));
  }
}

function setScreenLock(lock: boolean) {
  if (process.platform === 'win32') {
    if (lock) {
      lockScreen.lock();
    } else {
      lockScreen.unlock();
    }
  }
}

/*********************
 * 创建窗口及视图
 */

let mainWindow: BrowserWindow;
let splashWindow: BrowserWindow;
let splashView: BrowserView;
let adminView: BrowserView;

function setEnv(view, key, value?) {
  value = process.env[key] || appConfig[key] || value
  view.webContents.executeJavaScript(`
      localStorage.setItem("${key}","${value}");
  `)
}

function InitEnvVariable(adminView, refresh?) {
  if (true || refresh) {
    adminView.webContents.executeJavaScript(`
      localStorage.clear();
      localStorage.setItem("isElectron","true");
  `)
  }

  // SETTING:设置系统默认服务器
  setEnv(adminView, "PARSE_SERVERURL")
  setEnv(adminView, "PARSE_APPID")
  setEnv(adminView, "NOVA_SERVERURL")

  // SETTING:设置系统默认主页，打包应用时根据需求增加参数，限定系统主页
  setEnv(adminView, "NOVA_ADMIN_HOME")

  // SETTING:设置系统默认公司，打包应用时根据需求增加参数，限定系统主页
  setEnv(adminView, "company")

  // SETTING:设置系统首页默认标题名称
  setEnv(adminView, "title", appConfig.appName + " " + appConfig.version)

  // SETTING:设置系统默认隐藏layout标题及菜单，使用module内菜单规则
  setEnv(adminView, "hiddenMenu")

  // SETTING:设置默认登录背景图片
  setEnv(adminView, "BACKGROUP_LOGIN")

  // 首次启动，加载完环境变量后刷新首页
  adminView.webContents.executeJavaScript(`
    // if(location.href.indexOf("splash") == -1){
      // location.href = 'splash/index.html'
      location.reload()
    // }
  `)
  // adminView.webContents.executeJavaScript(`
  // var electron = null;
  // if(!electron){
  //   var electron = require('electron')
  // }
  // `)
}

function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() < start + delay);
}

/********************************
 * 将Splash单独作为一个View启动
 */
function newSplashView() {
  let { width, height } = screen.getPrimaryDisplay().workAreaSize
  splashView = new BrowserView()
  mainWindow.addBrowserView(splashView)
  splashView.setBackgroundColor("#000000")
  splashView.setBounds({ width: width, height: height, x: 0, y: 0 })
  // splashView.setBounds({width:300,height:300,x:0,y:0})
  splashView.webContents.loadURL(`file://${__dirname}/splash/index.html`)
}

/********************************
 * 将Admin单独作为View启动,启动后隐藏Splash
 */
function newAdminView() {
  let { width, height } = screen.getPrimaryDisplay().workAreaSize
  adminView = new BrowserView({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,

    }
  })
  mainWindow.addBrowserView(adminView)
  InitEnvVariable(adminView)
  adminView.webContents.once("dom-ready", () => {
    if (process.env.NOVA_DEBUG || appConfig.NOVA_DEBUG) {
      adminView.webContents.openDevTools({ mode: 'right' })
    }

    setTimeout(() => {
      if (splashWindow) {
        splashWindow.destroy();
      }
      if (splashView) {
        mainWindow.removeBrowserView(splashView);
        splashView = null;
      }
    }, 5000);
  })
  adminView.setBackgroundColor("#000000")
  adminView.setBounds({ width: width, height: height, x: 0, y: 0 })


  loadURL(adminView);


}

function registShotcut(shutcut, type) {
  let ret = globalShortcut.register(shutcut, () => {
    if (type == 'closeWin') {
      lockScreen.unlock();
      userClose = true;
      app.exit(0);
    }
    if (type == 'unlock') {
      lockScreen.unlock();
    }
    console.log(`${shutcut} is pressed`)
  })
  if (!ret) {
    console.log('registration failed')
    // 检查快捷键是否注册成功
    console.log(shutcut + ":" + globalShortcut.isRegistered(shutcut))
  }
}


function disableShotcut(shutcut) {

  let ret = globalShortcut.register(shutcut, () => {
    console.log(`${shutcut} is pressed`)
  })

  if (!ret) {
    console.log('registration failed')
  }

  // 检查快捷键是否注册成功
  console.log(shutcut + ":" + globalShortcut.isRegistered(shutcut))
}

async function createWindow() {


  /***************************
   * 根据参数开启是否限制用户切屏幕操作 快捷键参考：https://www.electronjs.org/zh/docs/latest/api/accelerator
   */
  // 系统层快捷键禁用
  setScreenLock(true);
  // 程序内置快捷键禁用
  // disableShotcut("Alt+Tab") // 切出
  // disableShotcut("Alt+F4")  // 关闭
  // disableShotcut("Ctrl+Shift+Delete") // 任务管理器
  // disableShotcut("Ctrl+Shift+Esc")
  // disableShotcut("F11") // 全屏
  // disableShotcut("ESC") // 全屏
  // disableShotcut("Windows+D") // 返回桌面
  // disableShotcut("Super+D")
  // disableShotcut("Meta+D")
  registShotcut("Ctrl+Shift+P", "closeWin")// 注册关闭程序快捷键
  // registShotcut("Ctrl+Shift+F10", "unlock")// 注册解锁快捷键
  // 创建主页面
  mainWindow = new BrowserWindow({
    fullscreen: true,
    backgroundColor: "000000",
    minWidth: 1200,
    minHeight: 800,
    frame: false,
    show: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,

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
  fs.readdir('.', { withFileTypes: true }, (err, files) => {
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
  fs.readdir('.', { withFileTypes: true }, (err, files) => {
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

ipcMain.on('unclockscreen', () => {
  setScreenLock(false);
});
ipcMain.on('clockcreen', () => {
  setScreenLock(true);
});
ipcMain.on('close-window', () => {
  userClose = true;
  app.exit(0);
});

