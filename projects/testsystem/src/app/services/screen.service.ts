import { Injectable } from '@angular/core';
// var electron = require("electron");
// import { ipcRenderer } from "electron"
declare var electron: any;
declare var location: any;

@Injectable({
  providedIn: 'root'
})
export class screenService {


  constructor() { }


  /*********************
   * Electron 初始化Nodejs通信层
   */
  isElectron = true;

  async initElectronRender() {
    this.initScripts() // onload返回有问题，如果用await会导致后续脚本执行失败
  }

  initScripts() {
    if (!this.isElectron) return
    return new Promise((resolve, reject) => {
      //获取head的标签
      let head = document.getElementsByTagName('head')[0];
      //创建script标签
      let script = document.createElement('script');
      //属性赋值
      script.async = true;
      script.type = 'text/javascript';
      //下面为必要操作 否则将不能使用script标签中的内容
      script.onload = function () {
        resolve(null);
      };
      script.innerHTML = `
            var electron = null;

            if(!electron){
              var electron = require("electron");
            }
            `
      //添加src属性值
      // script.src= src;
      head.appendChild(script);
    })
  }

  async electronEvent(event, value = null) {
    if (!this.isElectron) return
    return new Promise((resolve, reject) => {
      if (electron) {
        setTimeout(() => {
          let data: any = electron.ipcRenderer.sendSync(event, value);
          resolve(data)
        }, 300);
      } else {
        resolve([])
      }
    })
  }



  /*********************
   * Oculus ADB相关接口
   */
  adbVersion() {
    console.log("Run adb version");
    let devices: any = electron.ipcRenderer.sendSync('SystemCall', "adb version");
    console.log(devices)
  }

  adbDevices() {
    console.log("Run adb devices");
    let devices: any = electron.ipcRenderer.sendSync('SystemCall', "adb devices");
    console.log(devices)
    if (devices.indexOf('device') != devices.lastIndexOf('device') && devices.indexOf('192') != -1 && devices.indexOf('offline') == -1) {
      return true
    }
    return false
  }

  //下载
  async downloadAPK(url, fileName) {
    return new Promise((resolve, rejects) => {
      electron.ipcRenderer.send('download', url, fileName);
      electron.ipcRenderer.on('downloadCall', (event, state) => {
        console.log('webLog点击下载返回' + state);
        resolve(state)
        !state && setTimeout(() => {
          resolve(false)
        }, 2000);
      });
    }).then(data => {
      return data
    })

  }
  async downIng(fileName) {
    let downCall: any = await electron.ipcRenderer.sendSync('activeDown', fileName);
    let result: any
    if (downCall != 'null') result = JSON.parse(downCall)
    return result
  }
  //暂停下载
  async stopDownload(fileName) {
    let downCall: any = await electron.ipcRenderer.sendSync('stopCallback', fileName);
    let result = downCall && JSON.parse(downCall) || null
    return result
  }

  //连接设备
  adbConnect(type, value?) {
    try {
      electron.ipcRenderer.sendSync('SystemCall', "adb kill-server");
      console.log('重置adb成功');
      let res: any
      //用户输入IP连接
      if (type == 'code') {
        res = electron.ipcRenderer.sendSync('SystemCall', `adb connect ${value}`);
        //无线连接成功
        if (res.indexOf('connected') != -1) {
          return {
            type: true,
            msg: res
          }
        }
        return {
          type: false,
          msg: res
        }
      }
      //usb连接
      else {
        let devices = electron.ipcRenderer.sendSync('SystemCall', "adb devices");
        if (devices.indexOf('device') == devices.lastIndexOf('device')) {
          return {
            type: false,
            msg: '请先将Quest设备使用USB连接本机'
          }
        }
        let adbInstruct1 = electron.ipcRenderer.sendSync('SystemCall', "adb shell ip addr show wlan0");
        if (adbInstruct1.indexOf('192') != -1 || adbInstruct1.indexOf('172') != -1) {
          let indexOf = adbInstruct1.indexOf('192') || adbInstruct1.indexOf('172')
          let ipCode = adbInstruct1.slice(indexOf, indexOf + 16)
          let arrCode = ipCode.split('/')
          res = electron.ipcRenderer.sendSync('SystemCall', `adb connect ${arrCode[0]}`);
          //无线连接成功
          if (res.indexOf('connected') != -1) {
            return {
              type: true,
              msg: res
            }
          }
          //拒绝连接、未响应，执行
          let adbInstruct2 = electron.ipcRenderer.sendSync('SystemCall', "adb tcpip 5555");
          if (adbInstruct2.indexOf('restarting') != -1) {
            res = electron.ipcRenderer.sendSync('SystemCall', `adb connect ${arrCode[0]}`);
            if (res.indexOf('connected') != -1) {
              return {
                type: true,
                msg: res
              }
            }
            return {
              type: false,
              msg: res
            }
          }
          return {
            type: false,
            msg: res
          }
        }
        return {
          type: false,
          msg: res
        }
      }
    }
    catch (err) {
      console.log(err);
      return {
        type: false,
        mas: '连接超时'
      }
    }
  }

