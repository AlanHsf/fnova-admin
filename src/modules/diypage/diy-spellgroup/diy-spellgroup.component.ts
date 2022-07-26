import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import * as Parse from 'parse'
import { DiypageService } from '../diypage.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from "@angular/router";
@Component({
    selector: 'app-diy-spellgroup',
    templateUrl: './diy-spellgroup.component.html',
    styleUrls: ['./diy-spellgroup.component.scss']
})
export class DiySpellgroupComponent implements OnInit {
    @Input("block") block: any
    @Output("block") onBlockChange = new EventEmitter<any>();
    @Input('index') index: any
    @Input('type') type: string
    @Output() delete = new EventEmitter<any>()
    editType: string = 'style'
    constructor(
        public cdRef: ChangeDetectorRef,
        public diypageServ: DiypageService,
        private message: NzMessageService) { }
    async ngOnInit() {
       await this.initData()
    }
    async initData() {
        await this.initSource()
    }

    async initSource() {
        let list = await this.diypageServ.initSource(this.block)
        if (list.length) {
            this.block.data.list = []
            list.forEach((goods, index) => {
                console.log(goods)
                let item = null
                let now:any = new Date()
                item = {
                    image: goods.get('goods').get('image'), 
                    name: goods.get('goods').get('name'),
                    desc: goods.get('goods').get('desc'),
                    price: goods.get('price'), //折扣价
                    original: goods.get('goods').get('price'), //原价
                    people: goods.get('people'),
                    total: goods.get('goods').get('total'),
                    time: goods.get('endTime')
                }
                this.block.data.list.push(item)
                console.log(this.block.data.list);
            })
        }
    }

    templateChange(e) {
        this.block.style.groupMargin = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        }
        this.block.style.groupPadding = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        }
        switch (e) {
            case "template2":
                this.block.style.groupWidth = 49
                break;
            case "template3":
                this.block.style.groupWidth = 33
                break;
            case "template6":
                this.block.style.groupWidth = 40
                break;
            default:
                this.block.style.groupWidth = 100
                break;
        }
        
    }

    deleteBlock() {
        this.delete.emit(this.index)
    }

    typeChange(e) {
        this.editType = e
    }


    objectMap(item) {
        if(item) {
            return Object.keys(item)
        }
    }
    saveFilter() {
        this.initSource()
    }

}
