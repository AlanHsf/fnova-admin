import * as Parse from "parse";

import { Component, OnInit } from '@angular/core';
import { Cloud } from '../../../providers/cloud';

// UML 类图渲染插件
// 开源版JointJS https://www.jointjs.com/opensource
// 参考文档 https://resources.jointjs.com/docs/jointjs/v3.2/joint.html

@Component({
  selector: 'app-schema-list',
  templateUrl: './schema-list.component.html',
  styleUrls: ['./schema-list.component.scss']
})
export class SchemaListComponent implements OnInit {
  listOfDatabaseTable:Array<any> = []
  listOfLocalSchema:Array<any> = []
  
  constructor(
    private cloud:Cloud
  ) {
    if(!Parse.masterKey){
      (Parse as any).masterKey = "NovaTest666";
    }
  }

  ngOnInit() {
    this.refreshAllData()
  }

  async refreshAllData(){
    // 0. 获得所有Schema和数据库表
    let schemas = await this.cloud.getSchemas();
    this.listOfLocalSchema = Object.values(schemas);
    (Parse as any).Schema.all({ useMasterKey: true }).then(data=>{
      this.listOfDatabaseTable = data
      // this.listOfDatabaseTable.forEach(titem => {
      //   titem.fields = {}
      //   if (titem.fieldsArray){
      //     titem.fieldsArray.forEach(afitem => {
      //       titem.fields[afitem.key] = afitem;
      //     });
      //   }
      // }); 
      // 1. 检查所有Schema和数据库表
      this.listOfDatabaseTable.forEach(item=>this.checkFieldsDiff(item.className))
      this.listOfLocalSchema.forEach(item=>this.checkFieldsDiff(item.className))
      this.changeTab('schema')

    })
  }

  listOfDisplayData:Array<any> = []
  listOfDiffData:Array<any> = []
  listOfNewData:Array<any> = []
  listOfNoschemaData:Array<any> = []
  changeTab(title){
    if(title == 'schema'){ // 全部本地Schema
      this.listOfDisplayData = this.listOfLocalSchema
    }
    if(title == 'table'){ // 全部线上Table
      this.listOfDisplayData = this.listOfDatabaseTable
    }
    if(title == "diff"){ // 有异常的
      this.listOfDisplayData = this.listOfDiffData
    }
    if(title == "newadd"){ // 未创建的
      this.listOfDisplayData = this.listOfNewData
    }
  }
  getDiffFields(className){
    let status = this.StatusMap[className]
    return status&&status.diffs?status.diffs:[]
  }
  getDiffData(){
      this.listOfDiffData = this.listOfLocalSchema.filter(item=> this.StatusMap[item.className] && this.StatusMap[item.className].status == "diff")
      return this.listOfDiffData
  }
  getNewData(){
    this.listOfNewData = this.listOfLocalSchema.filter(item=> this.StatusMap[item.className] && this.StatusMap[item.className].status == "newadd") 
    return this.listOfNewData
  }
  getNoschemaData(){
    this.listOfNoschemaData = this.listOfDatabaseTable.filter(item=> this.StatusMap[item.className] && this.StatusMap[item.className].status == "noschema") 
    return this.listOfNoschemaData
  }

  StatusMap = {}

  checkFieldsDiff(className){
    let diffs = []
    let schema = this.listOfLocalSchema.find(item=> item.className == className)
    let table = this.listOfDatabaseTable.find(item=> item.className == className)
    console.log(schema, table)
    if(schema){
      let fields = schema.fields
      if(fields){
        if(table){
          Object.keys(fields).forEach(key=>{
            // console.log(key)
            // console.log(t.fields[key].type,fields[key].type)
            let status = ""
            if(table.fields[key]){
              if(table.fields[key].type != fields[key].type){
                status = `update: ${table.fields[key].type} to ${fields[key].type}`
              }
            }else{
              status = "newadd"
            }
            console.log(status)
            if(status != ""){
              diffs.push({
                key:key,
                type:fields[key].type,
                className:fields[key].targetClass,
                status:status
              })
            }
          })
          if(diffs.length == 0){
            this.StatusMap[className] = {
              color:"green",
              status:"done",
              message:`已同步`
            }
          }else{
            this.StatusMap[className] = {
              color:"red",
              status:"diff",
              message:`异常字段${diffs.length}个`,
              diffs:diffs
            }
          }
        }else{
                Object.keys(fields).forEach(key=>{diffs.push({key:key, type:fields[key].type,className:fields[key].targetClass, status:"newadd"})});
          this.StatusMap[className] = {
            color:"cyan",
            status:"newadd",
            diffs:diffs,
            message:"未创建Table"
          }
        }
      }
    }else{
      this.StatusMap[className] = {
        color:"gray",
        status:"noschema",
        message:"未编写Schema"
      }
    }
    console.log(diffs)
    return diffs
  }

  fixSchemaAndTable(className){
    let status = this.StatusMap[className]
    console.log(status)
    if(status.status == "done") return
    if(status){
      let schema = new Parse.Schema(className)
      let updateFiledList = []
      schema.get().then(data=>{ // 线上存在时，修正字段
          this.saveSchema(schema,status,false)
      }).catch(err=>{ // 线上不存在时，全新创建
          this.saveSchema(schema,status,true)
      })
    }
  }
  saveSchema(schema, status,isNew?){
    let updateFiledList = []
    console.log(schema , status, status.diffs);
    status.diffs.forEach(field => {
      console.log(field);
      let method = field.status.split(":");
      if (method[0] == "newadd") {
        if (field.type == "Pointer") {
          schema.addPointer(field.key, field.className);
        } else {
          schema.addField(field.key, field.type);
        }
      }
      if (method[0] == "update") {
        // 修复前，需要检查字段是否有遗留数据
        schema.deleteField(field.key);
        updateFiledList.push(field);
      }
    });

    if(isNew){
      schema.save({useMasterKey:true}).then(()=>{
        this.refreshAllData()
      })
    }else{
      schema.update({useMasterKey:true}).then(()=>{
        updateFiledList.forEach(field => {
            if(field.type == "Pointer"){
              schema.addPointer(field.key, field.className)
            }else{
              schema.addField(field.key,field.type)
            }
        });

        schema.update().then(()=>{
          this.refreshAllData()
        })
      })
    }
  }

  purgeSchemaData(className){
    let schema = new Parse.Schema(className);
    // schema.purge().then(()=>{
    //   this.refreshAllData();
    // })
  }
  isImportModalVisible:boolean = false;
  importClassName:string = ""
  importInputData:string = ""
  openImportModal(className){
    this.importClassName = className
    this.isImportModalVisible = true;
  }
  closeImportModal(){
    this.isImportModalVisible = false;
  }
  importSchemaData(){
    let ThisObject = Parse.Object.extend(this.importClassName)

    let DataList = JSON.parse(this.importInputData)
    console.log(DataList.length)
    DataList.forEach(data=>{
      delete data.createdAt
      delete data.updatedAt
      delete data.objectId

      let obj = new ThisObject()
      obj.set(data)
      console.log(obj)
      obj.save()

    })

    // this.isImportModalVisible = false;

  }
}
