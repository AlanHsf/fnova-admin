import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Parse from "parse";

import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  constructor(private activRoute: ActivatedRoute, private nzMessageService: NzMessageService, private router: Router,) { }
  complaint: any = {}
  isConfirmLoading: boolean = false;
  ngOnInit(): void {
    this.activRoute.paramMap.subscribe((params) => {
      let id = params.get("id")
      console.log(id);
      this.getQuantityComplaint(id)
    })
  }
  async getQuantityComplaint(id) {
    let QuantityComplaint = new Parse.Query("QuantityComplaint")
    QuantityComplaint.include('order')
    QuantityComplaint.include('profile')
    let quantityComplaint = await QuantityComplaint.get(id)
    let complaint = quantityComplaint.toJSON()
    console.log(complaint);
    this.complaint = complaint
  }
  async handleOk() {
    this.isConfirmLoading = true;
    this.getDecorateOrder()
    let QuantityComplaint = new Parse.Query("QuantityComplaint")
    let quantityComplaint = await QuantityComplaint.get(this.complaint.objectId)
    quantityComplaint.set("status", '200')
    await quantityComplaint.save()
    setTimeout(() => {
      this.isConfirmLoading = false;
    }, 1000);
    this.router.navigate(['xxl/audit'])
  }
  async handleCancel() {
    let QuantityComplaint = new Parse.Query("QuantityComplaint")
    let quantityComplaint = await QuantityComplaint.get(this.complaint.objectId)
    quantityComplaint.set("status", '201')
    await quantityComplaint.save()
    this.router.navigate(['xxl/audit'])
  }
  async getDecorateOrder() {
    let DecorateOrder = new Parse.Query("DecorateOrder")
    let decorateOrder = await DecorateOrder.get(this.complaint.order.objectId)
    decorateOrder.set("status", 202)
    await decorateOrder.save()
  }
}
