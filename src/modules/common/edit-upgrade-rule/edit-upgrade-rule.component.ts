import * as Parse from "parse";
import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-upgrade-rule',
  templateUrl: './edit-upgrade-rule.component.html',
  styleUrls: ['./edit-upgrade-rule.component.scss']
})
export class EditUpgradeRuleComponent implements OnInit {

  constructor() { }
  guide:any=[]
  guide_1:any=''
  demoValue:any=3;
  upgradeRule:any=[]
  @Input() testData:any = [];
  @Output() testDataChange = new EventEmitter<any>();  
  // testData:any=[
  //   {
  //     "rule": "self-order-lessoncard",
  //     "count": 1
  //   },
  //   {
  //     "rule": "invite-order-lessoncard",
  //     "count": 3
  //   },
  //   {
  //     "rule": "group-order-lessoncard",
  //     "count": 3
  //   },
  //   {
  //     "id": "icRr9SpSgU",
  //     "rule": "invite-agentlevel",
  //     "count": 2,
  //     "level": 3
  //   }
  // ]
  userLevel:any=[]
  ngOnInit(): void {
    if(!this.testData){
      this.testData = []
    }
    console.log(111111111111)
    this.getAgentLevel()
  }
  log(value: { label: string; value: string; age: number }): void {
   this.testDataChange.emit(this.testData)
    
  }
  log_1(e,index,data): void {
    console.log(e,index,data);
   
  }
  getAgentLevel(){
    let company = localStorage.getItem("company")
    let query = new Parse.Query("UserAgentLevel")
    query.equalTo("company",company)
    query.find().then(res=>{
      res.map(item=>{
        this.userLevel.push({
          id:item.id,
          name:item.get("name"),
          level:item.get("level")
        })
      })
    })
  }
  addData(){

    this.testData.push({
      "rule": '',
      "count":1
    })
  }
  deleteData(index){
    this.testData.splice(index,1)
  }
  resure(){
    console.log(this.testData)
  }
  change(){
   this.testDataChange.emit(this.testData)

  }

}
