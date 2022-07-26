import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Parse from "parse";
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
@Component({
  selector: 'app-construction-detail',
  templateUrl: './construction-detail.component.html',
  styleUrls: ['./construction-detail.component.scss']
})
export class ConstructionDetailComponent implements OnInit {
  constructor(private modal: NzModalService, private message: NzMessageService, private activRoute: ActivatedRoute, private nzMessageService: NzMessageService, private router: Router,) { }
  id: string = ''
  order: any = {}
  company: string = '';
  isConfirmLoading: boolean = false;
  ngOnInit(): void {
    this.activRoute.paramMap.subscribe((params) => {
      let id = params.get("id")
      console.log(id);
      this.id = id
    })
    this.company = localStorage.getItem('company')
    this.getOrderComplaint()
  }
  async getOrderComplaint() {
    let OrderComplaint = new Parse.Query("OrderComplaint");
    OrderComplaint.include('order')
    let order
    let orderComplaint = await OrderComplaint.get(this.id)
    if (orderComplaint) {
      order = orderComplaint.toJSON()
    }

    console.log(order);
    this.order = order

  }
  async handleOk() {
    this.isConfirmLoading = true;
    let rid="su4wzV7QaV"
    this.getDecorateOrder()
    let OrderComplaint = new Parse.Query("OrderComplaint")
    let orderComplaint = await OrderComplaint.get(this.order.objectId)
    orderComplaint.set("status", 200)
    await orderComplaint.save()
    setTimeout(() => {
      this.isConfirmLoading = false;
    }, 1000);
    this.router.navigate(['xxl/constructiondetail',{rid}])
  }
  async getDecorateOrder() {
    let id = this.order.order.objectId
    let DecorateOrder = new Parse.Query("DecorateOrder")
    let decorateOrder = await DecorateOrder.get(id)
    decorateOrder.set("status", 502)
    await decorateOrder.save()
  }
  async handleCancel() {
    let id = this.order.objectId
    let OrderComplaint = new Parse.Query("OrderComplaint")
    let orderComplaint = await OrderComplaint.get(id)
    orderComplaint.set("status", 201)
    await orderComplaint.save()
    await this.DecorateOrder()
  }
  async DecorateOrder() {
    let id = this.order.order.objectId
    let DecorateOrder = new Parse.Query("DecorateOrder")
    let decorateOrder = await DecorateOrder.get(id)
    decorateOrder.set("status", 501)
    await decorateOrder.save()
  }
}
