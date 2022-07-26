import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-fence',
  templateUrl: './vehicle-fence.component.html',
  styleUrls: ['./vehicle-fence.component.scss']
})
export class VehicleFenceComponent implements OnInit {
 
  searchParam = { name: '', address: '', fence_status: '', longitude: '', latitude: '' };
  thead = ["名称", "经度", "纬度", "半径", "状态", "创建时间", "修改时间", "操作",];
  loginType = ""
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loginType = JSON.parse(localStorage.getItem("Parse/pipixia/currentUser")).type

   }

  ngOnInit() {
    this.getFence()
  }
  //获取电子围栏信息
  vehiData: any;
  getFence() {
    this.http.get("https://server.ncppx.com/api/pipixia/ppxmanage/getfence").subscribe(res => {
      console.log(res);
      this.vehiData = res
    })
  }
  //搜索
  search() {
    console.log("搜索参数", this.searchParam);
    this.http.post("https://server.ncppx.com/api/pipixia/ppxmanage/searchFence", this.searchParam).subscribe(res => {
      console.log(res);
      this.vehiData = res
    })
  }
  //重置
  refrash() {
    this.searchParam.address = ''
    this.searchParam.name = ''
    this.searchParam.fence_status = ''
    this.searchParam.longitude = ''
    this.searchParam.latitude = ''
  }


  //新增电子围栏
  addFence() {
    this.router.navigateByUrl("pipixia-position/edit")
  }


  //查看详情
  detailshow = false;
  vehiDels: any;
  open(e) {
    console.log(e);
    this.http.post("https://server.ncppx.com/api/pipixia/ppxmanage/getfencedel", { id: e }).subscribe(res => {
      console.log(res);
      this.vehiDels = res[0];
      this.detailshow = true;
    })
  }
  //关闭详情窗口
  detailHide() {
    this.detailshow = false;
  }

  //跟新围栏
  upFence(e) {
    this.router.navigateByUrl("pipixia-position/updata?id="+e)
    // console.log(e);
    // this.http.post("https://server.ncppx.com/api/pipixia/ppxmanage/getfencedel", { id: e }).subscribe(res => {
    //   console.log(res);
    //   this.vehiDeles = res[0];
    //   this.upvisible = true;
    //   this.getFence()
    // })
  }

  // //提交更新
  // updateDate() {
  //   console.log(this.vehiDeles);
  //   this.http.post("https://server.ncppx.com/api/pipixia/ppxmanage/upFence", this.vehiDeles).subscribe(res => {
  //     console.log(res);
  //     if (res['success']) {
  //       alert('更新成功')
  //       this.upvisible = false;
  //     }
  //   })
  // }

  //删除电子围栏
  delete(e) {
    console.log(e);
    this.http.post("https://server.ncppx.com/api/pipixia/ppxmanage/delFence", { id: e }).subscribe(res => {
      console.log(res);
      if (res['success']) {
        alert('删除成功')
      }
    })
  }

  //时间格式转换
  formateDate(datetime) {
    function addDateZero(num) {
      return (num < 10 ? "0" + num : num);
    }
    let d = new Date(datetime);
    let formatdatetime = d.getFullYear() + '-' + addDateZero(d.getMonth() + 1) + '-' + addDateZero(d.getDate()) + ' ' + addDateZero(d.getHours()) + ':' + addDateZero(d.getMinutes()) + ':' + addDateZero(d.getSeconds());
    return formatdatetime;
  }
}
