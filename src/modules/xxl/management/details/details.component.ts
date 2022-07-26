import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Parse from "parse";
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class ManagementdetailsComponent implements OnInit {

  constructor(private modal: NzModalService,private message: NzMessageService,private activRoute: ActivatedRoute, private nzMessageService: NzMessageService, private router: Router,) { }
  order: any = {}
  id: string = ''
  name: string = ''
  value:Number=null
  profile:any=[]
  ngOnInit(): void {
    this.activRoute.paramMap.subscribe((params) => {
      let id = params.get("id")
      console.log(id);
      this.id = id
    })
    this.getDecorateOrder()
    this.getProfile()
  }
  searchColNameChange(e) {
    console.log(e);
    this.name = e
    // this.getQuantityComplaint()
  }
  async getProfile() {
    let Profile = new Parse.Query("Profile")
    Profile.equalTo("company","1DKnoHnZ0o")
    Profile.equalTo("identyType","监理员")
    let profile=await Profile.find()
    let profileJSON=[]
   if(profile) {
    profile.forEach(item => {
      let p=item.toJSON()
      profileJSON.push(p)
    })
   }
   this.profile=profileJSON
   this.name=profileJSON[0].objectId
    console.log(profileJSON);
  }
  async getDecorateOrder() {
    let DecorateOrder = new Parse.Query("DecorateOrder")
    let decorateOrder = await DecorateOrder.get(this.id)
    let order = decorateOrder.toJSON()
    console.log(order);
    this.order = order
  }
  async handleOk() {
    let DecorateOrder = new Parse.Query("DecorateOrder")
    let decorateOrder = await DecorateOrder.get(this.id)
    if(!this.name) {
      this.message.error('请选择项目监管员');
      return
    }
    decorateOrder.set("profile", {
      __type: 'Pointer',
      className: 'Profile',
      objectId:this.name
    })
    if(this.value && this.value > 0) {
      decorateOrder.set("deposit", Number(this.value))
      decorateOrder.set("status", 101)
    }else {
      decorateOrder.set("status", 200)
    }
    await decorateOrder.save()
    this.getDecorateOrder()
  }
  async submit() {
    if(!this.value) {
      this.message.info('请输入订金金额');
    }
    let DecorateOrder = new Parse.Query("DecorateOrder")
    let decorateOrder = await DecorateOrder.get(this.id)
    decorateOrder.set("status", 102)
    decorateOrder.set("deposit", Number(this.value))
    await decorateOrder.save()
    this.getDecorateOrder()
  }
  async choose() {
    let id="sC6ZE1NG3O"
    let DecorateOrder = new Parse.Query("DecorateOrder")
    let decorateOrder = await DecorateOrder.get(this.id)
    decorateOrder.set("status", 200)
    decorateOrder.set("profile", {
        __type: 'Pointer',
        className: 'Profile',
        objectId:this.name
    })
    await decorateOrder.save()
    this.router.navigate(['xxl/management', { id }])

  }
}
