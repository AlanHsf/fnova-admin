import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-share-ranking',
  templateUrl: './share-ranking.component.html',
  styleUrls: ['./share-ranking.component.scss']
})
export class ShareRankingComponent implements OnInit {
  constructor(public http: HttpClient) {}
 
  
  hostUrl = "https://server.fmode.cn/api/"
  listOfSelection = [
    {
      text: 'Select All Row',
      onSelect: () => {
        this.onAllChecked(true);
      }
    },
    {
      text: 'Select Odd Row',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data, index) => this.updateCheckedSet(data.id, index % 2 !== 0));
        this.refreshCheckedStatus();
      }
    },
    {
      text: 'Select Even Row',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data, index) => this.updateCheckedSet(data.id, index % 2 === 0));
        this.refreshCheckedStatus();
      }
    }
  ];
  checked = false;
  indeterminate = false;
  listOfCurrentPageData = [];
  listOfData = [];
  setOfCheckedId = new Set<number>();

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  ngOnInit(): void {
    // this.listOfData = new Array(20).fill(0).map((_, index) => {
    //   return {
    //     id: index,
    //     name: `Edward King ${index}`,
    //     age: 32,
    //     address: `London, Park Lane no. ${index}`
    //   };
    // });
    this.getData()
  }
  getData(){
    let that = this
    let sql = 
    `SELECT  
    max("suser") as "user",
    max("shareRank"."total") as "total",
    max("shareRank"."id") as "sid",
    max("share"."name") as "name",
    max("share"."createdAt") as "date",
    max("share"."capital") as "capital",
    max("shareIncome") as "shareIncome",
    (sum(sum("shareRank"."total")) OVER()) as "allTotal",
    round((max("shareRank"."total") / (sum(sum("shareRank"."total")) OVER()) * 100)::Numeric, 2) as "rate"
    from 
     (SELECT sum("price") as total,
                  -- LAST_VALUE("incomeMap") as imap,
                 sum(("ShopOrder"."incomeMap"->"UserShare"."user"->>'share')::float) as "shareIncome",
                 max("UserShare"."user") as suser,
                  max("ShopOrder"."share") as "id" 
                  from "ShopOrder" left join "UserShare" ON "ShopOrder"."share" = "UserShare"."objectId"
                   where "ShopOrder"."share" is not null
            group by "ShopOrder"."share") as "shareRank"
    left join "UserShare" as "share" on "shareRank"."id" = "share"."objectId"
    group by "shareRank"."id"
    order by "total" desc`
    this.http.post(this.hostUrl+'novaql/select',{sql})
    .subscribe((res)=>{
      console.log(res)
      let result:any = res
      that.listOfData = result.data
    })

  }
  

}
