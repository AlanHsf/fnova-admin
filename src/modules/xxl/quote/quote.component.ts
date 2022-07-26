import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Parse from "parse";
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
	selector: 'app-quote',
	templateUrl: './quote.component.html',
	styleUrls: ['./quote.component.scss']
})
export class QuoteComponent implements OnInit {

	constructor(private http: HttpClient, private message: NzMessageService, private activRoute: ActivatedRoute, private nzMessageService: NzMessageService, private router: Router,) { }
	id: string = ""
	company: string = '';
	order: any = {}
	list: any = []
	material: any = []
  area:number = 0
	listJSON: any = []
	mList: any = []
	ngOnInit(): void {
		this.company = localStorage.getItem('company')
		this.activRoute.paramMap.subscribe((params) => {
			this.id = params.get("PobjectId")
			console.log(this.id);
		})
		this.getDecorateOrder()

	}
	async getDecorateOrder() {
		let DecorateOrder = new Parse.Query("DecorateOrder");
		DecorateOrder.include('user')
		DecorateOrder.include('material')
		let decorateOrder = await DecorateOrder.get(this.id)
		this.order = decorateOrder.toJSON()
    this.area = this.order.insideArea
		console.log(this.order);
	}


  async changeOpen(data) {
    let Material = new Parse.Query('Material')
    Material.equalTo('category',data.cid)
    let mList = await Material.find()
    this.mList = mList
  }
  materialData = []
  async changeMaterial(e, i) {
    let Material = new Parse.Query('Material')
    let material = await Material.get(e)
    //let price = Number((this.order.insideArea * material.get('priceUnit') *  material.get('coefficient')).toFixed(2))
    //let count = Number((this.order.insideArea * material.get('usageUnit')).toFixed(2))
    if(material) {
      this.order.materialData[i].mid = e
      this.order.materialData[i].material = material.get('name')
      this.materialData[i] = material
      console.log(this.order)
    }
  }

	imgUrl:string = ''
	imgShowing:boolean = false
	showFile(file) {
		this.imgUrl = file;
		this.imgShowing = true;
	}
  confirm:boolean = false
  reQuote() {
    this.confirm = true
  }

  handleCancel() {
    this.confirm = false
  }
  async handleOk() {
    console.log(this.materialData)
    let materialPrice =  0
    this.order.materialData.forEach((data, index) => {
      if(this.materialData[index]) {
        data.price = Number((this.order.insideArea * this.materialData[index].get('priceUnit') *  this.materialData[index].get('coefficient')).toFixed(2))
        data.count = Number((this.order.insideArea * this.materialData[index].get('usageUnit')).toFixed(2))
        materialPrice += data.price
      }else {
        data.price = Number(data.price) * (this.order.insideArea/this.area)
        materialPrice += data.price
      }
    })




    let workingPrice = 0
    this.order.quantities.forEach((data) => {
      data.price = Number((this.order.insideArea * data.unitPrice).toFixed(2))
      workingPrice += data.price
    })
    console.log(this.order)
    let DecorateOrder = new Parse.Query('DecorateOrder')
    let order = await DecorateOrder.get(this.order.objectId)
    console.log(order)
    order.set('insideArea', this.order.insideArea )
    order.set('area', this.order.area )
    order.set('materialPrice', materialPrice )
    order.set('workingPrice', workingPrice )
    order.set('totalPrice', workingPrice + materialPrice  )
    order.set('quantities', this.order.quantities )
    order.set('materialData', this.order.materialData )
    let updateMaterial = await  order.save()
    if(updateMaterial) {
      this.message.create('success', `重新报价成功`);
      await this.getDecorateOrder()
      this.confirm = false
    }else {
      this.message.create('error', `重新报价失败`);
      await this.getDecorateOrder()
    }

  }


}

