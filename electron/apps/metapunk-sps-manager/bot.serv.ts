
import { screen, app, BrowserWindow ,BrowserView, ipcMain,ipcRenderer } from "electron";
// import { session } from "electron";
import * as path from "path";

var http = require("http")
// var httpProxy = require("http-proxy")
var httpProxy = require(path.join(__dirname, `/plugins/http-proxy/`));


var PlayerMap = {}
var GuildData = {}


class BotService{

    guild = null
    players = []
    // playerMap = {}
    viewMap = {}
    xyzMap = {}

    electron:any
    config:any

    IPV4_ADDRESS:any
    IPV4_HOST:any

    constructor(electron,appConfig){
        this.electron = electron;
        this.config = appConfig;

                   
        // 设置HOST实现多帐号切换
        this.IPV4_HOST = "sps.dapp"
        if(this.config.IPV4_HOST&&this.config.IPV4_HOST!="undefined"){
          this.IPV4_HOST = this.config.IPV4_HOST
        }
        // app.commandLine.appendSwitch('host-rules', 'MAP *.sps.dapp 106.12.254.207,MAP api.hive.blog hived.splinterlands.com')
        // this.IPV4_ADDRESS = "spsbot.fmode.cn"
        this.IPV4_ADDRESS = "139.159.253.131"
        if(this.config.IPV4_ADDRESS&&this.config.IPV4_ADDRESS!="undefined"){
          this.IPV4_ADDRESS = this.config.IPV4_ADDRESS
        }
        app.commandLine.appendSwitch('host-rules', `MAP *.${this.IPV4_HOST} ${this.IPV4_ADDRESS},MAP api.hive.blog hived.splinterlands.com`)
        // app.commandLine.appendSwitch('host-rules', `MAP *.${this.IPV4_HOST} 127.0.0.1,MAP api.hive.blog hived.splinterlands.com`)
        this.runBotHttpServer(this.IPV4_ADDRESS)

        if(this.config.guild){
          this.guild = this.config.META_GUILD
        }
        if(this.config.players){
          this.players = this.config.players
        }
    }

    viewGuard(){ // 实时监测窗口状态
      // 根据players[].now时间状态，判断各个Views中监控器的运行状态，若停止则恢复
      setInterval(()=>{
        this.players.forEach((item,index)=>{
          let player = PlayerMap[item.key];
          if(player){
              let view:BrowserView = this.viewMap[player.key] || null

              if(player&&player.key&&view){
                  let now = new Date();
                  if(player.now){
                    let difftime = (now.getTime()-player.now.getTime())/1000
                    if(difftime>9.9){
                      if(view){
                        this.setCtrlButtonFromJS(view.webContents,player,index);
                        this.setRpcFromJS(view.webContents,player);
                      }
                    }
                  }
              } // end view

          } // end player

        })
      },10*1000)
    }


