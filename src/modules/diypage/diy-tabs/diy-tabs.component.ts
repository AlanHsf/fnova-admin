import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as Parse from 'parse'
@Component({
  selector: 'app-diy-tabs',
  templateUrl: './diy-tabs.component.html',
  styleUrls: ['./diy-tabs.component.scss']
})
export class DiyTabsComponent implements OnInit {

    @Input("block") block: any
    @Output("block") onBlockChange = new EventEmitter<any>();
    @Input('index') index: any
    @Output() delete = new EventEmitter<any>()
    editType:string = 'style'
    constructor() { }

    ngOnInit() {
        console.log(this.block)        
    }
    
    options = []
    async changeclassName(e) {
        let company = localStorage.getItem('company')
        let Schame = new Parse.Query(e)
        Schame.equalTo('company', company)
        Schame.descending('createdAt')
        Schame.limit(10)
        let Objects = await  Schame.find()
        if(Objects && Objects.length > 0) {
            this.options = Objects
        }
        console.log(this.options)
    }

    deleteBlock() {
        this.delete.emit(this.index)
    }
    typeChange(e) {
        this.editType = e
    }

    async searchPointer(e,item) {
        let company = localStorage.getItem('company')
        let Schame = new Parse.Query(item.className)
        Schame.equalTo('company', company)
        Schame.descending('createdAt')
        if(e) {
            if(item.className == 'ShopGoods'){
                Schame.equalTo('name', e)
            }else {
                Schame.equalTo('title', e)
            }
        }
        
        Schame.limit(10)
        let Objects = await  Schame.find()
        if(Objects && Objects.length > 0) {
            this.options = Objects
        }
    }

    changeObject(e, item) {
        // item.name: e
        console.log(e, item)
        item.objectId = e.get('objectId')
        if(item.className == 'ShopGoods') {
            item.name = e.get('name')
        }else {
            item.name = e.get('title')
        }
    }

}
