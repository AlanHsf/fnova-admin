import { Component, OnInit } from "@angular/core";
import { ChangeDetectorRef } from "@angular/core";
import * as XLSX from "xlsx";
import * as Parse from "parse";
import "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { ColumnApi, GridApi, QuerySelector } from "ag-grid-community";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
  selector: "app-import-stock",
  templateUrl: "./import-stock.component.html",
  styleUrls: ["./import-stock.component.scss"],
})
export class ImportStockComponent implements OnInit {
  constructor(
    public cdRef: ChangeDetectorRef,
    private message: NzMessageService
  ) {}
  public api: GridApi;
  public columnApi: ColumnApi;

  public sideBar: true;
  public rowData: any = [];
  public columnDefs: any = [];
  public rowCount: string;
  public defaultColDef: any = {
    editable: true, //单元表格是否可编辑
    enableRowGroup: true, // 允许分组
    enablePivot: true,
    enableValue: true,
    sortable: true, //开启排序
    resizable: true, //是否可以调整列大小，就是拖动改变列大小
    // filter: true, //开启刷选
    filter: "agTextColumnFilter",
    floatingFilter: true, // 显示过滤栏
    flex: 1,
    minWidth: 100,
  };
  public columnTypes;
  public defaultColGroupDef;
  public topOptions = {
    suppressHorizontalScroll: false,
  };
  groupHeaderHeight: any;
  headerHeight: any;
  floatingFiltersHeight: any;
  pivotGroupHeaderHeight: any;
  pivotHeaderHeight: any;
  objectIdMap: any = []; // 存每一条数据的Pointer指针的objectId

  	require: any = [
		{
			headerName: "用户手机号",
			field: "用户手机号",
			other: "mobile",
			type: "Pointer",
			targetClass: "_User",
		},
		{
			headerName: "商品标题",
			field: "商品标题",
			other: "title",
			type: "String",
		},
		{
			headerName: "订单ID",
			field: "商品标题",
			other: "orderID",
			type: "String",
    	},
    	{
			headerName: "期数",
			field: "期数",
			other: "term",
			type: "Number",
    	},
    	{
			headerName: "铺机数量",
			field: "铺机数量",
			other: "count",
			type: "Number",
    	},
    	{
      		headerName: "订单总租金",
      		field: "订单总租金",
      		other: "totalPrice",
      		type: "Number",
    	},
  	];
  	company: any = "";
  	ngOnInit() {
    	this.company = localStorage.getItem("company");
    	this.groupHeaderHeight = 40;
    	this.headerHeight = 40;
    	this.floatingFiltersHeight = 40;
    	this.pivotGroupHeaderHeight = 50;
    	this.pivotHeaderHeight = 100;
		
    	let tem = {};
    	this.require.forEach((data) => {
      		tem[data.field] = "暂无";
    	});
    	this.columnDefs = [
      		{
        		headerName: "必填项(铺机记录)",
        		children: this.require,
      		},
    	];
    	this.rowData = [tem];
  	}

  	handleDropOver(e, over) {
    	e.preventDefault();
    	e.stopPropagation();
  	}

