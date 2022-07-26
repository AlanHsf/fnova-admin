import { Component, OnInit } from '@angular/core';
import * as Parse from "parse";
import { Input, Output, EventEmitter } from '@angular/core';
import { identifierModuleUrl } from '@angular/compiler';


@Component({
  selector: 'app-edit-income-options',
  templateUrl: './edit-income-options.component.html',
  styleUrls: ['./edit-income-options.component.scss']
})
export class EditIncomeOptionsComponent implements OnInit {
  @Input() optionMap:any = {};


  @Output() optionMapChange = new EventEmitter<any>();  

  constructor() { }


  editCache: { [key: string]: { edit: boolean; data: any } } = {};
  listOfData: any = [];
 
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.listOfData.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.listOfData[index] },
      edit: false
    };
    
  }

  saveEdit(id: string): void {
    const index = this.listOfData.findIndex(item => item.id === id);
    Object.assign(this.listOfData[index], this.editCache[id].data);
    this.editCache[id].edit = false;
    
    // 转换为Map
    console.log(id)
    console.log(this.listOfData)
    this.optionMap = {}
    this.listOfData.map((item,index)=>{
      this.optionMap[item.objectId] = {
      "1":Number(item['1']),
      "2":Number(item['2']),
      "3":Number(item['3'])}
    })
    console.log(this.optionMap)

   this.optionMapChange.emit(this.optionMap)

  }

  updateEditCache(): void {
    this.listOfData.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  ngOnInit(): void {
    let data = [];
    console.log(this.optionMap)
    // data = [
    //   {id:1,name:"青铜","1":10,"2":8,"3":5},
    //   {id:2,name:"白银","1":15,"2":13,"3":10},
    //   {id:3,name:"黄金","1":20,"2":18,"3":15},
    // ]
    this.getUserLevel()
    // this.listOfData = data;
   
    
  }
  async getUserLevel(){
    let query = new Parse.Query("UserAgentLevel")
    let company = localStorage.getItem("company")
    let data = []
    let optionMap = {}
    query.equalTo("company",company)
    let result =  await query.find()
    if(result.length>0){
      result.map((item,index)=>{
        this.listOfData.push({
          id:index,
          objectId:item.id,
          name:item.get("name"),
          "1":0,
          "2":0,
          "3":0
        })
        optionMap[item.id] = {
        "1":0,
        "2":0,
        "3":0}
    })
    if(!this.optionMap){
      this.optionMap = optionMap
      this.optionMapChange.emit(optionMap)
     console.log(this.optionMap)
    }else{
      for (const [key, value] of Object.entries(this.optionMap)) {
        console.log(key,value['1']);
        this.listOfData.map(item1=>{
             if(key==item1.objectId){
                item1['1'] = value['1']
                item1['2'] = value['2']
                item1['3'] = value['3']

            }
         })

      }
      // Object.keys(this.optionMap).map(item=>{
      //   this.listOfData.map(item1=>{
      //     if(item==item1.objectId){

      //     }
      //   })
      // })
     
    }
   
    this.updateEditCache();
    }
      
  }
}
