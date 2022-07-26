
import { screen, app, BrowserWindow, BrowserView, ipcMain, ipcRenderer } from "electron";
// import { session } from "electron";
import * as path from "path";

const proc = require('child_process'); // 用于执行系统命令
const binaryEncoding = 'binary';

var http = require("http")
// var httpProxy = require("http-proxy")
var httpProxy = require(path.join(__dirname, `/plugins/http-proxy/`));


const fs = require("fs");
const request = require("request");

var PlayerMap = {}
var GuildData = {}


class GameService {

    guild = null
    players = []
    // playerMap = {}
    viewMap = {}
    xyzMap = {}

    electron: any
    config: any

    IPV4_ADDRESS: any
    IPV4_HOST: any
    downloadList: any = {} //下载列表

    constructor(electron, appConfig) {
        this.electron = electron;
        this.config = appConfig;
    }

    viewGuard() { // 实时监测窗口状态
        // 根据players[].now时间状态，判断各个Views中监控器的运行状态，若停止则恢复
        setInterval(() => {
            this.players.forEach((item, index) => {
                let player = PlayerMap[item.key];
                if (player) {
                    let view: BrowserView = this.viewMap[player.key] || null

                    if (player && player.key && view) {
                        let now = new Date();
                        if (player.now) {
                            let difftime = (now.getTime() - player.now.getTime()) / 1000
                            if (difftime > 9.9) {
                                if (view) {
                                    this.setCtrlButtonFromJS(view.webContents, player, index);
                                    this.setRpcFromJS(view.webContents, player);
                                }
                            }
                        }
                    } // end view

                } // end player

            })
        }, 10 * 1000)
    }


    init(mainWindow) {
        // 两个BrowserWindow之间的localStorage是共享的
        ipcMain.on("SystemCall", async (event, value) => {
            let data = await this.ExecPromise(value);
            event.returnValue = data;
            event.reply("system Reply:", data);
        });

        ipcMain.on("onSystem", async (event, value) => {
            let data = await this.ExecPromise(value);
            event.sender.send('onSystemCall', data);
            event.reply("system Reply:", data);
        });

        ipcMain.on("onScrcpy", async (event, value) => {
            let data = await this.ScrcpyCall(value)
            console.log(data);
            event.sender.send('ScrcpyCall', data);
            event.reply("system Reply:", data);
        });

        ipcMain.on("cmdDirCall", async (event, value) => {
            let data = await this.cmdDirCall(value)
            console.log(data);
            event.returnValue = data;
            event.reply("system Reply:", data);
        });
        // this.viewGuard() // 之前机器人窗口守卫，可以参考换成游戏进程守卫
    }


    async ExecPromise(command) {
        let data = proc.execSync(command, {
            encoding: binaryEncoding
        });
        // console.log(data);
        return data
    }

    ScrcpyCall(params) {
        return new Promise((resolve, reject) => {
            let exeBin = "scrcpy"
            params = params || " -f"

            let child = proc.exec(`${exeBin}${params}`);

            child.stdout.on('data', function(data) {
              resolve("ok:"+data)
            });
            child.stderr.on('data', function(data) {
              resolve("stderr:"+data)
            });
            child.on('close', function(code) {
              console.log("code:"+code);
              resolve("err:"+code)
            });

            // proc.execFile(exeBin, [params], (error, stdout, stderr) => {
            //     if (error) {
            //         resolve("err:" + error)
            //         throw error;
            //     }
            //     resolve("log:" + stdout)
            //     console.log(stdout);
            // });
            // setTimeout(() => {
            //     resolve("starting")
            // }, 5000);
        })
    }

    cmdDirCall(params) {
        return new Promise((resolve, reject) => {
            params = params || "adb devices"
            let child = proc.exec(params);
            child.stdout.on('data', function (data) {
                resolve("ok:" + data)
            });
            child.stderr.on('data', function (data) {
                resolve("stderr:" + data)
            });
            child.on('close', function (code) {
                console.log("code:" + code);
                resolve("err:" + code)
            });
        })
    }

    /************************************************************
     * ADB服务封装接口，用于APK安装以及数据包同步
     */

    /**
     * 检查是否有adb环境
     */
    async RunAdbCommand(command) {
        return await this.ExecPromise(command);
    }
    async checkAdbEnv() {
        let data = await this.ExecPromise('adb version');
        console.log(data)
        return data;
    }

