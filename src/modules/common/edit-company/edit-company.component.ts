import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HttpClient } from "@angular/common/http";
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from "../../../app/app.service";
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as Parse from "parse";


@Component({
	selector: 'app-edit-company',
	templateUrl: './edit-company.component.html',
	styleUrls: ['./edit-company.component.scss'],

})
export class EditCompanyComponent implements OnInit {
	constructor(private activRoute: ActivatedRoute, private modalService: NzModalService, private router: Router,
		private cdRef: ChangeDetectorRef, private http: HttpClient, private notification: NzNotificationService, private appServ: AppService) { }
	company: any;// 非子公司账套
	pageType: string = 'comp';// 页面展示内容
	pageIndex: number = 1;
	pageSize: number = 10;
	isLoading: boolean = true;
	total: number = 0;
	isOkLoading = false;
	companyList:any = []
	async ngOnInit() {
		this.company = localStorage.getItem('company')
		this.activRoute.paramMap.subscribe(async (params) => {
			await this.getCompanys()
		})
	}

	goDetail(data) {
		let id = data.objectId
		console.log(data.objectId)
		this.router.navigate(['common/company-details', { id }])
	}
	/* 数据源 */
	async getCompanys() {
		let Company = new Parse.Query("Company");
		if(this.company != '1AiWpTEDH9') {
			Company.equalTo('company', this.company);
		}
		Company.descending('createdAt')
		if(!this.total) {
			this.total =await Company.count()
		}
		Company.include('superadmin')
		Company.select('name','title',"fullName", 'desc', "customer","logo" , "fullName", "superadmin", "superadmin.username")
		Company.skip((this.pageIndex - 1) * this.pageSize)
		Company.limit(this.pageSize)
		let company = await Company.find()
		let companyList = []
		if (company && company.length) {
			company.forEach((item) => {
				companyList.push(item.toJSON()) 
			})
			this.companyList = companyList
			console.log(this.companyList)
			this.isLoading = false
		}
	}
}
