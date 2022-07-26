import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Parse from "parse";

import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  constructor(private activRoute: ActivatedRoute, private nzMessageService: NzMessageService, private router: Router,) { }
  id: string = ""
  name: string = ""
  realname: string = ""
  images: any = []
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
    let ShopOrder = new Parse.Query("ShopOrder");
    ShopOrder.include('shopStore')
    ShopOrder.include('goods')
    ShopOrder.include('user')
    let shopstore = await ShopOrder.get(this.id)
    this.order = shopstore.toJSON()
    this.name = this.order.goods.name
    this.realname = this.order.user.realname
    this.images = this.order.images
    console.log(this.order, this.images);
  }
  cancel(): void {
    this.nzMessageService.info('取消');
  }

  confirm(): void {
    this.nzMessageService.info('确认');
    this.submit()
  }
  async submit() {
    let query = new Parse.Query("ShopOrder")
    let shopOrder = await query.get(this.id)
    shopOrder.set("hiddenComment", true)
    shopOrder.save().then(res => {
      console.log(res)
    })
    this.nzMessageService.info('删除成功');
    this.router.navigate(['toursim/orderComments'])
  }
}
