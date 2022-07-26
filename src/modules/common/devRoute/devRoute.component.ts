import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import * as Parse from "parse";
// import { CommonModule } from '@angular/common';
interface Person {
    key: string;
    name: string;
    age: number;
    address: string;
  }
@Component({
  selector: 'app-devRoute',
  templateUrl: './devRoute.component.html',
  styleUrls: ['./devRoute.component.scss']
})
export class DevRouteComponent implements OnInit {
    PclassNmae:string = ''
    PobjectId:string = ''
    listOfData: Person[] = [
        {
          key: '1',
          name: 'John Brown',
          age: 32,
          address: 'New York No. 1 Lake Park'
        },
        {
          key: '2',
          name: 'Jim Green',
          age: 42,
          address: 'London No. 1 Lake Park'
        },
        {
          key: '3',
          name: 'Joe Black',
          age: 32,
          address: 'Sidney No. 1 Lake Park'
        }
      ];
    constructor(private activatedRoute: ActivatedRoute, private router: Router ) {  }
    ngOnInit() {
        this.activatedRoute.paramMap.subscribe(param => {
            // 从模块页面进来
            if(param.get('PclassName') && param.get('PobjectId')) {
                this.PclassNmae = param.get('PclassName')
                this.PobjectId = param.get('PobjectId')
            } 
            this.getRoute()
        })
    }
    // 获取路由，上下级展示
    async getRoute() {
        let Route = new Parse.Query('DevRoute')
        if(this.PclassNmae && this.PobjectId) {
            Route.equalTo('module', this.PobjectId)
        }
        Route.limit(2000)
        let routes = await Route.find()
        console.log(routes)
    }

}