  //获取当前游戏activity启动状态（判断是否启动）
  async adbBcondition(activity: string) {
    console.log(activity);
    let devices: any = electron.ipcRenderer.sendSync('SystemCall', "adb devices");
    console.log('连接设备' + devices);
    if (devices.indexOf('device') == devices.lastIndexOf('device') || devices.indexOf('192') == -1) {
      return {
        type: 'start',
        msg: '设备未连接或已中断',
        break: true
      }
    }
    if (devices.indexOf('offline') != -1) {
      electron.ipcRenderer.sendSync('SystemCall', "adb kill-server");
      return this.adbBcondition(activity)
    }
    if ((devices.split('device')).length - 1 > 2) {
      return {
        type: 'start',
        msg: '设备已完成无线连接,请拔出USB连接(如已拔出USB还出现该问题请重启METAPUNK应用)',
        more: true
      }
    }
    const data = await new Promise((resolve, rejects) => {
      electron.ipcRenderer.send('onSystem', 'adb shell ps | findstr com');
      electron.ipcRenderer.on('onSystemCall', async (event, adbInstruct) => {
        if (adbInstruct.indexOf(activity) != -1) {
          resolve({
            type: 'success',
            msg: '该游戏已启动'
          })
        } else {
          resolve({
            type: 'start',
            msg: '未启动游戏'
          })
        }
      });
    })
    return data
  }

  //启动应用
  async startApp(packageName: string) {
    try {
      let devices: any = electron.ipcRenderer.sendSync('SystemCall', "adb devices");
      if (devices.indexOf('device') == devices.lastIndexOf('device') || devices.indexOf('192') == -1) {
        // if (devices.indexOf('device') == devices.lastIndexOf('device')) {
        return {
          type: 'start',
          msg: '设备未连接或已中断',
          break: true
        }
      }
      if ((devices.split('device')).length - 1 > 2) {
        return {
          type: 'start',
          msg: '设备已完成无线连接,请拔出USB连接(如已拔出USB还出现该问题请重启METAPUNK应用)',
        }
      }
      //查看所有package
      let adbInstruct1 = await electron.ipcRenderer.sendSync('SystemCall', "adb shell pm list package");
      let pageageList = adbInstruct1.split('package:')
      let filterArr = []
      pageageList.forEach((item) => {
        if (item.indexOf('\r\n') != -1) {
          item = item.split('\r\n')[0]
        }
        item.indexOf('com') != -1 && filterArr.push(item)
      });
      console.log(filterArr);
      console.log('进入adb shell，获取activity信息');

      //是否安装应用包
      let exist = filterArr.some((item) => item == packageName)
      if (!exist) {
        return {
          type: 'null',
          msg: 'Quest设备未安装该游戏'
        }
      }

      let adbInstruct2 = electron.ipcRenderer.sendSync('SystemCall', `adb shell dumpsys package ${packageName}`);

      //两种类的可能
      let matchReg = /android.intent.action.MAIN:[^]*?\android.intent.category.LAUNCHER/gi;
      let matchReg2 = /android.intent.action.MAIN:[^]*?\android.intent.category.INFO/gi;
      let content = adbInstruct2.match(matchReg) || adbInstruct2.match(matchReg2)

      console.log('截取Activity：', content);
      //判断如果系统服务，不存在 category.LAUNCHER
      if (!content) {
        return {
          type: 'success',
          msg: '启动成功，系统服务'
        }
      }
      let slice_category_LAUNCHER = content[0]

      let appName_indexOf = slice_category_LAUNCHER.indexOf(packageName),
        filter_indexOf = slice_category_LAUNCHER.indexOf('filter')
      // console.log('appName_indexOf:', appName_indexOf);
      // console.log('filter_indexOf:', filter_indexOf);

      let app_activity = slice_category_LAUNCHER.slice(appName_indexOf, filter_indexOf)
      console.log('启动app-activity', app_activity);

      electron.ipcRenderer.sendSync('SystemCall', `adb shell am start -n ${app_activity}`);
      console.log(`启动 ${packageName}成功`, '正在启动scrcpy');
      let process = electron.ipcRenderer.sendSync('SystemCall', 'tasklist')
      if (process.indexOf('scrcpy.exe') == -1) {
        await electron.ipcRenderer.send('onScrcpy', '.exe');
        await electron.ipcRenderer.on('ScrcpyCall', (event, state) => {
          console.log('scrcpy start ok, callack:' + state);
        })
      }
      return {
        type: 'success',
        msg: '启动成功'
      }
    }
    catch (err) {
      console.log(err);
      return {
        type: 'start',
        msg: '启动失败，请重启设备尝试打开'
      }
    }

  }


