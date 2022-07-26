import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse'
import { ActivatedRoute } from "@angular/router";
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
	selector: 'app-goods-order',
	templateUrl: './goods-order.component.html',
	styleUrls: ['./goods-order.component.scss']
})
export class GoodsOrderComponent implements OnInit {

	constructor(private activRoute: ActivatedRoute,) { }
	company: string = ''
	columns: any = [
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
			title: '订单编号',
			compare: null,
			priority: false
		},
		{
			title: '商品名称',
			compare: null,
			priority: false
		},
		{
			title: '商品单价',
			compare: null,
			priority: false
		},
		{
			title: '购买数量',
			compare: null,
			priority: false
		},
		{
			title: '订单总价',
			compare: null,
			priority: false
		},
		{
			title: '下单店铺',
			compare: null,
			priority: false
		},
		{
			title: '订单状态',
			compare: null,
			priority: false
		},
		{
			title: '操作',
			compare: null,
			priority: false
		}
	]
	total: any  // 总数据的条数
	pageSize = 10 // 每页显示的数量
	pageIndex = 1 // 当前是第几页，当前是第一页
	isLoading: boolean = true
	listOfData: any = []
	userid: string = ""
	users: any = []
	stores: any = []
	returnValue:string = '601'
	storeid: string = ''
	orderNumber: string
	isOkLoading: boolean = false
	isReturn: boolean = false
	isBack:boolean = false
	statusOptions = [
		{ value: '100', label: "待付款" },
		{ value: '200', label: "待发货" },
		{ value: '300', label: "待收货" },
		{ value: '400', label: "待评价" },
		{ value: '500', label: "退款中" },
		{ value: '601', label: "通过退款" },
		{ value: '602', label: "退款驳回" },
		{ value: '700', label: "退款成功" },
		{ value: '800', label: "订单已完成" },
	]
	async ngOnInit() {
		this.company = localStorage.getItem('company')
		this.activRoute.paramMap.subscribe(async params => {
			console.log(params)
			let storeid = params.get('storeid')
			if (storeid) {
				this.storeid = storeid
			}
			await this.getOrders()
		})


	}
	async getOrders() {
		let Order = new Parse.Query('Order')
		Order.equalTo('company', this.company)
		Order.equalTo('type', 'goods')

		if (this.orderNumber) {
			Order.contains('type', 'goods')
		}
		if (this.userid) {
			Order.equalTo('user', this.userid)
		}
		if (this.storeid) {
			Order.equalTo('store', this.storeid)
		}
		let count = await Order.count()
		this.total = count
		Order.descending('createdAt')
		Order.include('user', 'targetObject', 'store', "address")
		Order.skip(this.pageSize * (this.pageIndex - 1))
		
		Order.limit(this.pageSize)
		let orderList = await Order.find()
		this.listOfData = orderList
		this.isLoading = false
	}
	async changeIndex(e) {
		this.pageIndex = e
		await this.getOrders()
	}

	async getUser(e) {
		let User = new Parse.Query('_User')
		User.equalTo('company', this.company)
		User.equalTo('type', 'user')
		if (e) {
			User.contains('nickname', e)
			User.contains('mobile', e)
		}
		User.select('mobile', 'nickname')
		User.limit(20)
		let users = await User.find()
		console.log(users)
		this.users = users
	}

	async getStore(e) {
		let ShopStore = new Parse.Query('ShopStore')
		ShopStore.equalTo('company', this.company)

		if (e) {
			ShopStore.contains('storeName', e)
		}
		ShopStore.select('storeName')
		ShopStore.limit(20)
		let stores = await ShopStore.find()
		console.log(stores)
		this.stores = stores
	}

	changeUser(e) {
		console.log(e)
		this.userid = e
	}

	changeStore(e) {
		console.log(e)
		this.storeid = e
	}

	async search() {
		await this.getOrders()
	}
	currentOrder: any
	isVisible: boolean = false
	ChangeData(e, data) {
		console.log(e, data)
		this.currentOrder = data.toJSON()
		this.isVisible = true
	}

	handleCancel(): void {
		this.isVisible = false;
		if (!this.isVisible) {
			this.currentOrder = null;
		}
	}

	async handleOk() {
		console.log(this.currentOrder)
		let Order = new Parse.Query("Order");
		let updateOrder = await Order.get(this.currentOrder.objectId)
		if (this.currentOrder.shipper || this.currentOrder.trackingNumber) {
			updateOrder.set('shipper', this.currentOrder.shipper);
			updateOrder.set('trackingNumber', this.currentOrder.trackingNumber);
			if (Number(this.currentOrder.status) < 400) {
				updateOrder.set('status', '300');
			}
		}

		let newData = await updateOrder.save();
		console.log(this, newData)
		this.isVisible = false;
		this.currentOrder = null;
	}
	async retunOk() {
		let Order = new Parse.Query("Order");
		let updateOrder = await Order.get(this.currentOrder.objectId)
		updateOrder.set('status', this.returnValue);
		let newData = await updateOrder.save();
		this.isReturn = false
		this.currentOrder = null;
	}

	returnCancel() {
		this.isReturn = false
		this.currentOrder = null;
		this.returnValue = '601'
	}

	showSpec(spec) {
		if (spec) {
			let objArr = Object.keys(spec)
			let title = ''
			if (objArr && objArr.length > 0) {
				objArr.forEach((obj, index) => {
					if (objArr.length == index + 1) {
						title += obj + ":" + spec[obj].value
					} else {
						title += obj + ":" + spec[obj].value + '/'
					}
				})
			}
			return title
		} else {
			return "暂无"
		}
	}

	getStatus(status) {
		let statusTxt = ''
		switch (status) {
			case '100':
				statusTxt = '待付款'
				break;
			case '200':
				statusTxt = '待发货'
				break;
			case '300':
				statusTxt = '待收货'
				break;
			case '400':
				statusTxt = '待评价'
				break;
			case '500':
				statusTxt = '退款申请中'
				break;
			case '601':
				statusTxt = '申请通过'
				break;
			case '602':
				statusTxt = '申请被驳回'
				break;
			case '700':
				statusTxt = '退款完成'
				break;
			case '800':
				statusTxt = '已完成'
				break;
			default:
				break;
		}
		return statusTxt
	}
	getColor(status) {
		let color = '#000'
		switch (status) {
			case '100':
				color = '#000'
				break;
			case '200':
				color = '#339999'
				break;
			case '300':
				color = '#99CCFF'
				break;
			case '400':
				color = '##3399CC'
				break;
			case '500':
				color = '#CC3333'
				break;
			case '601':
				color = '#CC6666'
				break;
			case '602':
				color = '#663333'
				break;
			case '700':
				color = '#993333'
				break;
			case '800':
				color = '#6666FF'
				break;
			default:
				break;
		}
		return color
	}

	dealReturn(e, data) {
		this.isReturn = true
		this.currentOrder = data.toJSON()
	}

	dealBack(e, data) {
		console.log(e, data)
		this.currentOrder = data.toJSON()
		this.isBack = true
	}

	backCancel() {
		this.isBack = false
		this.currentOrder = null
	}

	async backOk() {
		let Order = new Parse.Query("Order");
		let updateOrder = await Order.get(this.currentOrder.objectId)
		updateOrder.set('status', '700');
		let newData = await updateOrder.save();
		this.isReturn = false
		this.currentOrder = null;
		this.isBack = false
		this.currentOrder = null
		if(this.currentOrder.payType == 'balance'){
			let AccountLog = new Parse.Query('AccountLog')
			AccountLog.equalTo('company', this.company)
			AccountLog.equalTo('orderNumber', this.currentOrder.orderNum)
			let log = await AccountLog.first()
			if(log && log.get('isVerified')){
				log.set('isVerified', false)
				log.set('isback', true)
				await log.save()
			}
		}

		if(this.currentOrder.payType == 'wxpay'){
			
		}
	}

}
