import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-share-holders',
  templateUrl: './share-holders.component.html',
  styleUrls: ['./share-holders.component.scss']
})
export class ShareHoldersComponent implements OnInit {

  constructor(public http:HttpClient) { }
  hostUrl = "https://server.fmode.cn/api/"
  ngOnInit(): void {
      this.getData()
  }
  getData(){
      let that = this
      let sql = `select
        max("shareOne"."objectId") as "id",
        max("shareOne"."name") as "name",
        sum("shareOne"."shareNumber") as "shareNumber",
        max("shareOne"."share") as "share",
        max("shareOne"."createdAt") as "createdAt",
        count(*) as "shareNumber1"
        from
        (select
        "objectId",
        "name",
        "share",
        "createdAt",
        count("share") as "shareNumber"
        from "UserShare"
        group by "UserShare"."objectId") as "shareOne" left join "UserShare" as "shareTwo" on "shareOne"."objectId" = "shareTwo"."share"
        group by "shareOne"."objectId"`
      that.http.post(this.hostUrl+'novaql/select',{sql})
      .subscribe((res)=>{
        console.log(res)
        let result:any = res
        that.listOfData = result.data
      })
  }
  listOfData = [];

}