  //结束游戏
  stopPackage(packageName) {
    let devices: any = electron.ipcRenderer.sendSync('SystemCall', "adb devices");
    if (devices.indexOf('device') == devices.lastIndexOf('device') || devices.indexOf('192') == -1) {
      return {
        type: 'success',
        msg: '关闭失败，设备未连接或已中断',
        break: true
      }
    }
    electron.ipcRenderer.sendSync('SystemCall', `adb shell am force-stop ${packageName}`);
    let process = electron.ipcRenderer.sendSync('SystemCall', 'tasklist')
    process.indexOf('scrcpy.exe') != -1 && electron.ipcRenderer.sendSync('SystemCall', 'taskkill /f /t /im scrcpy.exe')
    return {
      type: 'start',
      msg: '已关闭游戏'
    }
  }

  //安装游戏
  async adbInstall(apk) {
    console.log(apk);
    let devices: any = electron.ipcRenderer.sendSync('SystemCall', "adb devices");
    if (devices.indexOf('device') == devices.lastIndexOf('device') || devices.indexOf('192') == -1) {
      return {
        type: 'null',
        msg: '关闭失败，设备未连接或已中断',
        break: true
      }
    }

    //异步
    // let path = electron.ipcRenderer.sendSync('cmdDirCall', `for /r C:/ %i in (*${apk}) do @echo %i`)
    // if (path.indexOf('找不到文件') != -1) {
    //   console.log('文件不存在');
    //   return {
    //     type: 'null',
    //     msg: '安装失败，文件不存在'
    //   }
    // }
    // let okIndexOf = path.indexOf('ok:'),
    //   apkIndexOf = path.indexOf(apk)
    // let order = path.slice(okIndexOf + 3, apkIndexOf)
    // let fileAddress = order + apk
    // console.log('获取的文件路径：' + fileAddress)
    let path = "D:\metaPunk\\" + apk
    console.log(path);

    let adbInstruct = await electron.ipcRenderer.sendSync('cmdDirCall', `adb install ${path}`)
    if (adbInstruct.indexOf('Success') != -1) {
      return {
        type: 'start',
        msg: '安装成功'
      }
    }
    return {
      type: 'null',
      msg: '安装失败'
    }
  }


  //获取PC端是否存在apk文件
  async getApk(url, apk) {
    const data = await new Promise((resolve, rej) => {
      console.log(`url:${url} apk${apk}`);
      electron.ipcRenderer.send('apkPath', url, apk);
      electron.ipcRenderer.on('apkPathCall', async (event, isDown) => {
        resolve(isDown);
      });
    });
    return data;

    // console.log('获取文件位置结果：' + path);
    // if (path.indexOf('ok') != -1) {
    //   return true
    // }
    // return false
  }

  closeWin() {
    electron.ipcRenderer.sendSync('close-window')
  }

  /*********************
   * SteamVR Powershell命令行相关接口
   */

}
