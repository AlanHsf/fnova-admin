import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
@Component({
  selector: "app-vehicle-control",
  templateUrl: "./vehicle-control.component.html",
  styleUrls: ["./vehicle-control.component.scss"],
})
export class VehicleControlComponent implements OnInit {
  constructor(private http: HttpClient) {}
  ngOnInit() {
    this.getParam();
    this.ifOnline();
    this.lastUser();
  }

  device_sn: any; //页面参数
  vehiDels: any; //车辆信息
  controlInfo: any; //操作返回信息
  //获取页面参数
  getParam() {
    var Param = window.location.search.split("=");
    this.device_sn = Param[1];
    console.log(">>>", this.device_sn);
    this.getVihecleInfo();
    this.getCtrlList();
  }
  //获取车辆信息
  getVihecleInfo() {
    if (this.device_sn) {
      this.http
        .post("https://server.ncppx.com/api/pipixia/vehicle/deviceDetails", {
          device_sn: this.device_sn,
        })
        .subscribe((res) => {
          this.vehiDels = res[0];
        });
    }
  }
  //获取操作历史
  list = [];
  table: any = {
    currentPage: 1,
    pageSize: 10,
    loading: false,
    count: 0,
  };
  getCtrlList() {
    if (this.device_sn) {
      console.log(this.table.currentPage);

      this.table.loading = true;
      this.http
        .post("https://server.ncppx.com/api/pipixia/ppxmanage/ctrlList", {
          device_sn: this.device_sn,
          offset: this.table.currentPage,
        })
        .subscribe((res) => {
          this.table.count = res["result"][0][0]["count"];
          this.list = res["result"][1];
          this.table.loading = false;
          console.log(">>>>>", this.list);
        });
    }
  }
  content(e) {
    alert(e);
  }

  //查看是否在线
  onlined: any;
  ifOnline() {
    this.http
      .post("https://server.ncppx.com/api/pipixia/vehicle/isOnline", {
        device_sn: this.device_sn,
      })
      .subscribe((res) => {
        console.log("在线情况", res);

        if (res["data"]["status"] == 400) {
          this.onlined = "不在线";
        } else {
          this.onlined = "在线";
        }
      });
  }
  //查看最后使用人
  lastUserinfo: any;
  lastUser() {
    this.http
      .post("https://server.ncppx.com/api/pipixia/ppxmanage/lastUser", {
        vehicle_number: this.device_sn,
      })
      .subscribe((res) => {
        this.lastUserinfo = res[0];
        console.log("<<<", this.lastUserinfo);
      });
  }
  //车辆启动
  startOn() {
    this.http
      .post("https://server.ncppx.com/api/pipixia/vehicle/deviceStartON", {
        type: this.vehiDels.type,
        imei: this.vehiDels.device_imei,
      })
      .subscribe((res) => {
        console.log(res);
        this.controlInfo = res["msg"];
        alert(this.controlInfo);
      });
  }
  //车辆撤防
  disarm() {
    this.http
      .post("https://server.ncppx.com/api/pipixia/vehicle/deviceDisarm", {
        type: this.vehiDels.type,
        imei: this.vehiDels.device_imei,
      })
      .subscribe((res) => {
        console.log(res);
        this.controlInfo = res["msg"];
        alert(this.controlInfo);
      });
  }
  //车辆点火
  starACC() {
    this.http
      .post("https://server.ncppx.com/api/pipixia/vehicle/deviceStarACC", {
        type: this.vehiDels.type,
        imei: this.vehiDels.device_imei,
      })
      .subscribe((res) => {
        console.log(res);
        this.controlInfo = res["msg"];
        alert(this.controlInfo);
      });
  }
  //车辆熄火
  starACCoff() {
    this.http
      .post("https://server.ncppx.com/api/pipixia/vehicle/deviceStarACCoff", {
        type: this.vehiDels.type,
        imei: this.vehiDels.device_imei,
      })
      .subscribe((res) => {
        console.log(res);
        this.controlInfo = res["msg"];
        alert(this.controlInfo);
      });
  }
  //强制锁车
  keyLock() {
    this.http
      .post("https://server.ncppx.com/api/pipixia/vehicle/deviceKEYLOCK", {
        type: this.vehiDels.type,
        imei: this.vehiDels.device_imei,
      })
      .subscribe((res) => {
        console.log(res);
        this.controlInfo = res["msg"];
        alert(this.controlInfo);
      });
  }
  //车辆设防
  Fortification() {
    this.http
      .post(
        "https://server.ncppx.com/api/pipixia/vehicle/deviceFortification",
        { type: this.vehiDels.type, imei: this.vehiDels.device_imei }
      )
      .subscribe((res) => {
        console.log(res);
        this.controlInfo = res["msg"];
        alert(this.controlInfo);
      });
  }
  //车辆状态
  getStatus() {
    this.http
      .post("https://server.ncppx.com/api/pipixia/vehicle/deviceStatus", {
        type: this.vehiDels.type,
        imei: this.vehiDels.device_imei,
      })
      .subscribe((res) => {
        console.log(res);
        this.controlInfo = res["data"];
        alert(this.controlInfo);
      });
  }
  //车辆位置
  getLocation() {
    this.http
      .post("https://server.ncppx.com/api/pipixia/vehicle/deviceWHERE", {
        type: this.vehiDels.type,
        imei: this.vehiDels.device_imei,
      })
      .subscribe((res) => {
        console.log(res);
        this.controlInfo = res["data"];
        alert(this.controlInfo);
      });
  }
  //车辆自检
  checkSelf() {
    this.http
      .post("https://server.ncppx.com/api/pipixia/vehicle/deviceCHECK", {
        type: this.vehiDels.type,
        imei: this.vehiDels.device_imei,
      })
      .subscribe((res) => {
        console.log(res);
        this.controlInfo = res["data"];
        alert(this.controlInfo);
      });
  }
  //车辆寻车
  Findvehicle() {
    console.log(this.vehiDels);
    this.http
      .post("https://server.ncppx.com/api/pipixia/vehicle/deviceFIND", {
        type: this.vehiDels.type,
        imei: this.vehiDels.device_imei,
      })
      .subscribe((res) => {
        console.log(res);
        this.controlInfo = res["msg"];
        alert(this.controlInfo);
      });
  }
  //车辆开启上传电量
  PowerUp() {
    this.http
      .post("https://server.ncppx.com/api/pipixia/vehicle/powerUp", {
        type: this.vehiDels.type,
        imei: this.vehiDels.device_imei,
      })
      .subscribe((res) => {
        console.log(res);
        this.controlInfo = res["msg"];
        alert(this.controlInfo);
      });
  }
}
