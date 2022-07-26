import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import * as Parse from 'parse'

@Component({
    selector: 'app-diy-video',
    templateUrl: './diy-video.component.html',
    styleUrls: ['./diy-video.component.scss']
})
export class DiyVideoComponent implements OnInit {
    @Input("block") block: any
    @Output("block") onBlockChange = new EventEmitter<any>();
    @Input('index') index: any
    @Input("type") type: string;
    @Output() delete = new EventEmitter<any>()
    editType: string = 'style'
    constructor(public cdRef: ChangeDetectorRef) { }

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
        let Objects = await Schame.find()
        if (Objects && Objects.length > 0) {
            this.options = Objects
        }
        console.log(this.options)
    }

    addIcon() {
        if (this.block.data.src == 'list') {
            this.block.data.list.push({
                video:
                    "https://baikevideo.cdn.bcebos.com/media/mda-OfXttXY16SVdPBHF/11793c9f31e98f7b737e7e7030adca62.mp4",
                image:
                    "https://file-cloud.fmode.cn/O64wHWNFcf/20220115/1li0pv110456.png",
                title: "视频标题",
                desc: "这里是视频简介",
            })
        }
    }
    onDelete(i) {
        let list = this.block.data.list
        list.splice(i, 1)
        this.block.data.list = list
    }

    deleteBlock() {
        this.delete.emit(this.index)
    }

    columnChange(e) {
        console.log(e);
    }
    typeChange(e) {
        this.editType = e
    }
    reset(field, type) {
        switch (type) {
            case "color":
                this.block.style[field] = "";
                break;
            case "borderradius":
                this.block.style[field] = 0;
                break;
            case "areaMargin":
                this.block.style[field] = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                };
                break;
            case "margin":
                this.block.style[field] = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                };
                break;
            case "padding":
                this.block.style[field] = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                };
                break;
            default:
                break;
        }
    }

    async searchPointer(e, item) {
        let company = localStorage.getItem('company')
        let Schame = new Parse.Query(item.className)
        Schame.equalTo('company', company)
        Schame.descending('createdAt')
        if (e) {
            if (item.className == 'ShopGoods') {
                Schame.equalTo('name', e)
            } else {
                Schame.equalTo('title', e)
            }
        }

        Schame.limit(10)
        let Objects = await Schame.find()
        if (Objects && Objects.length > 0) {
            this.options = Objects
        }
    }

    changeObject(e, item) {
        // item.name: e
        console.log(e, item)
        item.objectId = e.get('objectId')
        if (item.className == 'ShopGoods') {
            item.name = e.get('name')
        } else {
            item.name = e.get('title')
        }
    }

}
