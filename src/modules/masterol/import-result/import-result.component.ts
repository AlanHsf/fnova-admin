

import { Component, OnInit, ViewChild, ChangeDetectorRef} from "@angular/core";
import * as XLSX from "xlsx";
import * as Parse from "parse";
import "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { ColumnApi, GridApi, QuerySelector } from "ag-grid-community";
import { FindValueSubscriber } from "rxjs/internal/operators/find";

@Component({
    selector: "app-import-result",
    templateUrl: "./import-result.component.html",
    styleUrls: ["./import-result.component.scss"]
})
export class ImportResultComponent implements OnInit {
    constructor() { }
    public api: GridApi;
    public columnApi: ColumnApi;
    public sideBar: true;
    public rowData: any[];
    public columnDefs: any[];
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
    private excelStyles;

    public topOptions = {
        suppressHorizontalScroll: false
    };
    isImport: boolean = false;
    groupHeaderHeight: any;
    headerHeight: any;
    floatingFiltersHeight: any;
    pivotGroupHeaderHeight: any;
    pivotHeaderHeight: any;
    gridApi;
    gridColumnApi;
    ngOnInit() {
        let require = [
            { headerName: "考试年份", field: "考试年份", other: "year", type: "String" },
            { headerName: "学员姓名", field: "学员姓名", other: "name", type: "String" },
            { headerName: "身份证号", field: "身份证号", other: "idcard", type: "String" },
            { headerName: "科目一名称", field: "科目一名称", other: "subjectA", type: "String" },
            { headerName: "科目一成绩", field: "科目一成绩", other: "subjectAGrade", type: "String" },
            {
                headerName: "科目一考试时间", field: "科目一考试时间", other: "subjectATime",
                cellClass: 'dateType', type: "String",
                valueFormatter: function (params) {
                    if (params.value && params.value.indexOf('无') == -1  ) {
                        let dateStr = params.value
                        if (dateStr.indexOf('.') != -1) {
                            dateStr = dateStr.replace(".", '-')
                        }
                        if (dateStr.indexOf('年') != -1) {
                            dateStr = dateStr.replace("年", '-')
                        }
                        if (dateStr.indexOf('月') != -1) {
                            dateStr = dateStr.replace("月", '-')
                        }
                        if (dateStr.indexOf('号') != -1) {
                            dateStr = dateStr.replace("号", '-')
                        }
                        if (dateStr.indexOf('日') != -1) {
                            dateStr = dateStr.replace("日", '-')
                        }
                        let date = new Date(dateStr)
                        let year = date.getFullYear()
                        let month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)
                        let day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()
                        return year + '-' + month + '-' + day
                    } else {
                        return ''
                    }
                }
            },
            { headerName: "科目一合格编号", field: "科目一合格编号", other: "subjectACode" },
            { headerName: "科目二名称", field: "科目二名称", other: "subjectB" },
            { headerName: "科目二成绩", field: "科目二成绩", other: "subjectBGrade" },
            {
                headerName: "科目二考试时间", field: "科目二考试时间", other: "subjectBTime",
                cellClass: 'dateType',
                valueFormatter: function (params) {
                    if (params.value && params.value.indexOf('无') == -1) {
                        let dateStr = params.value
                        if (dateStr.indexOf('.') != -1) {
                            dateStr = dateStr.replace(".", '-')
                        }
                        if (dateStr.indexOf('年') != -1) {
                            dateStr = dateStr.replace("年", '-')
                        }
                        if (dateStr.indexOf('月') != -1) {
                            dateStr = dateStr.replace("月", '-')
                        }
                        if (dateStr.indexOf('号') != -1) {
                            dateStr = dateStr.replace("号", '-')
                        }
                        if (dateStr.indexOf('日') != -1) {
                            dateStr = dateStr.replace("日", '-')
                        }

                        let date = new Date(dateStr)
                        let year = date.getFullYear()
                        let month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)
                        let day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()
                        return year + '-' + month + '-' + day
                    } else {
                        return ''
                    }
                },
            },
            { headerName: "科目二合格编号", field: "科目二合格编号", other: "subjectBCode" }
        ];
        this.columnDefs = [
            {
                headerName: "必填项(学生统考成绩)",
                children: require
            }
        ];
        // this.excelStyles = [
        //     {
        //         id: 'dateType',
        //         dataType: 'DateTime',
        //         numberFormat: { format: 'yyyy-mm-dd' },
        //     },
        // ];
        let tem = {};
        this.columnDefs.forEach(data => {
            tem[data.field] = "暂无";
        });
        this.rowData = [tem]
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
            // this.importColumnDefs[this.currentSchema] = columnDefs;
            this.columnDefs = [
                ...this.columnDefs,
                { headerName: "导入项", children: columnDefs }
            ];
            this.rowData = this.data;
            this.isImport = true
            //   this.SchemaDataMap[this.currentSchema] = this.data;

            //   this.importFields = keyAry;
            //   // this.staticsCount(data);
            //   this.importField[0] = this.importColumnDefs[this.currentSchema][0].filed;
            // };

            this.getOnjectIdMap(this.data)
        }
        reader.readAsBinaryString(target.files[0]);
        let drop = document.getElementById("dropBox");
        if (this.rowData.length >= 1) {
            drop.style.display = "none";
        }

    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }
    exportData() {
        this.gridApi.exportDataAsExcel();
    }
    successData: any = []
    count: any = 0
    errCount: any = 0
    isVisible: boolean = false
    isVisible2: boolean = false
    async saveLine() {
        this.isVisible = true
        let count = 0;
        console.log(this.dataMap)
        for (let j = 0; j < this.rowData.length; j++) {
            
            if (this.dataMap[j].rid) {  // 查到了profile
                let examgrade: any = await this.getExamGrade(
                    this.rowData[j]["身份证号"],
                    this.rowData[j]["学员姓名"],
                    this.dataMap[j].rid
                );
                console.log(examgrade)
                if(examgrade) {
                    examgrade.set('profile', {
                        __type: 'Pointer',
                        className: 'Profile',
                        objectId: this.dataMap[j].rid
                    })
                    for (let i = 0; i < this.columnDefs[0].children.length; i++) {
                        if (this.rowData[j][this.columnDefs[0].children[i].field]) {
                            examgrade.set(
                                this.columnDefs[0].children[i].other,
                                this.rowData[j][this.columnDefs[0].children[i].field].trim()
                            );
                        }
                    }
                    let grade = await examgrade.save()
                    if (grade && grade.id) {
                        count += 1;
                        this.count = count
                        this.count = count;
                        this.successData.push({ id: grade.id, idcard: grade.get('idcard'), name: grade.get('name') });
                        if ((count + this.errCount) == this.rowData.length) {
                            this.isVisible2 = true
                            this.compareData()
                            setTimeout(res => {
                                this.isVisible = false
                                this.isImport = false;
                                let drop = document.getElementById("dropBox");
                                drop.style.display = "block";
                            }, 1000)
                        }
                    } else {
                        this.errCount += 1
                        if ((this.count + this.errCount) == this.rowData.length) {
                            this.isVisible2 = true
                            this.compareData()
                            setTimeout(res => {
                                this.isVisible = false
                                this.isImport = false;
                                let drop = document.getElementById("dropBox");
                                drop.style.display = "block";
                            }, 1000)
                        }
                        continue
                    }
                } else {
                    this.errCount += 1
                    if ((this.count + this.errCount) == this.rowData.length) {
                        this.isVisible2 = true
                        this.compareData()
                        setTimeout(res => {
                            this.isVisible = false
                            this.isImport = false;
                            let drop = document.getElementById("dropBox");
                            drop.style.display = "block";
                        }, 1000)
                    }
                continue
                }
                
            } else { // 没有查询到Profile
                this.errCount += 1
                if ((this.count + this.errCount) == this.rowData.length) {
                    this.isVisible2 = true
                    this.compareData()
                    setTimeout(res => {
                        this.isVisible = false
                        this.isImport = false;
                        let drop = document.getElementById("dropBox");
                        drop.style.display = "block";
                    }, 1000)
                }
                continue
            }
        }
    }

    errData: any = []
    async compareData() {
        var set = this.successData.map(item => item['idcard'])
        console.log(set)
        var resArr = this.rowData.filter(item => !set.includes(item['身份证号'] ? item['身份证号'].trim() : ""))

        if (resArr == []) {
            this.errData = resArr
        } else {
            this.isVisible = false;
            this.errData = resArr
            this.rowData = resArr
        }
    }

    async getExamGrade(idcard, name, rid) {
        return new Promise(async (resolve, reject) => {
            if(idcard && name && rid){
                console.log(idcard, name, rid)
                let ExamGrade = new Parse.Query("ExamGrade");
                ExamGrade.equalTo("idcard", idcard.trim());
                ExamGrade.equalTo("name", name.trim());
                ExamGrade.equalTo("profile", rid);
                await ExamGrade.first().then(res => {
                    console.log(res)
                    if (res && res.id) {
                        resolve(res);
                    } else {
                        let P = Parse.Object.extend("ExamGrade");
                        let p = new P();
                        p.set("company", {
                            __type: "Pointer",
                            className: "Company",
                            objectId: "pPZbxElQQo"
                        });
                        resolve(p);
                    }
                })
            } else{
                resolve(false)
            } 
        });
    }

    handleCancel() {
        this.isVisible2 = false;
    }

    dataMap: any = [];
    isDealData: boolean = false;
    async getOnjectIdMap(datas) {
        // 对数据的处理，以及错误查询
        this.isDealData = true
        datas.forEach((data, index) => {
            let map: any = {};
            let name = data['学员姓名'] ? data['学员姓名'].trim() : "";
            let idcard = data['身份证号'] ? data['身份证号'].trim() : "";
            if (name && idcard) {
                let Profile = new Parse.Query('Profile')
                Profile.equalTo('name', name)
                Profile.equalTo('idcard', idcard)
                Profile.equalTo('company', "pPZbxElQQo")
                Profile.first().then(res => {
                    if (res && res.id) {
                        map.rid = res.id
                    } else {
                        map.rid = null
                    }
                    this.dataMap[index] = map;
                    if (this.dataMap.length == datas.length) {
                        setTimeout(() => {
                            this.isImport = true;
                            this.isDealData = false
                        }, 3000)
                    }
                })
            }else {
                this.dataMap[index] = {rid: null};
                if (this.dataMap.length == datas.length) {
                    setTimeout(() => {
                        this.isImport = true;
                        this.isDealData = false
                    }, 3000)
                }
            }
        });
    }
}
