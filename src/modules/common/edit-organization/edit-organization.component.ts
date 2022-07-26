import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import * as Parse from "parse";

@Component({
  selector: 'app-edit-organization',
  templateUrl: './edit-organization.component.html',
  styleUrls: ['./edit-organization.component.scss']
})
export class EditOrganizationComponent implements OnInit {
  @Input("show") show:boolean = false;
  @Input("data") data:any = {};
  @Input("fields") fields:any = {};
  radioValue = ''
  status:boolean = true
  isSpinning:boolean = false
  company = localStorage.getItem("company");
  constructor() { }

  ngOnInit(): void {  
    console.log(this.data,this.fields)
    this.getOrg()

  }
  paramsArray = [];

  isVisible = false
  async showModal(){
  this.isVisible = true;
  }
  handleCancel(){
    this.isVisible = false;
  }
  changeOrgSatus(e:any){
    this.status = e
  }
  changeType(e:any){
    this.radioValue = e
  }
  handleOrg(){
    this.isSpinning = true
    console.log(this.data.get('user').id)
    let organization = new Parse.Query("Department")
    organization.equalTo("company",this.company)
    organization.equalTo("name",this.data.get('name'))
    organization.equalTo("admin",this.data.get('user').id)
    organization.first().then(res=>{
      console.log(res)
      if(res&&res.id){
        res.set("isEnabled",this.status)
        res.set("type",this.radioValue)
        res.save()
        this.data.set("isVerified",this.status)
        this.data.save()
        this.isSpinning = false
        this.isVisible = false;
      }else{
        let Department = Parse.Object.extend("Department")
        let department = new Department()
        department.set("company",{
          __type:"Pointer",
          className:"Company",
          objectId:this.company
        })
        department.set("name",this.data.get("name"))
        department.set("admin",{
          __type:"Pointer",
          className:"_User",
          objectId:this.data.get("user").id
        })
        department.set("isEnabled",this.status)
        department.set("type",this.radioValue)
        department.save()
        this.data.set("isVerified",this.status)
        this.data.save()
        this.isSpinning = false
        this.isVisible = false;
      }
    }).catch(err=>{
      this.isSpinning = false
      this.isVisible = false;
    })
  }
  getOrg(){
    const _this = this
    let organization = new Parse.Query("Department")
    organization.equalTo("admin",this.data.get("user").id)
    organization.equalTo("company",this.company)
    organization.equalTo("name",this.data.get("name"))
    organization.first().then(res=>{
      if(res&&res.id){
        _this.status = res.get("isEnabled")
        _this.radioValue = res.get("type")
      }
    })
  }
}
