import { Component, OnInit, ViewChild } from "@angular/core";
import { ChangeDetectorRef } from "@angular/core";
import * as XLSX from "xlsx";
import { HttpClient } from "@angular/common/http";
import * as Parse from "parse";
import "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { ColumnApi, GridApi, QuerySelector } from "ag-grid-community";
import { Router, ActivatedRoute } from "@angular/router";
import { count, profile } from "console";
import { query } from "@angular/animations";
import { NzModalService } from "ng-zorro-antd/modal";

@Component({
    selector: "app-import-recharge",
    templateUrl: "./import-recharge.component.html",
    styleUrls: ["./import-recharge.component.scss"]
})
export class ImportRechargeComponent implements OnInit {
    constructor(public cdRef: ChangeDetectorRef) { }
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
        minWidth: 100
    };
    public columnTypes;
    public defaultColGroupDef;
    public topOptions = {
        suppressHorizontalScroll: false
    };
    groupHeaderHeight: any;
    headerHeight: any;
    floatingFiltersHeight: any;
    pivotGroupHeaderHeight: any;
    pivotHeaderHeight: any;
    gridApi;
    gridColumnApi;
    objectIdMap: any = []; // 存每一条数据的Pointer指针的objectId
    require: any = [];
    ngOnInit() {
        this.require = [
            {
                headerName: "学员学号",
                field: "学员学号",
                other: "studentID",
                type: "String"
            },
            {
                headerName: "学员姓名",
                field: "学员姓名",
                other: "name",
                type: "String"
            },
            {
                headerName: "身份证号",
                field: "身份证号",
                other: "idCard",
                type: "String"
            },
            {
                headerName: "应交学费",
                field: "应交学费",
                other: "tuitionFee",
                type: "Number"
            },
            {
                headerName: "已交学费",
                field: "已交学费",
                other: "yetTuitionFee",
                type: "Number"
            },
            {
                headerName: "应交服务费",
                field: "应交服务费",
                other: "serviceFee",
                type: "Number"
            },
            {
                headerName: "已交服务费",
                field: "已交服务费",
                other: "yetServiceFee",
                type: "Number"
            },
            {
                headerName: "应交论文费",
                field: "应交论文费",
                other: "paperFee",
                type: "Number"
            },
            {
                headerName: "已交论文费",
                field: "已交论文费",
                other: "yetPaperFee",
                type: "Number"
            },
            {
                headerName: "总费用",
                field: "总费用",
                other: "totalFee",
                type: "Number"
            },
            {
                headerName: "缴费时间",
                field: "缴费时间",
                other: "payTime",
                type: "String"
            },
            {
                headerName: "是否返款",
                field: "是否返款",
                other: "isBack",
                type: "Boolean"
            },
            {
                headerName: "返款金额",
                field: "返款金额",
                other: "backCount",
                type: "Number"
            },
            {
                headerName: "是否需要开票",
                field: "是否需要开票",
                other: "isBilling",
                type: "Boolean"
            },
            {
                headerName: "是否全款",
                field: "是否全款",
                other: "isFull",
                type: "Boolean"
            },
            {
                headerName: "开票抬头",
                field: "开票抬头",
                other: "invoiceTitle",
                type: "String"
            },
            {
                headerName: "税号",
                field: "税号",
                other: "ein",
                type: "String"
            },
            {
                headerName: "应上交学费金额",
                field: "应上交学费金额",
                other: "shouldTuition",
                type: "Number"
            },
            {
                headerName: "已上交学费金额",
                field: "已上交学费金额",
                other: "yetTuition",
                type: "Number"
            },

            {
                headerName: "欠费金额",
                field: "欠费金额",
                other: "dueAmount",
                type: "Number"
            }

        ];
        this.columnDefs = [
            {
                headerName: "必填项(缴费信息)",
                children: this.require
            }
        ];
        let tem = {};
        this.require.forEach(data => {
            tem[data.field] = "暂无";
        });
        this.rowData = [tem];
        this.groupHeaderHeight = 40;
        this.headerHeight = 40;
        this.floatingFiltersHeight = 40;
        this.pivotGroupHeaderHeight = 50;
        this.pivotHeaderHeight = 100;
    }



    // 文件拖拽
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
        [3, 4]
    ];
    // 选择文件
    async onFileChange(evt: any) {
        /* wire up file reader */
        let target: DataTransfer = <DataTransfer>evt.dataTransfer,
            data: any;
        if (!target) {
            target = <DataTransfer>evt.target;
        }
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
                { headerName: "导入项", children: columnDefs }
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


    // ag-grid 生命周期
    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }
    exportData() {
        this.gridApi.exportDataAsExcel();
    }

    isImport: boolean = false;
    isDealData: boolean = false;
    dataMap: any = [];
    async getOnjectIdMap(datas) {
        // 对数据的处理，以及错误查询
        this.isDealData = true
        console.log(datas)
        datas.forEach((data, index) => {
            let map: any = {};
            let name = data['学员姓名'] ? data['学员姓名'].trim() : "";
            let idcard = data['身份证号'] ? data['身份证号'].trim() : "";
            if (name && idcard) {
                let Profile = new Parse.Query('Profile')
                console.log(data['学员姓名'], data['身份证号'])
                Profile.equalTo('name', data['学员姓名'])
                Profile.equalTo('idcard', data['身份证号'])
                Profile.equalTo('company', "pPZbxElQQo")
                Profile.first().then(res => {
                    console.log(res)
                    if (res && res.id) {
                        map.rid = res.id
                    } else {
                        map.rid = null
                    }
                    this.dataMap[index] = map;
                    console.log(this.dataMap)
                    if (this.dataMap.length == datas.length) {
                        setTimeout(() => {
                            this.isImport = true;
                            this.isDealData = false
                        }, 3000)
                    }
                })
            }
        });
        this.rowData = datas
    }
    isVisible: boolean = false
    // 保存到数据库
    count: number = 0;  // 导入成功的条数

    successData: any = [] // 导入成功的数据
    errCount: number = 0  // 未导入成功的条数
    isVisible2: boolean = false
    async saveLine() {
        this.isVisible = true
        for (let j = 0; j < this.rowData.length; j++) {
            console.log(this.rowData[j]["身份证号"],
                this.rowData[j]["学员姓名"])
            if (this.dataMap[j].rid) {  // 有profile
                let ProfileRecharge: any = await this.getProfileRecharge(
                    this.rowData[j]["身份证号"],
                    this.rowData[j]["学员姓名"],
                    this.dataMap[j].rid
                );
                for (let i = 0; i < this.columnDefs[0].children.length; i++) {
                    if (this.columnDefs[0].children[i].type == "String") {
                        if (this.rowData[j][this.columnDefs[0].children[i].field]) {
                            ProfileRecharge.set(
                                this.columnDefs[0].children[i].other,
                                this.rowData[j][this.columnDefs[0].children[i].field].trim()
                            );
                        }

                    }

                    if (this.columnDefs[0].children[i].type == "Number") {
                        if (this.rowData[j][this.columnDefs[0].children[i].field]) {
                            ProfileRecharge.set(
                                this.columnDefs[0].children[i].other,
                                Number(this.rowData[j][this.columnDefs[0].children[i].field].trim()));
                        }
                    }

                    if (this.columnDefs[0].children[i].type == "Boolean") {
                        if (this.rowData[j][this.columnDefs[0].children[i].field] && this.rowData[j][this.columnDefs[0].children[i].field].trim() == '是') {
                            ProfileRecharge.set(this.columnDefs[0].children[i].other, true);
                        } else {
                            ProfileRecharge.set(this.columnDefs[0].children[i].other, false);
                        }
                    }
                }
                ProfileRecharge.set('profile', {
                    __type: 'Pointer',
                    className: 'Profile',
                    objectId: this.dataMap[j].rid
                })
                let pr = await ProfileRecharge.save()
                if (pr && pr.id) {
                    console.log(pr)
                    this.count += 1
                    this.successData.push({ id: pr.id, idcard: pr.get('idCard'), name: pr.get('name') });
                    if ((this.count + this.errCount) == this.rowData.length) {
                        this.isVisible2 = true
                        this.compareData()
                        setTimeout(res => {
                            this.isVisible = false
                            this.isImport = false;
                        }, 1000)
                    }
                } else { // 保存失败
                    this.errCount += 1
                    if ((this.count + this.errCount) == this.rowData.length) {
                        this.isVisible2 = true
                        this.compareData()
                        setTimeout(res => {
                            this.isVisible = false
                            this.isImport = false;
                        }, 1000)
                    }
                    continue
                }
            } else {  // Profile 查不到
                this.errCount += 1
                if ((this.count + this.errCount) == this.rowData.length) {
                    this.isVisible2 = true
                    this.compareData()
                    setTimeout(res => {
                        this.isVisible = false
                        this.isImport = false;
                    }, 1000)
                }
            }
        }
    }
    async getProfileRecharge(idcard, name, id) {
        return new Promise(async (resolve, reject) => {
            let Profile = new Parse.Query("ProfileRecharge");
            Profile.equalTo("idCard", idcard.trim());
            Profile.equalTo("name", name.trim());
            Profile.equalTo("profile", id);
            // Profile.equalTo("SchoolMajor", major);
            let profile = await Profile.first();
            if (profile && profile.id) {
                resolve(profile);
            } else {
                let P = Parse.Object.extend("ProfileRecharge");
                let p = new P();
                p.set("company", {
                    __type: "Pointer",
                    className: "Company",
                    objectId: "pPZbxElQQo"
                });
                resolve(p);
            }
        });
    }


    errData: any = []
    async compareData() {
        var set = this.successData.map(item => item['idcard'])
        console.log(set)
        var resArr = this.rowData.filter(item => !set.includes(item['身份证号']))
        console.log(resArr)
        if (resArr == []) {
            this.errData = resArr
        } else {
            this.isVisible = false;
            console.log('重新上传');
            this.errData = resArr
            this.rowData = resArr
        }
    }

    handleCancel() {
        this.isVisible2 = false;
    }
}
