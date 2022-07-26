import { Component, OnInit } from '@angular/core';

// https://jscharting.com/tutorials/creating-js-charts/
// https://jscharting.com/examples/chart-types/organizational/
import * as JSC from "jscharting";
// JSC.defaults({ baseUrl: './assets/js/jscharting/' });
// export default JSC;

import * as Parse from "parse";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  chart:any
  profiles:any
  departs:any
  type = "area";
  countMap={};
  tipVisible = false;
  tipType = "";
  currentProfile = {};
  currentDepart:any;
  departCert:Array<any>;
  certMap:any = {};
  departBuild:any;
  enableProfileNodes = false; // 是否启动部门成员节点渲染

  // 部门展板数据属性 
  departVisible = false;
  positionIndex = {
    "项目":["项目经理","项目常务副经理","项目副经理","项目经理助理"],
    "技术":["项目总工程师","项目工程师","技术主管","技术员"],
    "质量":["质量工程师","质量主管","质量员"],
    "资料":["资料主管","资料员","资料辅助管理"],
    "安全":["项目安全总监","项目安全工程师","安全主管","安全员","安全辅助管理","安全顾问"],
    "施工":["现场专业工程师","施工主管","施工员","施工辅助管理","施工顾问"],
    "材料":["材料主管","材料员"],
    "预算":["项目经济师","预算主管","预算员"],
    "成本":["项目会计师","成本主管","成本员"],
    "综合":["项目综合办主任","综合管理员","综合辅助管理"],
    "其他":["驾驶员","机管员","电工","幕墙管理"],
  }
  positionMap = {}
  getPostionCate(){
    return Object.keys(this.positionIndex);
  }
  getUserByPos(pos){
    let users = []
    let keys = Object.keys(this.positionMap);

    if(pos=="机管员"){
      if(this.positionMap["设备管理主管"]){
        users = users.concat(this.positionMap["设备管理主管"]);
      }
      if(this.positionMap["设备管理员"]){
        users = users.concat(this.positionMap["设备管理员"]);
      }
      if(this.positionMap["机械辅助管理"]){
        users = users.concat(this.positionMap["机械辅助管理"]);
      }
      return users
    }

    if(pos=="幕墙管理"){
      if(this.positionMap["幕墙管理"]){
        users = users.concat(this.positionMap["幕墙管理"]);
      }
      if(this.positionMap["幕墙顾问"]){
        users = users.concat(this.positionMap["幕墙顾问"]);
      }
      return users
    }

    if(pos=="项目经理"){
      return this.positionMap["项目经理"];
    }

    keys.forEach(item=>{
      if(("temp"+item).indexOf(pos)>0){
        if(this.positionMap[item]){
          users = users.concat(this.positionMap[item]);
        }
      }
    })

    return users;
  }
  existPosition(user){
    if(!user){return undefined}
    if(user=="暂无"){return undefined}
    console.log(user)
    let users:Array<any> = []
    Object.values(this.positionMap).forEach(list=>{
      users = users.concat(list);
    });
    let exists = users.find(u=>u.get("name") == user.get("name"))
    return exists;
  }

  constructor() { 
  }

  async ngOnInit() {
    let queryP = new Parse.Query("Profile");
    queryP.notContainedIn("state",["离职"]); // ,"退聘"
    queryP.include("user");
    queryP.limit(1000);
    queryP.equalTo("company",{__type:"Pointer",className:"Company",objectId:localStorage.getItem("company")})
    let queryD = new Parse.Query("Department");
    queryD.include("leader");
    queryD.equalTo("company",{__type:"Pointer",className:"Company",objectId:localStorage.getItem("company")})
    this.profiles = await queryP.find();
    this.departs = await queryD.find();
    // this.loadDepartData("office");
    this.loadDepartData("景德镇","area");
    
  }

  departTopNodeMap:any = {}
  positionOrder = ["项目经理","项目常务副经理","项目副经理","项目经理助理","项目工程师","项目经济师","项目质量工程师","项目安全工程师","项目会计师","现场专业工程师","主管","员","辅助管理","驾驶员","电工"]
  modalCancel(){
    this.currentDepart = undefined;
    this.departCert = [];
    this.certMap = {};
    this.departBuild = undefined;
    this.departVisible = false;
  }
  loadDepartData(leaderId?,type="org",departid?){
    let data = [];

    this.departTopNodeMap = {}; // 清空节点链记录
    this.countMap = {}; // 清空人数记录

    // 预处理数据：职级排序
    this.profiles.sort((a,b)=>{ // 按职级排序
      if(!a.get("positionLev")){
        return 1
      }
      if(!b.get("positionLev")){
        return 1
      }
      if(a.get('positionLev')<b.get("positionLev")){
        return -1
      }else{
        return 1
      }
    })
    // 预处理数据：累加人数并统计项目经理
    let pmMap = {}
    this.countMap["江西"] = 0;
    this.departs.forEach(d=>{
      let ulist = this.profiles.filter(item=>item.get("department").id==d.id);
      if(d.get("leader")&&d.get("leader").id){// 标记项目经理
        if(!pmMap[d.get('leader').id]){
          pmMap[d.get('leader').id]= d.get('leader');
        }
      }
      this.countMap[d.id]=ulist.length // 保存部门人数
      if(d.get("name").indexOf("部")>0) { // 保存分公司人数
        if(this.countMap["office"]){
          this.countMap["office"] += ulist.length
        }else{
          this.countMap["office"] = ulist.length
        }
      }
      this.countMap["江西"]+=ulist.length // 保存部门人数
      if(!this.countMap[d.get("city")]){ // 累加区域人数
        this.countMap[d.get("city")]=ulist.length
      }else{
        this.countMap[d.get("city")]+=ulist.length
      }
      if(d.get("leader")){ // 累加项目经理人数
        if(!this.countMap[d.get("leader").id]){
          this.countMap[d.get("leader").id]=ulist.length
        }else{
          this.countMap[d.get("leader").id]+=ulist.length
        }
      }
    })

    // type == org 人事架构模式，加载项目经理为顶层
    // 所有项目经理，以及被任命的人员
    let pms:any = []
    if(type=="org"){
      pms = pms.concat(Object.values(pmMap));
      // pms = this.profiles.filter(item=>item.get("position")=="项目经理" || item.get("name")=="印正和" || item.get("name")=="何辉军" || item.get("name")=="鲍海亮");
      // pms = this.profiles.filter(item=>item.get("position")=="项目经理" || item.get("name")=="印正和" || item.get("name")=="何辉军" || item.get("name")=="鲍海亮");
      if(pms.length>0){
        pms = pms.map(item=>{
          let avatar = "./assets/img/icon/nophoto.png"
          
          let user = item.toJSON();
          user.id = item.id;
          user.className = item.className;
          if(user.user&&user.user.avatar){
            avatar = user.user.avatar
          }
          if(user.photo){
            avatar = user.photo
          }
          user.parent = "";
          user.photo = avatar;

          user.show = true;
          return user;
        });
      }
    }

    // type == area 地区发展模式，加载江西=>地市为顶层
    let areas = []
    if(type=="area"){
      ["江西","南昌","景德镇","宜春","吉安","抚州","上饶","赣州"].forEach((aname,index)=>{
        areas.push({id:aname,parent:index==0?"":"江西",className:"Area",name:aname,position:"区域",photo:"./assets/img/icon/build.png"})
      })
      areas.push({"id":"office","parent":"江西","name":"分公司",className:"Area","position":"区域","photo":"./assets/img/icon/office.png"})

    }


    let users:any = [];
    let departs:any = [];
    
    if(type=="org"){
      data.push(
        {"id":"office","parent":"","name":"分公司","position":"办公室","photo":"./assets/img/icon/office.png"}
      )
      data.push(
          {"id":"unknown","parent":"","name":"项目小组","position":"未分配"}
      )

      if(leaderId=="office" || leaderId=="分公司"){
        departs = this.departs.filter(item=>item.get("name").indexOf("部")>0);
      }else if(!leaderId){
        departs = [];
        users = [];
      } else if(leaderId=="all"){
        users = this.profiles;
        departs = this.departs;
      } else if(leaderId=="unknown"){
        departs = this.departs.filter(item=>!item.get("leader")&&!(item.get("name").indexOf("部")>0))
      } else if(leaderId){
        departs = this.departs.filter(item=>item.get("leader")&&item.get("leader").id&&item.get("leader").id == leaderId)
      }

      
    }else if (type=="area"){
      
      if(leaderId=="all"){
        departs = this.departs.filter(item=>item.get("city")&&item.get("city")!="");
      }else if(leaderId=="office"){
        departs = this.departs.filter(item=>item.get("name").indexOf("部")>0);
      } else{
        departs = this.departs.filter(item=>item.get("city")&&item.get("city")==leaderId);
      }

      // 分公司添加至江西区域
      console.log(leaderId)
      // if(leaderId=="分公司"){
      //   let office = this.departs.filter(item=>item.get("name").indexOf("部")>0);
      //   departs = departs.concat(office)
      // }
    }


    // 加载所有部门下面的成员列表 or 只加载被点击的部门成员
    if(!departid){ // 加载所有部门成员
      if(leaderId&&leaderId!="all"&&departs.length>0){
        departs.forEach((d,index)=>{
          if(index>4) {return} // 超过5个的，就不自动渲染成员节点
          this.departTopNodeMap[d.id] = d.id // 预设顶点为部门
          let ulist = this.profiles.filter(item=>item.get("department").id==d.id);
          if(this.enableProfileNodes){
            users = users.concat(ulist);
          }
        })
      }
    }else{ // 加载指定部门成员
      this.departTopNodeMap[departid] = departid // 预设顶点为部门
      let ulist = this.profiles.filter(item=>item.get("department").id==departid);
      if(this.enableProfileNodes){
        users = users.concat(ulist);
      }
    }


    // let departs:any = this.departs;
    departs = departs.map(item=>{
      let defaultAvatar = "./assets/img/icon/build.png";
      if(item.className=="Department"){
        if(item.get("name").indexOf("部")>0){
          defaultAvatar = "./assets/img/icon/office.png";
        }
      }

      let depart = item.toJSON();
      depart.id = item.id;
      // depart.city = item.city;
      depart.className = item.className;
      depart.photo = depart.depart&&depart.depart.avatar&&depart.depart.avatar!=""?depart.depart.avatar:defaultAvatar;
      depart.parent = depart.leader&&depart.leader.objectId || "";
 
      depart.show = true;

      if(item.className=="Department"){
        if(type=="org"){
          if(item.get("name").indexOf("部")>0){
            depart.parent = "office";
            console.log(depart)
          }else if(!(item.get("leader")&&item.get("leader"))){
            depart.parent = "unknown";
            depart.show = false;
          }
        }else if(type=="area"){
          if(item.get("name").indexOf("部")>0){
            depart.parent = "office";
            console.log(depart)
          }else{
            depart.parent = item.get("city") || "";
          }
        }
      }
      return depart
    })
    console.log(departs)

    // 加载可视部门的用户节点
    
    if(users.length>0){
      users = users.map(item=>{
        let user = item.toJSON();
        user.id = `U${item.id}`;
        user.className = item.className;

        let photo = "./assets/img/icon/nophoto.png";
        if(user.user&&user.user.avatar&&user.user.avatar!=""){
          photo = user.user.avatar
        }
        if(user&&user.photo&&user.photo!=""){
          photo = user.photo
        }
        user.photo = photo;
        
        let departid = item.get("department").id
        let topNodeId = this.departTopNodeMap[departid]
        if(topNodeId){
          user.parent = topNodeId;
          this.departTopNodeMap[departid] = user.id;
          user.show = true;
          return user;
        }else{
          console.log("no parent");
          // user.parent = departid;
          // this.departTopNodeMap[departid] = departid;
        }
 
        
      });
    }
 


    // let data = JSC.csv2Json(text); 
    console.log(data);
    data = data.concat(areas); // 顶部区域节点
    data = data.concat(pms); // 顶部项目经理节点
    data = data.concat(departs); // 部门节点
    data = data.concat(users); // 部门下员工节点

    this.chart = this.renderChart(this.makeSeries(data)); 

}

  renderChart(series) { 
    let orientChart = (dir)=>{
      this.chart.options({'type':'organization '+dir});
    }

    return JSC.chart('chartDiv', { // chartConfig
      type: 'organization down', 
      toolbar_items_resetZoom_position: "inside top left",
      toolbar_items_resetZoom_visible: false,
      toolbar_items_zoom_visible : false,
      // axisToZoom : "none",
      defaultSeries: { 
        line: { width: 2, color: '#e0e0e0' } 
      }, 
      // defaultTooltip: { 
      //   outline: 'none', 
      //   zIndex: 100
      // }, 
      defaultPoint: { 
        focusGlow_width: 0, 
        // tooltip: 
          // '<span style="color:blue;z-index:65535;">总产值: <b>17.5亿</b><br>人均产值: <b>1050万</b><br>挂证人员: <b>暂未录入</b></span>', 
          // '<div style="dispaly:%tipshow;">工号: <b>%workid</b><br>工龄: <b>%workingAge</b><br>联系方式: <b>%mobile</b></div>', 
        annotation: { 
          asHTML: true,
          margin: 5, 
          label: { 
            style_fontSize: 10, 
            text: 
              ` %labeldefault 
                %labelright
                %units
                %labeluser
              `
              , 
            maxWidth: 120, 
            style_fontWeight: 'normal', 
            align: 'center'
          } 
        }, 
        outline_width: 0, 
        color: 'white'
      }, 
      series: series 
    }); 
  } 
    
  deleteChildren(el){
    let currentId = el.id
    // 先删除所有子节点
    this.chart.series(0).points().each(p=>{
      console.log(p)
      if(p&&p.userOptions&&p.userOptions.parent){
        if(currentId==p.userOptions.parent){
          p.remove();
        }
      }
    })
    // 再删除当前节点
    setTimeout(() => {
      el.remove();
    }, 1500);
  }
  makeSeries(data) { 
    let that = this;
    var barColors = [ 
      { value: 3, color: '#ffca28' }, 
      { value: 4, color: '#d4e157' }, 
      { value: 5, color: '#66bb6a' } 
    ]; 
    
    function getColor(val) { 
      if(!val){
        val = 4;
      }
      for (var i = 0; i < barColors.length; i++) { 
        if (val == barColors[i].value) 
          return barColors[i].color; 
      } 
    } 
    
    return [ 
      { 
        points: JSC.nest() 
          .key('id') 
          .pointRollup(function(key, val) {
            let result:any = { 
              name: val[0].name, 
              id: val[0].id, 
              parent: val[0].parent, 
              show: val[0].show,
              city: val[0].city,
              className:val[0].className || "",
              events: {
                mouseOver: function(ev) {
                  // 显示人事提示
                  if(val[0].className=="Profile"){
                    that.overProfile(ev,val[0]);
                  }
                  // 显示部门提示
                  if(val[0].className=="Department"){
                    // that.currentDepart = val[0];
                    that.tipType == "Department";
                    // that.tipVisible = true;
                  }
                  document.getElementById("tipsDiv").style.top = ev.clientY + "px";
                  document.getElementById("tipsDiv").style.left = ev.clientX+10 + "px";

                },
                mouseOut: function(ev) {
                  that.tipVisible = false;
                  that.currentProfile = {}
                  that.currentDepart = undefined
                },
                click: async function(e) {
                  // this.userOptions.className == "Department" ||
                  if( this.userOptions.parent == "" && this.userOptions.className!="Area"){
                    that.loadDepartData(this.id);
                    return
                  }
                  if( this.userOptions.parent != "" && this.userOptions.className=="Area"){
                    that.loadDepartData(this.id,"area");
                    return
                  }
                  if( this.userOptions.parent != "" && this.userOptions.className=="Department"){
                    if(this.userOptions.name.indexOf("部")>0) { // 保存分公司人数
                      alert("分公司部门详情制作中...")
                      return
                    }
                    // that.loadDepartData(this.userOptions.city,"area",this.id);
                    that.positionMap = {}
                    let ulist = that.profiles.filter(item=>item.get("department").id==val[0].id);
                    ulist.forEach(u=>{
                      if(!that.positionMap[u.get("position")]){
                        that.positionMap[u.get("position")] = [u]
                      }else{
                        that.positionMap[u.get("position")].push(u)
                      }
                    })
                    // console.log(that.positionMap)
                    let queryC = new Parse.Query("DepartCert");
                    queryC.equalTo("departName",val[0].name)
                    let queryB = new Parse.Query("DepartBuild");
                    queryB.equalTo("departName",val[0].name)
                    that.departBuild = await queryB.first();
                    that.departCert = await queryC.find();
                    that.departCert.forEach(cert=>{
                      cert.set("user",that.profiles.find(user=>user.get("name")==cert.get("name")))
                      that.certMap[cert.get("certName")]=cert
                    });
                    that.currentDepart = val[0];
                    that.departVisible = true;
                  }
                  if( this.userOptions.parent != "" && this.userOptions.className == "Profile"){
                    console.log(this.id)
                  }
                  this.zoomTo();
                  // this.deleteChildren(this); // 点击后删除所有子节点
                }
              },
              states_hover: {
                cursor: "poiner"
              },
              attributes: { 
                count: that.countMap[val[0].id] || 0,
                position: val[0].position || "", 
                mobile: val[0].mobile || "", 
                workid: val[0].workid || "", 
                workingAge: val[0].workingAge || "", 
                tags: val[0].tags || [], 
                photo: val[0].photo || "./assets/img/icon/nophoto.png"
              } 
            }; 

            result.attributes.labeldefault = `
            <span style="font-size:11px;"><span style="align:center;"><span style="font-size:12px;"><b>${result.name}</b></span><br/>  
                <img style="border-radius:0%;" width=50 height=50 align=center margin_bottom=4 margin_top=4 src=${result.attributes.photo}><br/>  
                ${result.attributes.position}<br/></span>  
            </span>
            `
            result.attributes.labelright = ``;

            result.attributes.units = "";

            
            if(result.className != "Profile" || result.parent==""){
              result.attributes.labelright = `
              <span style="border-left:5px solid #f48fb1;padding-left:10px;">${result.attributes.count}人</span>
            `
            }
            if(result.className == "Department"){
              // result.color = '#f48fb1' // pink
              result.color = '#64b5f6';

              result.attributes.units = `
              <style>
                  .snip0056 {  height:100px;border: 1px solid ${result.color} ;font-family: 'Raleway', Arial, sans-serif;  position: relative;  overflow: hidden;  margin: 10px auto;  min-width: 180px;  max-width: 280px;  width: 100%;  background: #ffffff;  color: #000000;}
                  .snip0056 .position {  width: 100%;  text-align: left;  padding: 5px 20px;  font-size: 0.9em;  opacity: 1; color: #ffffff;  background: #000000;  clear: both;}
                  .snip0056.yellow .position {  background: ${result.color};}
                  .snip0056:hover >img,.snip0056.hover >img {  right: -12%;}
                  .snip0056 >img {  width: 70px; height:70px; border-radius: 50%;  border: 4px solid #ffffff; position: relative;  float: right;  right: 0%;}
                  .snip0056 .fname {  margin-top:-20px;padding: 20px 10px 20px 20px;  position: absolute;  left: 0;  width: 50%;}
                  .snip0056 .fname h2,.snip0056 .fname p {  margin: 0;  text-align: left;  padding: 10px 0;  width: 100%;}
                  .snip0056 .fname h2 {  font-size: 1.3em;  font-weight: 300;  text-transform: uppercase;  border-bottom: 1px solid rgba(0, 0, 0, 0.2);}
                  .snip0056 .position {  width: 100%;  text-align: left;  padding: 5px 20px;  font-size: 0.9em;  opacity: 1; color: #ffffff; clear: both;}
              </style>`;

              result.attributes.tags.forEach(t=>{
                let color = "#64b5f6"
                if(t!="房建"){
                  color = '#f48fb1' // pink
                }
                result.attributes.units +=
                `<div class="units" style="border-top:5px solid ${color};">
                ${t}
                </div>`;
              })
              
              // result.annotation_label_text = '<div class="units"><b>%position</b>%name%units</div>'
            }

            result.attributes.labeluser = "";
            if(result.parent != '' && result.className == 'Profile'){
              result.attributes.labeldefault = ''
              result.attributes.labeluser = `
              <div id="${result.id}" class="snip0056 yellow">
                <div class="fname">
                    <h2><span>${result.name}</span></h2>
                    <p>工号：${result.attributes.workid}</p>
                </div class="fname"><img src="${result.attributes.photo}" alt="sample9">
                <div class="position">${result.attributes.position}</div>
            </div>
              `
            }

            if (result.parent == '') { 
              result.annotation_label_text = 
                '<span style="align:center;font-size:13px;"><img width=70 height=70 align=center margin_bottom=4 src=%photo><br/><span style="font-size:14px;"><b>%name</b></span><br/>%position<br/></span>'+
                '%labelright'; 
            }
            result.attributes.tipshow = "block";

            if(result.className == "Department"){
              result.attributes.tipshow = "none";
            }
            
            return result; 
          }) 
          .points(data),
      } 
    ]; 
  }
  getDateFromToString(fromto){
    let str = '暂无'
    if(fromto&&fromto.from && fromto.to){
      let from = fromto.from;
      let to = fromto.to;
      str = `${String(from.getFullYear()).slice(2,4)}-${from.getMonth()}-${from.getDate()}至${String(to.getFullYear()).slice(2,4)}-${to.getMonth()}-${to.getDate()}`
    }
    return str
  }

  overProfile(ev,profile){
    if(!profile){
      return
    }
    if(!profile.objectId){
      profile = profile.toJSON();
    }
    this.currentProfile = profile;
    let query = new Parse.Query("DepartHistory")
    query.equalTo("profile",{__type:"Pointer",className:"Profile",objectId:profile.objectId})
    query.find().then(history=>{
      this.currentProfile["history"] = history;
    })
    let queryC = new Parse.Query("UserCertify")
    queryC.limit(5);
    queryC.notEqualTo("type","education");
    queryC.equalTo("profile",{"__type":"Pointer","className":"Profile","objectId":profile.objectId});
    queryC.find().then(certify=>{
      this.currentProfile["certify"] = certify;

    })
    this.tipType == "Profile";
    this.tipVisible = true;

    document.getElementById("tipsDiv").style.top = ev.clientY + "px";
    document.getElementById("tipsDiv").style.left = ev.clientX+10 + "px";
  }
  leaveProfile(ev){
    this.tipVisible = false;
    this.currentProfile = {};
  }
  zoom(type){
    switch (type) {
      case "all":
        this.loadDepartData("all")
        document.getElementById("chartDiv").style.zoom = "0.2";
        break;
      case "office":
        this.loadDepartData("office")
        document.getElementById("chartDiv").style.zoom = "1.0";
        break;
      case "top":
        this.loadDepartData()
        document.getElementById("chartDiv").style.zoom = "1.0";
        break;
      case 0.1:
        document.getElementById("chartDiv").style.zoom = "1.2";
      case -0.1:
        document.getElementById("chartDiv").style.zoom = "0.6";
      default:
        break;
    }
  }
  editProfile(profile){
    console.log(profile);
  }
  getAge(idcard){
    if(!idcard) return 0;
    let date = new Date(idcard.slice(6,10)+"-"+idcard.slice(10,12)+"-"+idcard.slice(12,14))
    return new Date().getFullYear() - date.getFullYear();
  }

}
