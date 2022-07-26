import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Parse from "parse";

import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-roomorder-details',
  templateUrl: './roomorder-details.component.html',
  styleUrls: ['./roomorder-details.component.scss']
})
export class RoomorderDetailsComponent implements OnInit {

  constructor(private activRoute: ActivatedRoute, private nzMessageService: NzMessageService, private router: Router,) { }
  id: string = ""
  name: string = ""
  realname: string = ""
  images: any = []
  image: string = ""
  order: any = {}
  active: Boolean = false
  data: string = ""
  ngOnInit(): void {
    this.activRoute.paramMap.subscribe((params) => {
      this.id = params.get("id")
      console.log(this.id);
      this.getqueryOrder()
    })
  }
  open(item) {
    this.active = true
    this.data = item
    console.log(this.data);

  }
  down() {
    this.active = false
  }
  async getqueryOrder() {
    let RoomOrder = new Parse.Query("RoomOrder");
    RoomOrder.include('shopStore')
    RoomOrder.include('room')
    RoomOrder.include('user')
    let roomOrder = await RoomOrder.get(this.id)
    this.order = roomOrder.toJSON()
    console.log(this.order);
    this.name = this.order.room.name
    this.realname = this.order.user.realname
    this.images = this.order.images
    this.image = this.order.room.images[0]
    console.log(this.order, this.realname);
  }
  cancel(): void {
    this.nzMessageService.info('取消');
  }

  confirm(): void {
    this.nzMessageService.info('确认');
    this.submit()
  }
  async submit() {
    let query = new Parse.Query("RoomOrder")
    let shopOrder = await query.get(this.id)
    shopOrder.set("hiddenComment", true)
    shopOrder.save().then(res => {
      console.log(res)
    })
    this.nzMessageService.info('删除成功');
    this.router.navigate(['toursim/orderComments'])
  }

}
