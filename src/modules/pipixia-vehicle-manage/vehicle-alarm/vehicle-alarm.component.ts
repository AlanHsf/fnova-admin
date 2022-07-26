import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
@Component({
  selector: 'app-vehicle-alarm',
  templateUrl: './vehicle-alarm.component.html',
  styleUrls: ['./vehicle-alarm.component.scss']
})
export class VehicleAlarmComponent implements OnInit {
  status = "所有";
  thead = ["车辆编号", "状态", "报警类型", "低电量", "sos", "故障", "所属会员", "处理人", "创建时间", "修改时间", "操作"];
  vehiData: any;//设备列表
  vehiDel: any;
  visibles = false;
  vehiclenum: any;
  business: any;
  serchPre={device_sn:'',handle:''}
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

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
      //  >>>>
      this.getVihecleList()

    })
  }
  //打开处理
  open(e) {
    this.http.post("https://server.ncppx.com/api/pipixia/vehicle/deviceDetails", { device_sn: e }).subscribe(res => {
      console.log(res);
      if (res) {
        this.vehiDel = res[0]
        console.log(this.vehiDel);
        this.visibles = true;
      }
    })
  }
  // 提交方法
  submit() {
    console.log(this.vehiData);
  }
  //关闭编辑方法
  close() {
    this.visibles = false;
  }
  //搜索
  search(){
    console.log(this.serchPre);
    let pre = {
      seller_id:this.loginInfo.id,
      device_sn:this.serchPre.device_sn,
      handle:this.serchPre.handle
    }
    this.http.post('https://server.ncppx.com/api/pipixia/ppxmanage/device', pre).subscribe(res => {
      console.log(res);
      this.vehiData = res
    })
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
    console.log("<<<", e);
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
