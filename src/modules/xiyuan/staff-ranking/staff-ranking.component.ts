import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-staff-ranking',
  templateUrl: './staff-ranking.component.html',
  styleUrls: ['./staff-ranking.component.scss']
})
export class StaffRankingComponent implements OnInit {

  constructor(public http: HttpClient) { }
  hostUrl = "https://server.fmode.cn/api/"
  ngOnInit(): void {
      this.getData()
  }
  getData(){
    
    let that = this
    let sql = 
    `select 
    "staffRank"."id" as "sid",
    max("UserStaff"."name") as "name",
    max("staffRank"."total") as "total",
    max("UserStaff"."createdAt") as "date",
    max("staffIncome") as "staffIncome",
    (sum(sum("staffRank"."total")) OVER()) as "allTotal",
    round((max("staffRank"."total") / (sum(sum("staffRank"."total")) OVER()) * 100)::Numeric, 2) as "rate"
    from
    (select 
     sum("price") as total,
     max("ShopOrder"."staff") as "id",
     sum(("ShopOrder"."incomeMap"->"UserStaff"."user"->>'staff')::float) as "staffIncome"
     from 
     "ShopOrder" left join "UserStaff" on "ShopOrder"."staff" = "UserStaff"."objectId"
    where "ShopOrder"."staff" is not null
    group by "ShopOrder"."staff") as "staffRank"
    left join "UserStaff" on "staffRank"."id" = "UserStaff"."objectId"
    group by "staffRank"."id"
    order by "total" desc`
    this.http.post(this.hostUrl+'novaql/select',{sql})
    .subscribe((res)=>{
      console.log(res)
      let result:any = res
      that.listOfData = result.data
    })

  }
  
  listOfData = [
  ];

}
