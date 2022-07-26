import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import * as Parse from 'parse';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'app-edit-diytabs',
    templateUrl: './edit-diytabs.component.html',
    styleUrls: ['./edit-diytabs.component.scss']
})
export class EditDiytabsComponent implements OnInit {

    constructor(private activatedRoute: ActivatedRoute, private message: NzMessageService,) { }
    tabOption:any = {
        list: [
            {
                open: true,
                text: "",
                method: "redirectTo",
                iconPath: "",
                pagePath: "",
                selectedIconPath: ""
            },
            {
                info: true,
                open: true,
                text: "",
                method: "redirectTo",
                iconPath: "",
                pagePath: "",
                selectedIconPath: ""
            },
            {
                info: true,
                open: true,
                text: "",
                method: "redirectTo",
                iconPath: "",
                pagePath: "",
                selectedIconPath: ""
            }
        ],
        

        activeColor: "#009de1",
        inactiveColor: "#000000",
        borderStyle: "",
        backgroundColor: ""
    }
    urlList: any = [
        {
            name: "分类商城",
            url:'/nova-shop/pages/shop-cate/index'
        }
    ]
    tabId: string = ""
    tab:Object = null
    currentIndex:number = null
    currentPagepath:string = ''
    ngOnInit() {
        this.activatedRoute.paramMap.subscribe(async params => {
            let tabid = params.get('PobjectId')
            this.tabId = tabid
            await this.queryDiyTabs()
            await this.getPage()
        }) 
    }
    async queryDiyTabs() {
        let DiyTabs = new Parse.Query('DiyTabs')
        console.log(this.tabId)
        let tab = await DiyTabs.get(this.tabId)
        if(tab && tab.id) {
            this.tab = tab
            if(tab.get('options') && tab.get('options') != {}) {
                this.tabOption = tab.get('options')
            }
            console.log(this.tabOption)
        }
    }
    addOption(list) {
        console.log(list.length)
        if(list.length >= 5) {
            this.message.create("error", "最多可创建五个Tab");
            return
        } else{
            this.tabOption.list.push({
                    info: true,
                    open: true,
                    text: "",
                    method: "redirectTo",
                    iconPath: "",
                    pagePath: "",
                    selectedIconPath: ""
                })
        }
    }
    switchChange(event, index) {
        this.tabOption.list[index].open = event
        console.log(this.tabOption.list)
    }

    async saveOption() {
        let DiyTabs = new Parse.Query('DiyTabs')
        let tab = await DiyTabs.get(this.tabId)
        if(tab && tab.id) {
            tab.set('options', this.tabOption)
            await tab.save()
            this.message.create("success", "保存成功");
        }

    }

    delete(index) {
        this.tabOption.list.splice(index, 1)
        console.log(this.tabOption)
    }

    isVisible:boolean  = false
     async editUrl(i, data) {
        console.log(i, data)
        this.currentIndex = i
        this.isVisible = true
        
    }

    async getPage(){
        let company = localStorage.getItem('company')
        let DiyPage = new Parse.Query('DiyPage')
        DiyPage.equalTo('company', company)
        DiyPage.select('name')
        let pages = await DiyPage.find()
        if(pages && pages.length > 0) {
            pages.forEach(p => {
                let url = {
                    name: p.get('name'),
                    url: '/nova-diypage?id=' + p.id
                }
                this.urlList.push(url)
            })   
        }
    }
    handleCancel(){
        this.isVisible = false
        this.currentIndex = null
        this.currentPagepath = null
    }

    handleOk() {
        if(this.currentPagepath){
            this.tabOption.list[this.currentIndex].pagePath = this.currentPagepath
        }
        this.currentIndex = null
        this.currentPagepath = null
        this.isVisible = false
    }
    changeUrl(item) {
        console.log(item)
        this.currentPagepath = item.url
    }

}