  // over之后执行
  	handleDrop(e) {
    	e.preventDefault();
    	e.stopPropagation();
    	console.log(e);
    	this.onFileChange(e);
  	}
	data: any = [
		[1, 2],
		[3, 4],
	];
  // 选择文件
  	async onFileChange(evt: any) {
    	/* wire up file reader */
    	let target: DataTransfer = <DataTransfer>evt.dataTransfer,
    	data: any;
    	if (!target) {
      		target = <DataTransfer>evt.target;
    	}
    	console.log(target);
    	if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    	const reader: FileReader = new FileReader();
    	console.log(reader);
    	reader.onload = (e: any) => {
      		const bstr: string = e.target.result;
      		const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
      		const wsname: string = wb.SheetNames[0];
      		const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      		this.data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      		let keyAry = [];
      		// 遍历json对象，获取每一列的键名 表头
      		for (let key in this.data[1]) {
        		keyAry.push(key);
      		}
      		let columnDefs: any = [];
			keyAry.forEach((element, index) => {
				columnDefs.push({ headerName: element, field: element });
			});

      	this.columnDefs = [
        	...this.columnDefs,
        	{ headerName: "导入项", children: columnDefs },
      	];
      // 处理导入的数据
      	this.getOnjectIdMap(this.data);
    	};
    	reader.readAsBinaryString(target.files[0]);
    	let drop = document.getElementById("dropBox");
    	if (this.rowData.length >= 1) {
      		drop.style.display = "none";
    	}
  	}
  	isImport: boolean = false;
  	isDealData: boolean = false;
	async getOnjectIdMap(datas) {
		// 对数据的处理，以及错误查询
		this.isDealData = true;
		datas.forEach((data, index) => {
		let map: any = {};
		this.require.forEach(async (r) => {
			if (!data[r.field]) {
			alert("数据表有未填写的数据，请将数据填写完整");
			return;
			}
			if (r.other == "mobile") {
			let User = new Parse.Query("User");
			User.equalTo("mobile", data[r.field]);
			User.equalTo("company", this.company);
			User.include("invite");
			let user = await User.first();
			if (user && user.id) {
				let shopid = await this.getShopStore(user.id);
				map.userId = user.id;
				map.invite = user.get("invite") ? user.get("invite").id : "";
				map.league =
				(user.get("invite") && user.get("invite").get('userLeague'))
					? user.get("invite").get('userLeague').id
					: "";
				map.inviteMobile = user.get("invite")
				? user.get("invite").get("mobile")
				: "";
				map.shopid = shopid;
			}
			}
		});
		this.objectIdMap[index] = map;
		if (this.objectIdMap.length == datas.length) {
			setTimeout(() => {
			this.isImport = true;
			this.isDealData = false;
			}, 5000);
		}
		});
		console.log(this.objectIdMap)
		this.rowData = datas;
		console.log(this.rowData)
	}
	async getShopStore(uid) {
		let ShopStore = new Parse.Query("ShopStore");
		ShopStore.equalTo("user", uid);
		ShopStore.select("user");
		let shopStore = await ShopStore.first();
		if (shopStore) {
		return shopStore.id;
		}
	}
	// 保存到数据库
	isVisible: boolean = false  // 导入弹窗
	isVisible2: boolean = false
  	count: any = 0
 	errCount:any = 0
	successData: any = []
	errData:any = []
  	async saveLine(end?){
		let count = 0;
		this.isVisible = true
		if(end) {
			this.isVisible = false
			return
		}
		for (let j = 0; j < this.rowData.length; j++) {
			if(this.objectIdMap[j].inviteMobile && this.objectIdMap[j].userId 
				&& this.objectIdMap[j].shopid && this.objectIdMap[j].league  ) {
					let hasLog = await this.queryStockLog(this.objectIdMap[j].userId, this.rowData[j]['订单ID'])
					if(hasLog) {
						this.errCount += 1
						this.errData.push({mobile: this.rowData[j]['用户手机号'], reasen: '该用户在该订单下创建了十二条铺机记录'})
						if ((count +this.errCount) == this.rowData.length) {
							this.isVisible2 = true
							// this.compareData()
							setTimeout(res => {
								this.isVisible = false
								this.isImport = false;
							}, 1000)
						}
						continue
					}
					let UserStockLog = Parse.Object.extend('UserStockLog')
					let userStockLog = new UserStockLog()
					// user mobile，shopStore， userLeagueLevle，count  必填项
					userStockLog.set('mobile',Number(this.objectIdMap[j].inviteMobile))
					userStockLog.set('totalPrice', Number(this.rowData[j]['订单总租金']))
					userStockLog.set('orderID', this.rowData[j]['订单ID'])
					userStockLog.set('term', Number(this.rowData[j]['期数']))
					userStockLog.set('title',this.rowData[j]['标题'])
					userStockLog.set('count',Number(this.rowData[j]['铺机数量']))
					userStockLog.set('isCross', false)
					userStockLog.set('company', {
						__type:"Pointer",
						className:"Company",
						objectId: this.company
					})
					userStockLog.set('user', {
						__type:"Pointer",
						className:"_User",
						objectId: this.objectIdMap[j].userId
					})
					userStockLog.set('invite', {
						__type:"Pointer",
						className:"_User",
						objectId: this.objectIdMap[j].invite
					})
					userStockLog.set('shopStore', {
						__type:"Pointer",
						className:"ShopStore",
						objectId: this.objectIdMap[j].shopid
					})
					userStockLog.set('userLeagueLevel', {
						__type:"Pointer",
						className:"UserLeagueLevel",
						objectId: this.objectIdMap[j].league
					})
					let stockLog =  await userStockLog.save()
					if(stockLog && stockLog.id) {
						count += 1
						this.count = count
						this.successData.push({id: stockLog.id,  mobile: this.rowData[j]['用户手机号'] });
						if ((count +this.errCount) == this.rowData.length) {
							this.isVisible2 = true
							// this.compareData()
							setTimeout(res => {
								this.isVisible = false
								this.isImport = false;
							}, 1000)
						}	
					}else {
						this.errCount += 1
						this.errData.push({mobile: this.rowData[j]['用户手机号'], reason: '服务器繁忙，请重新上传'})
						if ((count +this.errCount) == this.rowData.length) {
							this.isVisible2 = true
							// this.compareData()
							setTimeout(res => {
								this.isVisible = false
								this.isImport = false;
							}, 1000)
						}
					
					} 
			} else{ // 用户有要邀请人，有店铺， 邀请人有userleaguelevel
				this.errCount +=1
				this.errData.push({mobile: this.rowData[j]['用户手机号'], reason:'用户数据不全，请确认用户已在商城注册，绑定邀请人，并且是门店身份'})
                if ((count +this.errCount) == this.rowData.length) {
					this.isVisible2 = true
					setTimeout(res => {
						this.isVisible = false
						this.isImport = false;
					}, 1000)
				}
			}
			continue
		}
		console.log(this.errData)
  	}
	handleCancel(){
		this.isVisible2 = false
	}
	async queryStockLog(userId,orderId){
		// let date = new Date()
		// let year = date.getFullYear()
		// let month = date.getMonth()
		// let timestamp = date.getTime()
		// let newDate = new Date(year, month+1, 0)
		// let days = newDate.getDate()
		// let diff = timestamp + (days * 24 *60 * 60 * 1000)
		// let diffDate = new Date(timestamp-diff)
		let UserStockLog = new Parse.Query('UserStockLog')
		UserStockLog.equalTo('user', userId)
		UserStockLog.equalTo('orderID', orderId)
		let logs = await UserStockLog.find()
		if(logs && logs.length > 11) {
			return true
		} else {
			return false
		}
	}
}
