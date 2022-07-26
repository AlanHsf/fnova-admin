import { screen, app, BrowserWindow, BrowserView, ipcMain, ipcRenderer } from "electron";
// import { session } from "electron";
import * as path from "path";

const proc = require('child_process'); // 用于执行系统命令
const binaryEncoding = 'binary';

const fs = require("fs");
const request = require("request");
class DownloadService {

  // url: string = 'https://file-cloud.fmode.cn/baidu.apk'
  // fileName: string = 'vrTest.apk'
  downloadRequest: any;

  electron: any
  config: any

  downloadList: any = {} //下载列表

  constructor(electron, appConfig) {
    this.electron = electron;
    this.config = appConfig;
  }

  init() {
    ipcMain.on("apkPath", async (event, url, fileName,) => {
      let data = await this.apkPathCall(url, fileName, this.config['DIR_DOWNLOAD']);
      console.log('apkPathCall:' + data);
      event.sender.send('apkPathCall', data);
      event.reply("system Reply:", data);
    });

    //异步下载
    ipcMain.on("download", async (event, url, fileName,) => {
      let data = await this.downloadCall(url, fileName, this.config['DIR_DOWNLOAD']);
      console.log('downloadCall:' + data);
      event.sender.send('downloadCall', data);
      event.reply("system Reply:", data);
    });

    ipcMain.on("stopCallback", async (event, fileName,) => {
      let data = await this.stopCallback(fileName)
      event.returnValue = data;
      event.reply("system Reply:", data);
    });

    ipcMain.on("downloadListCall", async (event) => {
      let data = this.downloadListCall()
      event.returnValue = data;
      event.reply("system Reply:", data);
    });

    ipcMain.on("activeDown", async (event, fileName) => {
      let data = await this.activeDown(fileName)
      event.returnValue = data;
      event.reply("system Reply:", data);
    });
  }


  //是否存在、下载完整
  async apkPathCall(url, fileName, dir) {
    console.log(`url:${url},fileName:${fileName},dir:${dir}`);
    const data_1 = await new Promise((resolve, rejects) => {
      if (!fs.existsSync(dir)) {
        resolve('no');
        return;
      }
      let filePath = dir + '/' + fileName;
      if (fs.existsSync(filePath)) {
        let stats = fs.statSync(filePath);
        let statsSize = stats.size;
        console.log('size:' + statsSize);

        this.downloadList[fileName] = {
          url: url,
          len: 0,
          downIngSize: 0,
          downIng: 0,
          progress: 0,
          state: 'stop', //downing下载中 stop中断 ok已完成
        };

        let lenSize;
        let req = request({
          method: 'GET',
          uri: url
        });
        req.on('response', (data) => {
          lenSize = data.headers['content-length'];
          this.downloadList[fileName].len = (lenSize / 1048576).toFixed(2);
          this.downloadList[fileName].downIngSize = (statsSize / 1048576).toFixed(2);
          this.downloadList[fileName].progress = (statsSize / lenSize * 100).toFixed(2);
          if (lenSize == statsSize) {
            this.downloadList[fileName].state = 'ok';
            req.abort();
            resolve('ok');
            return;
          }
          req.abort();
          resolve('stop');
        });
        req.on('data', (chunk) => {
          console.log(chunk.length);
        });
        req.on('error', (err) => {
          console.log(err);
        });
      } else {
        resolve('no');
      }
    });
    console.log('resolve:' + data_1);
    return data_1;

  }

  //开始、继续下载文件 支持断点下载
  downloadCall(url, fileName, dir) {
    console.log(`url:${url},fileName:${fileName},dir:${dir}`);
    if (this.downloadList[fileName] && this.downloadList[fileName].url == url
      && this.downloadList[fileName].state != 'stop') {
      return false
    }
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        this.downloadList[fileName] = {
          url: url,
          len: 0, //下载总大小MB
          downIngSize: 0, //当前已下载大小MB
          downIng: 0, //当前下载速度
          progress: 0, //当前下载进度%制,
          state: 'downing', //downing下载中 stop中断 ok已完成
          // downloadRequest:function(){}
        }
        console.log(this.downloadList);
        //如果文件已存在，获取已下载大小bytes字节
        let filePath = dir + '/' + fileName
        let receivedBytes = 0;
        if (fs.existsSync(filePath)) {
          let stats = fs.statSync(filePath);
          receivedBytes = stats.size;
          console.log(`resume:${receivedBytes}`);
        }
        let stream = fs.createWriteStream(path.join(dir, fileName), {
          start: receivedBytes,
          flags: receivedBytes > 0 ? 'a+' : 'w'
        });

        let len: any = 0 //总大小MB
        let lenSize = 0
        let req = request({
          method: 'GET',
          uri: url
        });
        req.setHeader('Range', `bytes=${receivedBytes}-`)
        req.on('response', (data) => {
          lenSize = data.headers['content-length'] ? Number(data.headers['content-length']) + receivedBytes : receivedBytes
          len = (lenSize / 1048576).toFixed(2)
          console.log(`${fileName}fileMax:${len}Mb`);
          this.downloadList[fileName].len = len
          resolve(true)
        });
        req.pipe(stream);
        req.on('data', (chunk) => {
          receivedBytes += chunk.length
          let downIng = (chunk.length / 1048576).toFixed(2) //当前下载速度MB 
          let downIngSize: any = (receivedBytes / 1048576).toFixed(2) //已下载MB
          let progress = (downIngSize / len * 100).toFixed(2)
          this.downloadList[fileName].downIng = downIng
          this.downloadList[fileName].downIngSize = downIngSize
          this.downloadList[fileName].progress = progress
          if (Number(progress) >= 100 || receivedBytes == lenSize) {
            this.downloadList[fileName].state = 'ok'
          }
        });
        req.on('end', () => {
          console.log('end');
        });
        req.on('error', (err) => {
          console.log('stop:' + err);
        });
        this.downloadList[fileName].downloadRequest = req
      }
      catch (err) {
        reject('err')
      }
    })
  }

  //获取当前下载进度
  activeDown(fileName) {
    return JSON.stringify(this.downloadList[fileName]) || null
  }

  //暂停下载
  stopCallback(fileName) {
    if (this.downloadList[fileName] && this.downloadList[fileName].downloadRequest) {
      this.downloadList[fileName].downloadRequest && this.downloadList[fileName].downloadRequest.abort()
      this.downloadList[fileName].state = 'stop'
      return JSON.stringify(this.downloadList[fileName])
    }
  }

  //获取下载列表
  downloadListCall() {
    return this.downloadList ? JSON.stringify(this.downloadList) : null
  }

}
export default DownloadService