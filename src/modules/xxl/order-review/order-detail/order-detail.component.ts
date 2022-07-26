import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Parse from "parse";
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

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
    this.getOrderComplaint()
  }
  async getOrderComplaint() {
    let DecorateOrder = new Parse.Query("DecorateOrder");
    DecorateOrder.include('profile')
    let order
    let decorateOrder = await DecorateOrder.get(this.id)
    if (decorateOrder) {
      order = decorateOrder.toJSON()
    }
    console.log(order);
    this.order = order
  }
  async handleOk() {
    this.isConfirmLoading = true;
    let DecorateOrder = new Parse.Query("DecorateOrder")
    let decorateOrder = await DecorateOrder.get(this.order.objectId)
    decorateOrder.set("status", 500)
    await decorateOrder.save()
    setTimeout(() => {
      this.isConfirmLoading = false;
    }, 1000);
    this.router.navigate(['xxl/orderreview'])
  }
  async handleCancel() {
    let id = this.order.objectId
    let DecorateOrder = new Parse.Query("DecorateOrder")
    let decorateOrder = await DecorateOrder.get(id)
    decorateOrder.set("status", 300)
    await decorateOrder.save()
    this.router.navigate(['xxl/orderreview'])
  }

}
