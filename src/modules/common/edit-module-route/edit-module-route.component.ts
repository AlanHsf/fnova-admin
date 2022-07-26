import * as Parse from "parse";

import { Input, Output, EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from "@angular/core"

@Component({
    selector: 'edit-module-route',
    templateUrl: './edit-module-route.component.html',
    styleUrls: ['./edit-module-route.component.scss']
})
export class EditModuleRouteComponent implements OnInit {
    @Input("modules") modules: any = [];
    @Output("modulesChange") onModulesChange = new EventEmitter<any>(true);
    @Input("routes") routes: any = null;
    @Output("routesChange") onRoutesChange = new EventEmitter<any>(true);

    taskList: Array<any> = [];
    taskMap = {
        depart: [],
        departRefer: [],
        branch: [],
        leader: [],
    }

    countMap = {};

    showCount(type) {
        switch (type) {
            case "all":
                return Object.keys(this.RoutesEnabledMap).length;
                break;
            default:
                return this.countMap[type] ? this.countMap[type].length : 0
                break;
        }
    }

    formatterPercent = (value: number) => value;
    parserPercent = (value: string) => value;
    constructor(
        private cdRef: ChangeDetectorRef,
    ) {

    }

    ngOnInit() {
        console.log(this.modules)
    }
    changeTab(ev) {
    }

    isVisible = false;

    ModulesEnabledMap = {};
    RoutesEnabledMap = {};
    ModulesMap = {};
    routeMap = {}

    ModulesArray = [];
    async showModal() {
        this.ModulesArray = []
        let companyId = localStorage.getItem('company')
        let Company = new Parse.Query('Company')
        Company.include('devModule')
        Company.include('module')
        let company = await Company.get(companyId)
        if (company && company.id) {
            // 公司的授权模块
            let modules = company.get('devModule')
            this.ModulesArray = modules
            console.log(this.ModulesArray)
            this.ModulesArray.forEach((mitem, index) => {
                mitem.index = index + 1
                this.ModulesMap[mitem.id] = mitem;
                this.ModulesEnabledMap[mitem && mitem.objectId] = true;
            })
        }
        if (this.modules) {
            this.modules.forEach(mitem => {
                if(mitem && mitem.objectId ) {
                    this.ModulesEnabledMap[mitem && mitem.objectId] = true;
                }else {
                    console.log(mitem)
                    this.ModulesEnabledMap[mitem && mitem.id] = true;
                }
            })
        }
        if (this.routes) {
            this.routes.forEach(mitem => {
                if(mitem && mitem.objectId ) { 
                    this.RoutesEnabledMap[mitem && mitem.objectId] = true;
                }else {
                    this.RoutesEnabledMap[mitem && mitem.id] = true;
                }
                
            })
        }
        console.log(this.ModulesEnabledMap)
        this.isVisible = true;
    }

    handleCancel() {
        this.isVisible = false;
    }
    getModuleId(module) {
        return (module && module.id) || (module && module.objectId)
    }
    getRouteId(route) {
        return (route && route.id) || (route && route.objectId)
    }

    async updateModules(id) {
        console.log(id)
        if(!this.modules || (this.modules &&  this.modules.length == 0)) {
            this.modules = []
        }
         Object.keys(this.ModulesEnabledMap).map((objectId, i) => {
            if (this.ModulesEnabledMap[objectId] == true && id == objectId) {
                this.modules.push({
                    __type: "Pointer",
                    className: "DevModule",
                    objectId: objectId
                }) 
            }
            if(this.ModulesEnabledMap[objectId] == false && id == objectId) {
                this.modules.forEach((m, i) => {
                    if(m.objectId == id) {
                        this.modules.splice(i,1)
                    }
                })
            }
        })

        this.modules = this.modules.filter(item => {
            if (item && item.objectId != "undefined") {
                return item && item.objectId
            }
        })
        console.log(this.modules)
        this.cdRef.detectChanges();
    }
    async updateRoutes() {
        this.countMap = {}
        this.routes = Object.keys(this.RoutesEnabledMap).map(objectId => {
            if (this.RoutesEnabledMap[objectId] == true) {
                return {
                    __type: "Pointer",
                    className: "DevRoute",
                    objectId: objectId
                }
            }
        })
        this.routes = this.routes.filter(item => {
            if (item && item.objectId != "undefined") {
                return item
            }
        })
    }
    async loadModuleRoutes(mid) {
        let query = new Parse.Query("DevRoute");
        query.equalTo("module", mid);
        this.routeMap[mid] = await query.find();
        this.cdRef.detectChanges();
    }
    saveRules() {
        this.onModulesChange.emit(this.modules);
        this.onRoutesChange.emit(this.routes);

        // this.rulesChange.emit(this.rules);
        // this.countChange.emit(this.showCount('all'));
        this.isVisible = false;
        // this.currentProfile = null;
        // this.currentRight = 0.5
        this.isAdd = false
    }

    addExclude(rule, item) {
    }
    delExclude(item) {

    }

    // 新用户补录方法
    isAdd = false;
    currentProfile: any;
    currentRight: any = 0.5;
    selectPointerList = [];
    searchPointer(ev) {
    }
    showAddModal(): void {
        alert('暂未开放')
        this.currentProfile = undefined;
        this.isAdd = true;
    }
    delInclude(profile) {

    }
    inShow = true;
    getIncludeRule() {

    }
    addNewProfile(rule) {

    }


}
