import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
@Component({
    selector: 'app-vehicle-info',
    templateUrl: './vehicle-info.component.html',
    styleUrls: ['./vehicle-info.component.scss']
})
export class VehicleInfoComponent implements OnInit {
    status = "所有";
    thead = ["车辆编号", "车辆名称", "状态", "所属会员", "imei", "电压等级", "是否在线", "最后使用人", "GSM强度", "地理位置", "供应商", "创建时间", "修改时间", "操作"];
    vehiData: any;//车辆信息
    vehiDel: any;//车辆编辑提交
    vehiDels: any;//车辆详情
    vipList: any;//会员列表
    searchParam = { agent_uid: '', device_sn: '', device_name: '', status: '', device_imei: '' };//搜索参数
    vehicleDetail = {
        userNum: "079160055",
        userName: "Ambler",
        userPhone: 18391740049,
    };
    visible = false;//查看框显示隐藏
    visibles = false;//编辑表单显示隐藏
    detailshow = false;//详情显示隐藏
    constructor(
        private http: HttpClient,
        private router: Router
    ) { }
    ngOnInit() {
        this.getLoginInfo()
        this.getVipList()
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
    search() {
        console.log(this.searchParam);
        this.http.post("https://server.ncppx.com/api/pipixia/ppxmanage/searchDevice", this.searchParam).subscribe(res => {
            this.vehiData = res
            console.log(res);
        })
    }
    //查看是否在线
    onlined: any;
    ifOnlined = false;
    online_sn: any;
    watchTime: any;
    ifOnline(e) {
        console.log(e);
        this.online_sn = e
        this.watchTime = this.formateDate(new Date())
        this.http.post("https://server.ncppx.com/api/pipixia/vehicle/isOnline", { device_sn: e }).subscribe(res => {
            if (res['data']) {
                this.ifOnlined = true;
                this.onlined = '在线'
            } else {
                this.ifOnlined = true;
                this.onlined = '不在线'
            }
        })
    }

    //查看最后使用人
    lastUserinfo: any;
    lastUser(e) {
        this.visible = true;
        console.log(e);
        this.http.post("https://server.ncppx.com/api/pipixia/ppxmanage/lastUser", { vehicle_number: e }).subscribe(res => {
            console.log(res);
            this.lastUserinfo = res[0]
        })
    }
    closeonline() {
        this.ifOnlined = false;
    }
    //查看方法
    showinfo(e) {
        this.visible = true;
        console.log(e);
    }
    //关闭查看方法
    clickMe() {
        this.visible = false;
    }
    //编辑方法
    open(e) {
        console.log(e);
        this.http.post("https://server.ncppx.com/api/pipixia/vehicle/deviceDetail", { device_id: e }).subscribe(res => {
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
            device_sim: this.vehiDel.device_sim,
            agent_uid: this.vehiDel.agent_uid,
            device_sn: this.vehiDel.device_sn,
            power_type: this.vehiDel.power_type,
            device_name: this.vehiDel.device_name,
            vendor: this.vehiDel.vendor,
            vendor_phone: this.vehiDel.vendor_phone,
            status: Number(this.vehiDel.status),
            description: this.vehiDel.description,

        }
        console.log(">>>>", param);
        this.http.post("https://server.ncppx.com/api/pipixia/vehicle/updateDevice", param).subscribe(res => {
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

    //查看详情
    detailShow(e) {
        this.detailshow = true;
        console.log(e);
        this.http.post("https://server.ncppx.com/api/pipixia/vehicle/deviceDetail", { device_id: e }).subscribe(res => {
            console.log(res[0]);
            this.vehiDels = res[0]
        })
    }
    //关闭查看详情
    detailHide() {
        this.detailshow = false;
    }

    //获取车辆列表
    getVihecleList() {
        console.log(this.loginInfo)
        this.http.post('https://server.ncppx.com/api/pipixia/ppxmanage/device', { seller_id: this.loginInfo.id }).subscribe(res => {
            console.log(res);
            this.vehiData = res
        })
    }
    //获取会员列表
    getVipList() {
        this.http.get('https://server.ncppx.com/api/pipixia/vehicle/getVipList').subscribe(res => {
            console.log("qqq", res);
            this.vipList = res
        })
    }
    //前往车辆控制
    toControl(e) {
        console.log("<<<", e);
        this.router.navigateByUrl("pipixia-vehicle/control?id=" + e)
    }

    //删除车辆
    delete(e) {
        console.log(e);
        this.http.post('https://server.ncppx.com/api/pipixia/ppxmanage/delete', { device_id: e }).subscribe(res => {
            if (res['success']) {
                alert("废弃删除成功")
                this.getVihecleList()
            } else {
                alert("废弃删除失败")
            }
        })
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
