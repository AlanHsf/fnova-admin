import { Input, Output, EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from "ng-zorro-antd/notification";
import * as Parse from 'parse'

@Component({
	selector: 'app-edit-vip-price',
	templateUrl: './edit-vip-price.component.html',
	styleUrls: ['./edit-vip-price.component.scss']
})
export class EditVipPriceComponent implements OnInit {
	@Input('priceStep') priceStep: any = [];
	@Output('priceStepChange') onStepPriceChange = new EventEmitter<any>();
	constructor(private notification: NzNotificationService,) { }
	// priceStep:any = [
		
	// ]
	async ngOnInit() {
		console.log(this.priceStep)
		let company = localStorage.getItem('company')
		let userAgentLevel = new Parse.Query('UserAgentLevel')
		userAgentLevel.equalTo('company', company)
		userAgentLevel.equalTo('open', true)
		userAgentLevel.ascending("level")
		let agentList = await userAgentLevel.find()
		if(agentList && agentList.length > 0) {
			let priceStep = []
			agentList.forEach((li, i) => {
				let agent = this.priceStep.find(s =>{
					if(li.id == s.agentLevel) {
						return true
					}
				})
				if(agent) {
					priceStep[i] = agent
				}else {
					priceStep[i] = {
						count: null,
						price: 0,
						agentLevel: li.id,
						name: li.get('name')
					}
				}
				
			})
			this.priceStep = priceStep
			console.log(this.priceStep)
		}
	}
	savePrice() {
		this.notification.create(
			"success",
			"保存成功",
			"保存成功"
		);
		console.log(this.priceStep)
		this.onStepPriceChange.emit(this.priceStep)
	}

}
