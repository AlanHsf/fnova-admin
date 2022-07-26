import * as Parse from "parse";
import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../app/app.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  allCount: any = {
    classCount: 0,
    studentCount: 0,
    certCount: 0
  }
  time = []
  money = []
  constructor(
    public appServ: AppService,
  ) {
    this.getCount()
    this.getClassData()
  }
  ngOnInit() {
  }

  getCount() {
    (() => {
      let query = new Parse.Query("Xiaofang_class")
      query.count().then(data => {
        this.allCount.classCount = data
      })
    })();
    (() => {
      let query = new Parse.Query("Xiaofang_student")
      query.count().then(data => {
        this.allCount.studentCount = data
      })
    })();
    (() => {
      let query = new Parse.Query("Xiaofang_student")
      query.notEqualTo("certNum","")
      query.count().then(data => {
        this.allCount.certCount = data
      })
    })()
}

// 加载班级看板
getClassData(){
  let query = new Parse.Query("Xiaofang_class")
  query.descending("signFromTo.from")
  query.include("course")
  let company = this.appServ.company
  query.equalTo("company",{"__type":"Pointer","className":"Company","objectId": company})
  console.log({"__type":"Pointer","className":"Company","objectId": company})
  query.find().then(data=>{
    console.log(data)
    this.panels = []
    data.forEach(item=>{
      let newitem:any = item
      newitem.active = false
      newitem.disabled = false
      newitem.name = `${item.get("course").get("title")} - 编号：${item.get("classNum")}`
      this.panels.push(newitem)
    })
  })
}

loadClassDetail(obj){
  let query = new Parse.Query("Xiaofang_student")
  query.equalTo("class",obj.toPointer())
  query.ascending("stuNum")

  let company = this.appServ.company
  query.equalTo("company",{"__type":"Pointer","className":"Company","objectId": company})

  query.find().then(data=>{
    obj.students = data
  })
}

printClassData(obj){
  let printFixStyle = `
  html, body{
    margin:10px !important;
  }
  @page {
  size: A4 protrait;
  }
  table {
      width:100%;
      height:100%;
      text-align: center;   
      border-right: none!important; 
  }
  
  table,th,td /* 表格边框样式 */
  {
    border:0.5px solid black;
    height:33px;
  }
  .firstRow{
      text-align: center;
      font-size:28px;
      font-weight: bold;
  }
  `;

  let stuRow = ``
  obj.students.sort((a,b)=>{
    let anum = a.get("stuNum") , bnum = b.get("stuNum")

    if(anum.substr(anum.length-3,3) < bnum.substr(bnum.length-3,3)){
      return -1
    }else{
      return 1
    }
  })
  obj.students.forEach(student=>{

    let signDate = student.get("signDate")?student.get("signDate"):obj.get("signFromTo").from;
    let invoice = student.get("invoice")?student.get("invoice"):"none"
    let invoiceMap = {
      none:"未开票",
      plain:"普票",
      special:"专票"
    }
    stuRow += `
    <tr style="height:25.00pt;">
      <td>${student.get("stuNum").substr(student.get("stuNum").length-2,3)}</td>
      <td>${signDate.getMonth()+1}.${signDate.getDate()}</td>
      <td>${student.get("name")?student.get("name"):""}</td>
      <td>${student.get("gender")?student.get("gender"):""}</td>
      <td>${student.get("education")?student.get("education"):""}</td>
      <td>${student.get("work")?student.get("work"):""}</td>
      <td>${student.get("idcard")?student.get("idcard"):""}</td>
      <td>${student.get("mobile")?student.get("mobile"):""}</td>
      <td>${invoiceMap[invoice]}</td>
      <td>${student.get("payee")?student.get("payee"):""}</td>
    </tr>
    `
  })
  
  let printHTML = `
  <table cellpadding="0" cellspacing="0">
                  <colgroup>
                      <col style="width:27.50pt;">
                      <col style="width:41.25pt;">
                      <col style="width:44.00pt;">
                      <col style="width:32.30pt;">
                      <col style="width:44.70pt;">
                      <col>
                      <col style="width:118.25pt;">
                      <col style="width:49.50pt;">
                      <col style="width:44.70pt;">  
                      <col style="width:144.70pt;">
                  </colgroup>
                  <tbody>
                      <tr height="80" style="height:40.00pt;" class="firstRow">
                          <td colspan="10" class="et3" height="40">
                          ${obj.get("course").get("title")} - 编号：${obj.get("classNum")}
                          </td>
                      </tr>

                      <tr style="height:40.00pt;">
                          <td height="40">                              序号                          </td>
                          <td>                              日期                          </td>
                          <td>                              姓名                          </td>
                          <td>                              性别                          </td>
                          <td>                              文化<br>程度                          </td>
                          <td>                              单位                          </td>
                          <td>                              身份证号码                          </td>
                          <td>                              联系电话                          </td>
                          <td>                              开票<br>记录                          </td>
                          <td>                              收款人                          </td>
                      </tr>
                  ${stuRow}
                  </tbody>
              </table>
  `;

  let printModal: any = window.open("",'newwindow',
    'toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no');
    printModal.document.body.innerHTML = `<style>${printFixStyle}</style>`+printHTML;
    printModal.print();
}
panels = [
  {
    active: false,
    name: '消防设施操作员（初级） 加载中...',
    disabled: false
  },
  {
    active: false,
    disabled: false,
    name: '消防设施操作员（中级） 加载中...',

  },
];

}
