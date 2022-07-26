import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import * as XLSX from "xlsx";
import * as Parse from "parse";
import "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { ColumnApi, GridApi, QuerySelector } from "ag-grid-community";
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'app-import-creditResult',
    templateUrl: './import-creditResult.component.html',
    styleUrls: ['./import-creditResult.component.scss']
})
export class ImportCreditResultComponent implements OnInit {

    constructor(private message: NzMessageService) { }
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
    department: any
    schools: any = []
    showSelect: boolean = false
    async ngOnInit() {
        let require = [
            { headerName: "学员姓名", field: "学员姓名", other: "name", type: "String" },
            { headerName: "学员学号", field: "学员学号", other: "studentId", type: "String" },
            { headerName: "身份证号", field: "身份证号", other: "idcard", type: "String" },
            { headerName: "课程名称", field: "课程名称", other: "lesson", type: "Pointer" },
            { headerName: "考试成绩", field: "考试成绩", other: "grade", type: "Number" },
            { headerName: "获得学分", field: "获得学分", other: "credit", type: "Number" },
        ];
        this.columnDefs = [
            {
                headerName: "必填项(学生学分课程成绩)",
                children: require
            }
        ];

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
        this.department = localStorage.getItem('department') ? localStorage.getItem('department') : ''
        this.showSelect = localStorage.getItem('department') ? false : true

    }
    // 文件拖拽
    handleDropOver(e, over) {

        if (!this.department) {
            this.message.info("请先选择院校")
        }
        e.preventDefault();
        e.stopPropagation();
    }

    // ag-grid 生命周期
    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }
    exportData() {
        this.gridApi.exportDataAsExcel();
    }

    getSchool(event?) {
        let Department = new Parse.Query('Department')
        Department.equalTo('category', 'erVPCmBAgt')
        Department.equalTo('company', 'pPZbxElQQo')
        if (event) {
            Department.contains('name', event)
        }
        Department.limit(10)
        Department.find().then(res => {
            this.schools = res
        })
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
        if (!this.department) {
            this.message.info("请先选择院校")
            return
        }
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
            console.log(data)
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
            console.log(this.rowData)
            this.isImport = true
            this.getOnjectIdMap(this.data)
        }
        reader.readAsBinaryString(target.files[0]);
        let drop = document.getElementById("dropBox");
        if (this.rowData.length >= 1) {
            drop.style.display = "none";
        }
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
            if (this.dataMap[j].lid) {  // 查到了课程
                let examgrade: any = await this.getCreditGrade(
                    this.rowData[j]["身份证号"],
                    this.rowData[j]["学员姓名"],
                    this.dataMap[j].lid
                );
                console.log(examgrade)
                if(examgrade) {
                    for (let i = 0; i < this.columnDefs[0].children.length; i++) {
                        if (this.rowData[j][this.columnDefs[0].children[i].field] && this.columnDefs[0].children[i].type != 'Pointer') {
                            if(this.columnDefs[0].children[i].type == 'Number') {
                                examgrade.set(
                                    this.columnDefs[0].children[i].other,
                                    Number(this.rowData[j][this.columnDefs[0].children[i].field].trim())
                                );
                            } else {
                                examgrade.set(
                                    this.columnDefs[0].children[i].other,
                                    this.rowData[j][this.columnDefs[0].children[i].field].trim()
                                );
                            }
                            
                        }
                    }
                    let grade = await examgrade.save()
                    if (grade && grade.id) {
                        count += 1;
                        this.count = count
                        this.count = count;
                        console.log(grade)
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
                }else {
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
                            drop.style.display = "none";
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

    async getCreditGrade(idcard, name, lesson) {
        return new Promise(async (resolve, reject) => {
            if(idcard && name && lesson) {
                let Profile = new Parse.Query("Profile")
                console.log(idcard, name)
                Profile.equalTo("idcard", idcard.trim())
                Profile.equalTo("name", name.trim())
                let profile = await Profile.first()
                if (profile && profile.id) {
                    let ExamGrade = new Parse.Query("CreditGrade");
                    ExamGrade.equalTo("idcard", idcard);
                    ExamGrade.equalTo("name", name);
                    ExamGrade.equalTo("lesson", lesson);
                    await ExamGrade.first().then(res => {
                        if (res && res.id) {
                            res.set("profile", {
                                __type: "Pointer",
                                className: "Profile",
                                objectId: profile.id
                            })
                            if (profile.get('SchoolMajor')) {
                                res.set("major", {
                                    __type: "Pointer",
                                    className: "SchoolMajor",
                                    objectId: profile.get('SchoolMajor').id
                                })
                            }
                            if (profile.get('department')) {
                                res.set("department", {
                                    __type: "Pointer",
                                    className: "Department",
                                    objectId: profile.get('department').id
                                })
                                res.set("departments", [
                                    {
                                        __type: "Pointer",
                                        className: "Department",
                                        objectId: profile.get('department').id
                                    }
                                ])
                            }
                            resolve(res)
                        } else {
                            let CreditGrade = Parse.Object.extend("CreditGrade");
                            let creditGrade = new CreditGrade();
                            creditGrade.set("profile", {
                                __type: "Pointer",
                                className: "Profile",
                                objectId: profile.id
                            })
                            if (profile.get('SchoolMajor')) {
                                creditGrade.set("major", {
                                    __type: "Pointer",
                                    className: "SchoolMajor",
                                    objectId: profile.get('SchoolMajor').id
                                })
                            }
                            if (profile.get('department')) {
                                creditGrade.set("department", {
                                    __type: "Pointer",
                                    className: "Department",
                                    objectId: profile.get('department').id
                                })
                                creditGrade.set("departments", [
                                    {
                                        __type: "Pointer",
                                        className: "Department",
                                        objectId: profile.get('department').id
                                    }
                                ])
                            }
                            creditGrade.set("lesson", 
                                {
                                    __type: "Pointer",
                                    className: "Lesson",
                                    objectId: lesson
                                })
                            creditGrade.set("company", {
                                __type: "Pointer",
                                className: "Company",
                                objectId: "pPZbxElQQo"
                            });
                            resolve(creditGrade);
                        }
                    })
                } else {
                    resolve(false)
                }
            } else {
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
            let name = data['课程名称'] ? data['课程名称'].trim() : "";
            if (name) {
                let Lesson = new Parse.Query('Lesson')
                Lesson.equalTo('title', data['课程名称'])
                Lesson.equalTo('school', this.department)
                Lesson.first().then(res => {
                    console.log(res)
                    if (res && res.id) {
                        map.lid = res.id
                    } else {
                        map.rid = null
                    }
                    this.dataMap[index] = map;
                    console.log(this.dataMap)
                    if (this.dataMap.length == datas.length) {
                        setTimeout(() => {
                            this.isImport = true;
                            this.isDealData = false
                        }, 1500)
                    }
                })
            }
        });
    }

}