    async checkAdbDevices() {
        let data = await this.ExecPromise('adb devices');
        console.log(data)
        return data;
    }

    /**
     * 安装apk到指定设备
     * 超时时间默认50s
     * @param {*} deviceId 
     * @param {*} apkPath 
     */
    installApk(deviceId, apkPath) {
        let installPromise = this.ExecPromise(`adb -s ${deviceId} install ${apkPath}`);

        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => { reject('timeout') }, 50000)
        })
        return Promise.race([installPromise, timeoutPromise]);
    }



    /************************************************************
     * 创建新窗口：启动游戏后的视频流实时播放窗口，可以通过该方式创建
     * 
     * 
     *  */
    async newBotView(mainWindow, player, guild, index) {
        index = String(index)
        if (!PlayerMap[player.key]) { PlayerMap[player.key] = player }

        if (this.viewMap[player.key]) { return }

        let { width, height } = screen.getPrimaryDisplay().workAreaSize
        let botView = new BrowserView({
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true,
                contextIsolation: false,
            }
        })
        let botUrl = `http://${player.key}.${this.IPV4_HOST}/metapunk/sps/battlebot?key=${player.key}&pin=${player.pin}&v=${new Date().getTime()}&guild=${guild}`

        let xyz = this.xyzMap[index]
        mainWindow.addBrowserView(botView)

        await this.prefixHeaders(botView.webContents);
        await this.setCtrlButtonFromJS(botView.webContents, player, index);
        await this.setRpcFromJS(botView.webContents, player);

        botView.setBackgroundColor("#000000")
        // let viewWidth = xyz.width;
        // let viewHeight = xyz.height;
        botView.setBounds({ width: xyz.width, height: xyz.height, x: xyz.x, y: xyz.y })
        // botView.setBounds({width:300,height:300,x:0,y:0})
        botView.webContents.loadURL(botUrl)
        // botView.webContents.openDevTools({mode:'right'})

        this.viewMap[player.key] = botView;
    }

    async createBotWindow(player) {
        let botWindow: BrowserWindow;
        // let botUrl = `http://106.12.254.207:10001/metapunk/sps/battlebot?key=${player.key}&pin=${player.pin}`
        let botUrl = `http://${player.key}.${this.IPV4_HOST}/metapunk/sps/battlebot?key=${player.key}&pin=${player.pin}&v=${new Date().getTime()}`

        botWindow = new BrowserWindow({
            fullscreen: true,
            backgroundColor: "000000",
            minWidth: 500,
            minHeight: 800,
            frame: false,
            show: true,
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true,
                contextIsolation: false,
            }
        });

        botWindow.webContents.openDevTools({ mode: 'right' })

        await this.prefixHeaders(botWindow.webContents);
        await this.setRpcFromJS(botWindow.webContents, player);

        // 设置代理
        // await botWindow.webContents.session.setProxy({proxyRules:"socks5://114.215.193.156:1080"});


        //   botWindow.webContents.executeJavaScript(`
        //     var pf_cookies = "";
        //     var pf_storage
        //     localStorage.clear();
        //     localStorage.setItem("isElectron","true");
        // `)

        // botWindow.once('')

        botWindow.webContents.once('dom-ready', () => {
            botWindow.show();
        });

        botWindow.on("closed", () => {
            botWindow = null;
        });

        botWindow.loadURL(botUrl);
    }
    async setCtrlButtonFromJS(webContents: any, player, index) {

        let ctrlHTML = `
            <style>
                .ctrl-area{
                    position:fixed;
                    top:0px;
                    right:0px;
                    z-index:65535!important;
                }
                .ctrl-button{
                    background-color: #4CAF50; /* Green */
                    border: none;
                    color: white;
                    padding: 5px 5px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    width:28px;
                    font-size: 14px;
                }
                .ctrl-button:hover{
                    background-color: #3C8F20;
                }
                .ctrl-button-warn{background-color: #f44336;}
                .ctrl-button-warn:hover{background-color: #c42326;}
                .ctrl-button-light{background-color: #e7e7e7; color: black;}
                .ctrl-button-light:hover{background-color: #AAAAAA; color: black;}
            </style>
            <button class="ctrl-button" onclick="ctrlReboot()">↻</button><br>
            <button class="ctrl-button ctrl-button-light" onclick="ctrlMin()">━</button><br>
            <button class="ctrl-button ctrl-button-light" onclick="ctrlMax()">▢</button><br>
            <button class="ctrl-button ctrl-button-warn" onclick="ctrlShutdown()">✖</button>
      `

        webContents.executeJavaScript(`
          var electron = null;
          if(!electron){
                  var electron = require('electron');
          }
         
          //获取body的标签
            var elvarMap = {};

            elvarMap.body= document.getElementsByTagName('body')[0];
            //创建div标签
            elvarMap.ctrlArea = document.createElement('div');
            //属性赋值
            //下面为必要操作 否则将不能使用script标签中的内容
            elvarMap.ctrlArea.onload = function() {
                // resolve(null);
            };
            //添加class属性值
            elvarMap.ctrlArea.className = "ctrl-area";

            function ctrlReboot(){
                // window.location.reload();
                let result = electron.ipcRenderer.sendSync("rebootPlayer",{player:{key:"${player.key}",pin:"${player.pin}"},guild:${this.guild},index:${index}});
            }
            function ctrlMin(){
                let result = electron.ipcRenderer.sendSync("hidePlayer",{player:{key:"${player.key}"}});
            }
            function ctrlMax(){
                let result1 = electron.ipcRenderer.sendSync('hideAllPlayers',null);
                let result2 = electron.ipcRenderer.sendSync('fullPlayer',{player:{key:"${player.key}"},index:${index}});
            }
            function ctrlShutdown(){
                let result = electron.ipcRenderer.sendSync("closePlayer",{player:{key:"${player.key}"}});
            }

            elvarMap.ctrlArea.innerHTML = \`${ctrlHTML}\`;
            elvarMap.body.appendChild(elvarMap.ctrlArea);
          
            try{ // window崩溃重启监测
              let testLS = localStorage.getItem("PLAYER_STATUS");
            }catch(err){
              ctrlReboot()
            }

      `).then(data => {
            console.log(data)
        }).catch(error => {
            console.error(error)
        })
    }
    async setRpcFromJS(webContents: any, player) {
        // console.log("setPlayer:",player)
        webContents.executeJavaScript(`
          var electron2 = null;
          if(!electron2){
                  var electron2 = require('electron');
          }

          try{ // window崩溃重启监测
            let testLS = localStorage.getItem("PLAYER_STATUS");
          }catch(err){
            ctrlReboot()
          }

          setInterval(()=>{ // UI崩溃重启
            if(document.getElementsByClassName("sps-logout").length==0){
              ctrlReboot()
            }
          },50*1000)

          setInterval(()=>{
            let result = electron2.ipcRenderer.sendSync('setPlayer',{
              "pin":"${player.pin}",
              "key":"${player.key}",
              "status":localStorage.getItem("PLAYER_STATUS")||"battle",
              "now":new Date()
            });
          },1000)
      `).then(data => {
            // console.log("setRpcFromJS then",data)
        }).catch(error => {
            console.error("setRpcFromJS catch", error)
        })
    }

    async prefixHeaders(webContents: any) {
        // 直接设定Window里面的session，可以精准修改单个Window的Headers，实现每个Window一个UA信息
        // Modify the origin for all requests to the following urls.
        const filter = {
            urls: ['*://*.snapyr.com/*', '*://*.splinterlands.com/*']
        };

        let session = webContents.session;
        session.webRequest.onBeforeSendHeaders(
            filter,
            (details, callback) => {
                // 模拟真实网址，访问真实地址，避免传递localstorage或106.xx.xx.xx到接口地址
                details.requestHeaders['Origin'] = 'https://splinterlands.com';
                details.requestHeaders['Referer'] = 'https://splinterlands.com/?p=about-player';
                // 模拟真实终端，
                details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0';
                callback({ requestHeaders: details.requestHeaders });
            }
        );

        session.webRequest.onHeadersReceived(
            filter,
            (details, callback) => {
                // details.responseHeaders['Access-Control-Allow-Origin'] = [
                //   'capacitor-electron://-'
                // ];
                callback({ responseHeaders: details.responseHeaders });
            }
        );

        // webContents.executeJavaScript(`
        //     var electron = null;
        //     if(!electron){
        //             var electron = require('electron');
        //     }
        // `)
        // 清除所有用户缓存信息
        await webContents.session.clearAuthCache();
        await webContents.session.clearStorageData();
        await webContents.session.clearCache();
        await webContents.session.clearHostResolverCache();
    }
}
export default GameService