    async runBotHttpServer(address){
      return
      var proxy = httpProxy.createProxyServer({})
      proxy.on('error',(err,req,res)=>{
        res.end();
      })
      
      var bot_server = http.createServer(function(req, res) {
        req.headers.host=address // 跳过七牛防盗链
        proxy.web(req, res, {
            target: `http://${address}`
        });
      });

      bot_server.listen(10001, function() {
      });
    }
    init(mainWindow){
        // 两个BrowserWindow之间的localStorage是共享的
        this.quickXYZ(2); 
        setTimeout(async ()=>{

          // this.createBotWindow(players[0])
          // this.createAllPlayersView(mainWindow);
        },6000)

        ipcMain.on("getPlayers", ( event,value ) => {
          // ipcRenderer.send("playersToBrowser",playMap)
          let players = this.players.map(p=>{
            if(PlayerMap[p.key]){
              return PlayerMap[p.key]
            }else{
              return p
            }
          })
          // console.log("g:",players)
          // console.log("g:",PlayerMap)
          this.players = players;
          event.returnValue = players;
          event.reply("getPlayersReply",players);
        });

        ipcMain.on("setPlayers", ( event,value ) => {
          // ipcRenderer.send("playersToBrowser",playMap)
          // this.players = value;
          let players = value.map(p=>{
            if(PlayerMap[p.key]){
              return PlayerMap[p.key]
            }else{
              return p
            }
          })
          this.players = players;
          event.returnValue = players;
          event.reply("setPlayersReply",players);
        });

        ipcMain.on("setGuild", ( event, value ) => {
          let guild = value;
          GuildData = guild;
          event.returnValue = true;
          event.reply("setGuild",true);
        });

        ipcMain.on("setPlayer", ( event, value ) => {
          // console.log("ipc setPlayer", value)
          // ipcRenderer.send("playersToBrowser",playMap)
          // if(typeof value == "string"){
            // value = JSON.parse(value);
          // }
          let player = value;
          // console.log("setPlayer",value)
          if(player&&player.key){
            if(player.status){
              PlayerMap[player.key].status=player.status;
            }
            if(player.now){
              PlayerMap[player.key].now=player.now;
            }
          }
          event.returnValue = true;
          event.reply("setPlayer",true);
        });

        ipcMain.on("createAllPlayersView", ( event,value ) => {
          console.log("createAllPlayersView");
          this.createAllPlayersView(mainWindow);
          event.returnValue = true;
          event.reply("createAllPlayersView",true);
        });

        ipcMain.on("rebootPlayer", ( event,data ) => {
          console.log("rebootPlayer:");
          this.rebootPlayer(mainWindow,data);
          event.returnValue = true;
          event.reply("rebootPlayer",true);
        });

        ipcMain.on("showPlayer", ( event,value ) => {
          this.showPlayer(value.player,value.index)
          event.returnValue = true;
          event.reply("showPlayer",true);
        });
        ipcMain.on("closePlayer", ( event,value ) => {
          this.closePlayer(mainWindow,value)
          event.returnValue = true;
          event.reply("closePlayer",true);
        });
        ipcMain.on("fullPlayer", ( event,value ) => {
          this.fullPlayer(value.player,value.index)
          event.returnValue = true;
          event.reply("fullPlayer",true);
        });
        ipcMain.on("showAllPlayers", ( event,value ) => {
          console.log("showAllPlayers");
          this.showAllPlayers(mainWindow);
          event.returnValue = true;
          event.reply("showAllPlayers",true);
        });
        ipcMain.on("hidePlayer", ( event,value ) => {
          this.hidePlayer(value.player)
          event.returnValue = true;
          event.reply("hidePlayer",true);
        });
        ipcMain.on("hideAllPlayers", ( event,value ) => {
          console.log("hideAllPlayers");
          this.hideAllPlayers(mainWindow);
          event.returnValue = true;
          event.reply("hideAllPlayers",true);
        });
        ipcMain.on("closeWindow", ( event,value ) => {
          process.exit(8);
          event.returnValue = true;
          event.reply("hideAllPlayers",true);
        });

        this.viewGuard()
    }

    showPlayer(player,index){
      let view:BrowserView = this.viewMap[player.key] || null
      if(view){
        let xyz = this.xyzMap[index]
        view.setBounds({width:xyz.width,height:xyz.height,x:xyz.x,y:xyz.y})
        if(process.env.NOVA_DEBUG){
          view.webContents.closeDevTools();
        }
      }
    }
    fullPlayer(player,index){
      let view:BrowserView = this.viewMap[player.key] || null
      let {width, height} = screen.getPrimaryDisplay().workAreaSize

      if(view){
        view.setBounds({width:width-240,height:height,x:240,y:0})
        if(process.env.NOVA_DEBUG){
          view.webContents.openDevTools({mode:'right'});
        }
      }
    }
    hidePlayer(player){
      let view:BrowserView = this.viewMap[player.key] || null
      if(view){
        view.setBounds({width:0,height:0,x:0,y:0})
      }
    }
    async closePlayer(mainWindow:BrowserWindow,data){
      if(!data.player) {return};
        let view:BrowserView = this.viewMap&&this.viewMap[data.player.key] || null
        if(view){
          mainWindow.removeBrowserView(view);
          (view.webContents as any).destroy()
          this.viewMap[data.player.key] = null;
          delete this.viewMap[data.player.key];
        }
    }
    async showAllPlayers(mainWindow){
      for (let index = 0; index < this.players.length; index++) {
          let player:any = this.players[index];
          let view:BrowserView = this.viewMap[player.key] || null
          if(view){
            let xyz = this.xyzMap[index]
            view.setBounds({width:xyz.width,height:xyz.height,x:xyz.x,y:xyz.y})
            if(process.env.NOVA_DEBUG){
              view.webContents.closeDevTools();
            }
          }
      }
    }
    async rebootPlayer(mainWindow:BrowserWindow,data){
      this.quickXYZ(2);
      if(!data.player) {return};
      let oldplayer = data.oldplayer || null;
      let viewkey = oldplayer&&oldplayer.key || data.player.key; // 重启替换新玩家时，关闭老玩家窗口

      let view:BrowserView = this.viewMap&&this.viewMap[viewkey] || null;
      if(view){
        mainWindow.removeBrowserView(view);
        (view.webContents as any).destroy()
        this.viewMap[viewkey] = null;
        delete this.viewMap[viewkey];
      }
      console.log("VIEWS",mainWindow.getBrowserViews());
      console.log("ALL",Object.keys(this.viewMap));
      console.log("NULL",Object.values(this.viewMap).filter(item=>item == null));
      this.newBotView(mainWindow,data.player,this.guild,data.index)
    }
    async hideAllPlayers(mainWindow:BrowserWindow){
      for (let index = 0; index < this.players.length; index++) {
        let player:any = this.players[index];
        let view:BrowserView = this.viewMap[player.key] || null
        if(view){
          view.setBounds({width:0,height:0,x:0,y:0})
        }
    }
    }

