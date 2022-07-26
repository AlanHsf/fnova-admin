import { Component, OnInit } from '@angular/core';
import * as Parse from "parse";
import {HttpClient} from "@angular/common/http"
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-send-msg',
  templateUrl: './send-msg.component.html',
  styleUrls: ['./send-msg.component.scss']
})
export class SendMsgComponent implements OnInit {


  pageIndex = 0
  searchInputText:any
  checkedList = [] //用户选择列表
  activityList = [] //活动选择列表
  checked = false;
  indeterminate = false;
  listOfCurrentPageData = [];
  listOfData = []; //用户列表
  activityOfData = [] //活动列表
  setOfCheckedId = new Set<number>();
  isVisible:any = false
  constructor(private message: NzMessageService,
  private http:HttpClient  
  ) { }
  
  listOfSelection = [
    {
      text: '选择所有',
      onSelect: () => {
        this.onAllChecked(true);
      }
    },
    {
      text: '选择偶数行',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data, index) => this.updateCheckedSet(data.objectId, index % 2 !== 0));
        this.refreshCheckedStatus();
      }
    },
    {
      text: '选择奇数行',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data, index) => this.updateCheckedSet(data.objectId, index % 2 === 0));
        this.refreshCheckedStatus();
      }
    }
  ];
 

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  //选择用户
  onItemChecked(item, checked: boolean,index): void {
    console.log(index,checked)
    if(checked){
      this.checkedList.push(item)
    }else{
      this.checkedList.splice(index,1)
    }
    console.log(this.checkedList)
    this.updateCheckedSet(item.objectId, checked);
    this.refreshCheckedStatus();
  }
  //选择活动
  onActiveChecked(item, checked: boolean,index):void{
    console.log(index,checked)
    if(checked){
      this.activityList.push(item)
    }else{
      this.activityList.splice(index,1)
    }
    this.updateCheckedSet(item.objectId, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.objectId, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.objectId));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.objectId)) && !this.checked;
  }

  ngOnInit(): void {
    // this.listOfData = new Array(20).fill(0).map((_, index) => {
    //   return {
    //     id: index,
    //     nickName: `涛涛`,
    //     number: 1001,
    //     name: `李冰涛`,
    //     phone:"18870781105",
    //     isVIP:'是',
    //     totalSum:300
    //   };
    // });
    // console.log(this.listOfData)
    this.getUserData()
  }

  getUserData(){
    let company = localStorage.getItem("company")
    let query = new Parse.Query("_User")
    query.equalTo("company",company)
    query.limit(10)
    query.descending("createdAt")
    query.find().then(res=>{
      if(res&&res.length>0){
        res.map(item=>{
          let item_1 = item.toJSON()
          this.listOfData.push(item_1)
        })
        console.log(this.listOfData)
      }
    })
  }

  searchInputChange(e){
    console.log(e)
    if(e){
      let query = new Parse.Query("_User")
      let company = localStorage.getItem("company")
      let searchContent = []
      query.equalTo("company",company)
      query.limit(1000)
      query.contains("nickname",e)
      query.find().then(res=>{
        if(res&&res.length>0){
          res.map(item=>{
            let item_1 = item.toJSON()
            searchContent.push(item_1)
            this.listOfData = searchContent
          })
          console.log(this.listOfData)
        }
      })
    }else{
      this.getUserData()
    }
  }

  getActivity(){
    this.activityOfData = []
    let company = localStorage.getItem("company")
    let query = new Parse.Query("ShopRush")
    query.equalTo("company",company)
    query.limit(10)
    query.find().then(res=>{
      if(res&&res.length>0){
        res.map(item=>{
          let item_1 = item.toJSON()
          this.activityOfData.push(item_1)
        })
        console.log(this.activityOfData)
      }
    })
  }
  showActivity(){
    this.isVisible = true
    this.getActivity()
  }
  handleCancel(){
    this.isVisible = false
    this.checkedList.map(item=>{
     this.updateCheckedSet(item.objectId, false);
    })
    this.checkedList = []
    this.activityList = []
   
  }
  handleOk(){
    this.sendMess()
    this.checkedList.map(item=>{
      this.updateCheckedSet(item.objectId, false);
    })
    this.isVisible = false
    this.checkedList = []
    this.activityList = []

  }
  sendMess(){
    let length = this.checkedList.length
    let url = "/index?activityId="
    let Messconfig = {
      templateId:"qXHcFd-ek4lfZ4J3rzJH-RTmRayREb22PQufxlJtqmM",
      appId:"wx4a8f7aed1f063161",
      companyId:"i3cwsEHS4U"
    }
    if(length==0){
      this.message.create("error", `还没有选择哦，请选择用户`);
      return;
    }

    if(this.activityList.length==0){
      this.message.create("error", `还没有选择活动哦`);
      return;
    }

    console.log(this.checkedList)
    this.checkedList.map(item=>{
      console.log(item.wechat.openid)
      if(item.wechat&&item.wechat.openid){
          let openId = item.wechat.openid
          this.activityList.map(item1=>{
            let first = item1.title
            url = url + item1.objectId
            let keyword1 = item1.title
            let keyword2 = item1['startAt'].iso
            let keyword3 = item1.storeAddress
            let keyword4 = item.nickname
            this.http.get(`https://server.fmode.cn/api/wechat/sendTplMess?templateId=${Messconfig.templateId}&appId=${Messconfig.appId}&companyId=${Messconfig.companyId}&openId=${openId}&first=${first}&keyword1=${keyword1}&keyword2=${keyword2}&keyword3=${keyword3}&keyword4=${keyword4}&url=${url}`).subscribe(res => {
                console.log(res)
                let result:any = res
                if(result.errcode!=0){
                    this.message.create("error", result.errmsg);
                }else{
                  this.message.create("success", "发送成功");
                }
              })
            })

          
      }else{
        this.message.create("error", `该用户还未进入过小程序`);
      }
    
    })

  }

  
  

}
