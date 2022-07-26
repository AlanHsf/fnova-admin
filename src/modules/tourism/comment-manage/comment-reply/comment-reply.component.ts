import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HttpClient } from "@angular/common/http";
import { NzMessageService } from 'ng-zorro-antd/message';
// import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as Parse from "parse";
import { AppService } from "../../../../app/app.service";
interface DataItem {
  商品图片: string;
  购买用户: string;
  商品名称: number;
  订单编号: number;
  实际金额: number;
  评价星级: number;
  评价内容: string;
  评价图片: string;
}
@Component({
  selector: 'app-comment-reply',
  templateUrl: './comment-reply.component.html',
  styleUrls: ['./comment-reply.component.scss']
})
export class CommentReplyComponent implements OnInit {
  constructor(private activRoute: ActivatedRoute, private modalService: NzModalService, private router: Router,
    private cdRef: ChangeDetectorRef, private http: HttpClient, private appServ: AppService,) { }
  sid: string = ""
  // values = '购买用户';
  values: string = "订单编号"
  order: any = []
  checked = false;
  indeterminate = false;
  pageType: string = 'comp';// 页面展示内容
  pageIndex: number = 1;
  pageSize: number = 10;
  isLoading: boolean = true;
  total: number = 0;
  isOkLoading = false;
  company: any
  setOfCheckedId = new Set<number>();
  value: string = ''

  listOfColumn = [
    {
      title: '商品图片',
      compare: null,
      priority: false
    },
    {
      title: '购买用户',
      compare: null,
      priority: false
    },
    {
      title: '商品名称',
      compare: null,
      priority: false
    },
    {
      title: '订单编号',
      compare: null,
      priority: false
    },
    {
      title: '实际金额',
      compare: null,
      priority: false
    }
    ,
    {
      title: '评价星级',
      compare: null,
      priority: false
    }
    ,
    {
      title: '评价内容',
      compare: null,
      priority: false
    }
    ,
    {
      title: '评价图片',
      compare: null,
      priority: false
    }
    
  ];
  ngOnInit() {
    this.activRoute.paramMap.subscribe(async params => {
      await this.getqueryOrder()

    })

  }


  searchColNameChange(ev) {
    console.log(ev);
    this.values = ev
  }
  search() {
    let values = this.values
    console.log(values, this.value);
    this.getqueryOrder()
   
  }

  goDetail(data) {
    let id = data.objectId
    console.log(data.objectId);
    this.router.navigate(['toursim/DetailsComponents', { id }])
  }
  async getqueryOrder() {
    let ShopOrder = new Parse.Query("RoomOrder");
    ShopOrder.include('shopStore')
    ShopOrder.equalTo('company', 'sHNeVwSaAg');
    ShopOrder.include('address')
    ShopOrder.include('room')
    ShopOrder.include('user')
    ShopOrder.exists('content')
    ShopOrder.doesNotExist('hiddenComment')
    if (this.values == "订单编号") { ShopOrder.contains('orderNum', this.value) }
   
    if (this.values == "评价内容") { ShopOrder.contains('content', this.value) }
    console.log(this.values);
    if (!this.total) {
      this.total = await ShopOrder.count()
    }
    ShopOrder.skip((this.pageIndex - 1) * this.pageSize)
    ShopOrder.limit(this.pageSize)
    let company = await ShopOrder.find()
    let order = []
    if (company && company.length) {
      company.forEach((item) => {
        order.push(item.toJSON())
      })
      this.order = order
      console.log(this.order,123);
      this.isLoading = false
    }
    if (company && company.length==0) {
      this.order = null
      console.log(this.order,123);
    }
  }
}
