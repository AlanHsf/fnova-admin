import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import * as Parse from "parse";

import { EditObjectComponent } from "../../common/edit-object/edit-object.component";

import { HttpClient } from "@angular/common/http";
import { AppService } from "../../../app/app.service";



@Component({
  selector: 'app-home-dashboard',
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.scss']
})
export class HomeDashboardComponent implements OnInit {
    @ViewChild(EditObjectComponent,{static:false}) editObject: EditObjectComponent;
    
    members:number = 0
    shopStores:number = 0
    stocks: number = 0
    earnings: number = 0
    company:string = ''
    baseUrl:string = localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":"https://server.fmode.cn/api/novaql/select"
    account:any = []
    constructor(
        public appServ: AppService,
        private http: HttpClient
    ) { 
        this.appServ.isCollapsed = true; // 默认折叠左侧菜单
    }

    async ngOnInit() {
        this.company = localStorage.getItem('company')
        this.queryMembers()
        this.queryStore()
        this.queryStocks()
        this.queryAccount()
    }


     async queryMembers() {
        let User = new Parse.Query('_User')
        User.equalTo('company', this.company)
        let users = await User.count()
        this.members = users
    }
    async queryStore(){
        let ShopStore = new Parse.Query('ShopStore')
        ShopStore.equalTo('company', this.company)
        let shopStores = await ShopStore.count()
        this.shopStores = shopStores
    }

    async queryStocks() {
        let sql = `select
            max("company"),
            count("count")
        from (select 
            max("log"."count") as "count",
            max("log"."company") as "company"
            from "UserStockLog"  as  "log" 
            where "log"."company" = 'yehZ4fpd6a' 
            group by "user" , "log"."orderID") as "totalCount"
        group by "company"`
        this.http.post(this.baseUrl, { sql: sql }).subscribe((res: any) => {
            console.log(res.data)
            this.stocks = res.data[0].count;
        });
    }



    async queryAccount() {
        let Account = new Parse.Query('Account')
        Account.equalTo('company', this.company)
        Account.include('user')
        Account.limit(20000)
        let account = await Account.find()
        if(account&& account.length > 0) {
            this.account = account
        }
    }

    

   
  












  
  

  
    
  
}