    async createAllPlayersView(mainWindow){
      this.quickXYZ(2)
      for (let index = 0; index < this.players.length; index++) {
        let player = this.players[index];
        try{
          this.rebootPlayer(mainWindow,{player:player,index:index})
          // await this.newBotView(mainWindow,player,this.guild,index)
        }catch(err){
          console.error(err) ;
        }
      }
    }

    // 根据玩家数量、行数快速形成布局位置
    quickXYZ(row=3){
      let {width, height} = screen.getPrimaryDisplay().workAreaSize
      let fullwidth = width - 240;
      let fullheight = height;
      let count = this.players.length;
      // let rowCount = parseInt(String(count/row)); // 整数去小数
      let rowCount = Math.ceil(count/row);  // 整数补一

      let w=fullwidth/rowCount;
      let h=fullheight/row;

      // let xyzMap={}
      for (let index = 0; index < count; index++) {
        let rowNum = Math.ceil((index+1)/rowCount); // 整数补一
        let x = 240+w*index-fullwidth*(rowNum-1)
        let y = (rowNum-1)*h
        this.xyzMap[index]={
          width:w,
          height:h,
          x:x,
          y:y
        }        
      }
      // this.xyzMap = xyzMap
      return this.xyzMap;
    }

    async newBotView(mainWindow,player,guild,index){
      this.quickXYZ(2)
      index = String(index)
      if(!PlayerMap[player.key]){PlayerMap[player.key]=player}

      if(this.viewMap[player.key]){return}
      
        let {width, height} = screen.getPrimaryDisplay().workAreaSize
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
        await this.setCtrlButtonFromJS(botView.webContents,player,index);
        await this.setRpcFromJS(botView.webContents,player);

        botView.setBackgroundColor("#000000")
        // let viewWidth = xyz.width;
        // let viewHeight = xyz.height;
        botView.setBounds({width:xyz.width,height:xyz.height,x:xyz.x,y:xyz.y})
        // botView.setBounds({width:300,height:300,x:0,y:0})
        botView.webContents.loadURL(botUrl)
        // botView.webContents.openDevTools({mode:'right'})

        this.viewMap[player.key] = botView;
    }

    async createBotWindow(player){
        let botWindow: BrowserWindow;
        // let botUrl = `http://106.12.254.207:10001/metapunk/sps/battlebot?key=${player.key}&pin=${player.pin}`
        let botUrl = `http://${player.key}.${this.IPV4_HOST}/metapunk/sps/battlebot?key=${player.key}&pin=${player.pin}&v=${new Date().getTime()}`
        
        botWindow = new BrowserWindow({ 
            fullscreen: true,
            backgroundColor:"000000",
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
        
        botWindow.webContents.openDevTools({mode:'right'})

        await this.prefixHeaders(botWindow.webContents);
        await this.setRpcFromJS(botWindow.webContents,player);
        
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
    async setCtrlButtonFromJS(webContents:any,player,index){

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

      `).then(data=>{
        console.log(data)
      }).catch(error=>{
        console.error(error)
      })
    }
    async setRpcFromJS(webContents:any,player){
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
      `).then(data=>{
        // console.log("setRpcFromJS then",data)
      }).catch(error=>{
        console.error("setRpcFromJS catch",error)
      })
    }

    async prefixHeaders(webContents:any){
        // 直接设定Window里面的session，可以精准修改单个Window的Headers，实现每个Window一个UA信息
        // Modify the origin for all requests to the following urls.
        const filter = {
          urls: ['*://*.snapyr.com/*','*://*.splinterlands.com/*']
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
export default BotService