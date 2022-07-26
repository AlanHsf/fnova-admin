import { Component, OnInit } from '@angular/core';
import * as Parse from "parse"
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzButtonSize } from 'ng-zorro-antd/button';
@Component({
	selector: 'app-material',
	templateUrl: './material.component.html',
	styleUrls: ['./material.component.scss']
})
export class MaterialComponent implements OnInit {

	constructor(private router: Router, private message: NzMessageService) { }
	company: string = '';
	name: string = '';
	address: string = '';
	categoryname: string = '';
	department: any = [];
	meterialname: string = '';
	category: any = [];
	meterial: any = [];
	number: Number = 0;
	totalPrice: Number = 0.00;
	price: Number = 0.00;
	id: string = '';
	aid: string = '';
	size: NzButtonSize = 'default';
	ngOnInit(): void {
		this.company = localStorage.getItem('company')
		this.getDepartment()
		this.getCategory()
		// this.getprice()
		// this.changeDetectorRef.markForCheck();
	}
	TotalPrice() {

	}
	async getDepartment() {
		let Department = new Parse.Query('Department')
		Department.equalTo('company', this.company)
		// Store.equalTo('isVerified',true)
		let department = await Department.find()
		let listJSON = []
		if (department) {
			department.forEach(e => {
				let lists = e.toJSON()
				listJSON.push(lists)
				this.department = listJSON
				this.name = listJSON[0].name
				this.id = listJSON[0].objectId
			})
		}
		console.log(this.id);
		this.getCategory()
	}
	async getCategory() {
		let Category = new Parse.Query('Category')
		Category.equalTo('company', this.company)
		Category.equalTo('isEnabled', true)
		let category = await Category.find()
		let listJSON = []
		if (category) {
			category.forEach(e => {
				let lists = e.toJSON()
				listJSON.push(lists)
				this.category = listJSON
				this.categoryname = listJSON[0].name
			})
		}
		this.getMeterial()
		console.log(this.categoryname);
	}
	async getMeterial() {
		console.log();
		let Department = new Parse.Query('Department')
		Department.equalTo('company', this.company)
		Department.equalTo('name', this.name)
		let department = await Department.first()
		console.log(department);
		let uid
		if (department) {
			uid = department.id
		}
		let Category = new Parse.Query('Category')
		Category.equalTo('company', this.company)
		Category.equalTo('isEnabled', true)
		Category.equalTo('name', this.categoryname)
		let category = await Category.first()
		console.log(category);
		let id
		if (category) {
			id = category.id
		}

		let Material = new Parse.Query('Material')
		Material.equalTo('company', this.company)
		Material.include('category')
		Material.equalTo('category', id)
		console.log(uid);
		Material.equalTo('department', uid)
		let material = await Material.find()
		let listJSON = []
		console.log(material);
		if (material && material.length > 0) {
			material.forEach(e => {
				let lists = e.toJSON()
				listJSON.push(lists)
				this.meterial = listJSON
				this.meterialname = listJSON[0].name
				this.aid = listJSON[0].objectId
			})
		} else {
			this.meterial = null
			this.meterialname = null
			this.aid = null
		}

		console.log(this.meterial);
		this.getprice()
	}
	log(event) {
		console.log(event);
		this.name = event
		this.getMeterial()
	}
	classify(event) {
		this.number = 0
		this.totalPrice = 0.00
		console.log(event);
		this.categoryname = event
		console.log(this.categoryname);
		this.getMeterial()
	}
	Meterialname(event) {
		this.number = 0
		this.totalPrice = 0.00
		console.log(event);
		this.meterialname = event
		this.getprice()
	}
	async getprice() {
		let Material = new Parse.Query('Material')
		Material.equalTo('company', this.company)
		console.log(this.meterialname);
		Material.equalTo('name', this.meterialname)
		let material = await Material.first()
		console.log(material);
		let price
		if (material) {
			price = material.toJSON().price
		}

		console.log(price, 123);
		this.price = price
	}
	input(event) {
		if (event < 0) {
			event = 0
		}
		this.number = event
		let totalPrice = Number(this.price) * event
		console.log(totalPrice);
		this.totalPrice = totalPrice
	}
	submit() {
		let rid = 'be0Wxx4fmb'
		let now = new Date()
		let tradeNo = "C" +
			String(now.getFullYear()) +
			(now.getMonth() + 1) +
			now.getDate() +
			now.getHours() +
			now.getMinutes() +
			now.getSeconds() +
			Math.random().toString().slice(-6); //生成六位随机数
		console.log(this.id, this.name, this.price, this.totalPrice, this.address, tradeNo, this.number);
		if (!this.id || !this.name || !this.address) {

			this.message.info('请输入完整信息！');

			return
		}

		if (this.number == 0) {

			this.message.info('请确保您输入的数量大于0');

			return
		}
		let MeterialOrder = Parse.Object.extend("MaterialOrder")
		let meterialOrder = new MeterialOrder()
		meterialOrder.set("orderNum", tradeNo)
		meterialOrder.set("price", this.price)
		meterialOrder.set("totalPrice", this.totalPrice)
		meterialOrder.set("status", '100')
		meterialOrder.set("address", this.address)
		meterialOrder.set("count", this.number)
		meterialOrder.set("company", {
			__type: 'Pointer',
			className: 'Company',
			objectId: this.company
		})
		meterialOrder.set("department", {
			__type: 'Pointer',
			className: 'Department',
			objectId: this.id
		})
		meterialOrder.set("meterial", {
			__type: 'Pointer',
			className: 'Meterial',
			objectId: this.aid
		})

		meterialOrder.save().then(res => {
			console.log(res)

		})
		this.router.navigate(['common/manage/MeterialOrder', { rid }])
	}
}
