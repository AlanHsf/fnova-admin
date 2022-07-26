import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import * as Parse from 'parse';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'app-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

    constructor(private activatedRoute: ActivatedRoute, private message: NzMessageService,) { }
    sid: string = ""
    order:any = null
    ngOnInit() {
        this.activatedRoute.paramMap.subscribe(async params => {
            let sid = params.get('PobjectId')
            this.sid = sid
            await this.queryOrder(sid)
        })

    }
    async queryOrder(sid) {
        let ShopOrder = new Parse.Query('ShopOrder')
        ShopOrder.include('address')
        ShopOrder.include('goods')
        ShopOrder.include('user')
        ShopOrder.include('store')
        let order = await ShopOrder.get(sid)
        if(order) {
            this.order = order
            console.log(order)
        }
    }

}
