import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
@Component({
  selector: 'app-vehicle-monitor',
  templateUrl: './vehicle-monitor.component.html',
  styleUrls: ['./vehicle-monitor.component.scss']
})
export class VehicleMonitorComponent implements OnInit {
  status = "所有";
  thead = ["车辆编号", "电量报警", "电池类型", "等待换电池", "是否设防", "状态", "是否移动", "数据上传时间", "跟换电池时间", "操作"];
  vehiData: any;//设备列表
  vehiDel: any;//设备详情
  dateFormat = 'yyyy/MM/dd';
  visibles = false;
  vehiclenum: any;
  vehiclename: any;
  business: any;
  searchPre={device_sn:'',device_imei:'',power_type:'',defense:'',move:'',low_power:''}
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}
  ngOnInit() {
    this.getLoginInfo()
  }
  //获取登录者信息
  loginInfo: any
  loginType: any
  getLoginInfo() {
    let loginPhone = JSON.parse(localStorage.getItem("Parse/pipixia/currentUser")).mobile
    this.loginType = JSON.parse(localStorage.getItem("Parse/pipixia/currentUser")).type
    console.log("登录者电话", loginPhone);
    console.log("登录者类型", this.loginType);
    this.http.post('https://server.ncppx.com/api/pipixia/ppxmanage/loginInfo', { mobile: loginPhone }).subscribe(res => {
      this.loginInfo = res[0]
      console.log("登录者信息", this.loginInfo);
      this.getVihecleList()

    })
  }
  //搜索
  search(){
    let pre = {
      seller_id:this.loginInfo.id,
      device_sn:this.searchPre.device_sn,
      device_imei:this.searchPre.device_imei,
      power_type:this.searchPre.power_type,
      defense:this.searchPre.defense,
      move:this.searchPre.move,
      low_power:this.searchPre.low_power
    }
    this.http.post('https://server.ncppx.com/api/pipixia/ppxmanage/device', pre).subscribe(res => {
      console.log(pre);
      this.vehiData = res
    })

  }
  //打开编辑页
  open(e) {
    console.log(e);
    this.http.post("https://server.ncppx.com/api/pipixia/vehicle/deviceDetails", { device_sn: e }).subscribe(res => {
      console.log(res[0]);
      this.vehiDel = res[0]
      if (this.vehiDel) {
        this.visibles = true;
      }
    })
  }
  // 提交方法
  submit() {
    let param = {
      device_id: this.vehiDel.device_id,
      vendor: this.vehiDel.power_type,
    }
    this.http.post("https://server.ncppx.com/api/pipixia/vehicle/updatePower", param).subscribe(res => {
      console.log(res['data']);
      if (res['data'] == "success") {
        this.visibles = false;
        this.getVihecleList()
      } else {
        alert("更新失败")
      }
    })
  }
  //关闭编辑方法
  close() {
    this.visibles = false;
  }
  //获取车辆列表
  getVihecleList() {
    this.http.post('https://server.ncppx.com/api/pipixia/ppxmanage/device', { seller_id: this.loginInfo.id }).subscribe(res => {
      console.log(res);
      this.vehiData = res
    })
  }
  //前往车辆控制
  toControl(e) {
    this.router.navigateByUrl("pipixia-vehicle/control?id=" + e)
  }
  formateDate(datetime) {
    function addDateZero(num) {
      return (num < 10 ? "0" + num : num);
    }
    let d = new Date(datetime);
    let formatdatetime = d.getFullYear() + '-' + addDateZero(d.getMonth() + 1) + '-' + addDateZero(d.getDate()) + ' ' + addDateZero(d.getHours()) + ':' + addDateZero(d.getMinutes()) + ':' + addDateZero(d.getSeconds());
    return formatdatetime;
  }

}
