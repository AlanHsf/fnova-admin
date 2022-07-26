import { Component, OnInit, ViewChild } from "@angular/core";
import { ChangeDetectorRef } from "@angular/core";
import * as XLSX from "xlsx";
import * as Parse from "parse";
import "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { ColumnApi, GridApi, QuerySelector } from "ag-grid-community";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
    selector: "app-import-student",
    templateUrl: "./import-student.component.html",
    styleUrls: ["./import-student.component.scss"]
})
export class ImportStudentComponent implements OnInit {
    constructor(public cdRef: ChangeDetectorRef, private message: NzMessageService) { }
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
    objectIdMap: any = []; // 存每一条数据的Pointer指针的objectId
    require: any = [];
    department: string = ""
    gridApi;
    gridColumnApi;
    ngOnInit() {
        if (localStorage.getItem('department')) {
            this.department = localStorage.getItem('department')
        }
        this.require = [
            {
                headerName: "学员批次",
                field: "学员批次",
                other: "batch",
                type: "String"
            },
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
                headerName: "学员性别",
                field: "学员性别",
                other: "sex",
                type: "String"
            },
            {
                headerName: "身份证号",
                field: "身份证号",
                other: "idcard",
                type: "String"
            },
            {
                headerName: "手机号码",
                field: "手机号码",
                other: "mobile",
                type: "String"
            },
            {
                headerName: "电子邮箱",
                field: "电子邮箱",
                other: "email",
                type: "String"
            },
            {
                headerName: "报考学校",
                field: "报考学校",
                other: "department",
                type: "Pointer",
                targetClass: "Department"
            },
            {
                headerName: "所在学院",
                field: "所在学院",
                other: "college",
                type: "String"
            },
            {
                headerName: "报名专业",
                field: "报名专业",
                other: "SchoolMajor",
                type: "Pointer",
                targetClass: "SchoolMajor"
            },
            {
                headerName: "学员籍贯",
                field: "学员籍贯",
                other: "nativePlace",
                type: "String"
            },
            { headerName: "工作单位", field: "工作单位", other: "workUnit", type: "String" },
            {
                headerName: "学习中心",
                field: "学习中心",
                other: "center",
                type: "Pointer",
                targetClass: "Department"
            },
            {
                headerName: "学习中心备注",
                field: "学习中心备注",
                other: "centerDesc",
                type: "String"
            },
            {
                headerName: "学员班级",
                field: "学员班级",
                other: "schoolClass",
                type: "Pointer",
                targetClass: "SchoolClass"
            },

            { headerName: "班主任", field: "班主任", other: "teacher", type: "String" },
            { headerName: "学员追踪", field: "学员追踪", other: "desc", type: "String" },
            { headerName: "前置授学位专业", field: "前置授学位专业", other: "schoolMajor", type: "String" },
            { headerName: "前置授学位时间", field: "前置授学位时间", other: "getTime", type: "String" },
            { headerName: "学位证编号", field: "学位证编号", other: "degreeNumber", type: "String" },
            { headerName: "学历证编号", field: "学历证编号", other: "diploma", type: "String" },
            { headerName: "材料是否审核通过", field: "材料是否审核通过", other: "isCross", type: "Boolean" },
            { headerName: "报名时间", field: "报名时间", other: "singTime", type: "String" },
            { headerName: "是否现场确认", field: "是否现场确认", other: "isCheck", type: "Boolean" },
            { headerName: "是否需要统考辅导", field: "是否需要统考辅导", other: "tutoring", type: "Boolean" },
            { headerName: "是否需要开票", field: "是否需要开票", other: "isBill", type: "Boolean" },
            { headerName: "服务年限", field: "服务年限", other: "serviceLength", type: "String" },
            { headerName: "班型", field: "班型", other: "classType", type: "String" },
            { headerName: "统考教材邮寄情况", field: "统考教材邮寄情况", other: "mail", type: "String" },
            {
                headerName: "身份类型",
                field: "身份类型",
                other: "identyType",
                type: "String"
            },
            {
                headerName: "学员状态",
                field: "学员状态",
                other: "studentType",
                type: "String"
            },

            {
                headerName: "毕业学校",
                field: "毕业学校",
                other: "school",
                type: "String"
            },
        ];
        this.columnDefs = [
            {
                headerName: "必填项(学生信息)",
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
            console.log(XLSX)
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];

            this.data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
            console.log(this.data)

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

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }
    exportData() {
        this.gridApi.exportDataAsExcel();
    }


    isImport: boolean = false;
    isDealData: boolean = false;
    async getOnjectIdMap(datas) {
        // 对数据的处理，以及错误查询
        this.isDealData = true
        console.log(1111, datas)
        datas.forEach((data, index) => {
            let map: any = {};
            this.require.forEach(async r => {
                if (r.other == 'mobile') {
                    if (!data[r.field]) {
                        alert(data['学员姓名'] + '未填写手机号')
                    }
                    let mobile = data[r.field].trim()
                    let reg = new RegExp('^1[0-9]{10}$', 'g')
                    let checkMobile = reg.test(mobile)
                    if (!checkMobile) {
                        this.isImport = false;
                        alert(data['学员姓名'] + '手机号格式不正确')
                    }
                }
                if (r.other == 'idcard') {
                    if (!data[r.field]) {
                        this.isImport = false;
                        alert(data['学员姓名'] + '身份证号未填写')
                    }
                    let idcard = data[r.field].trim()
                    let reg = new RegExp('^[1-9][0-9]{16}[0-9Xx]$', 'g')
                    let checkIdcard = reg.test(idcard)
                    if (!checkIdcard) {
                        this.isImport = false;
                        this.isImport = false;
                        alert(data['学员姓名'] + '身份证号格式不正确')
                    }
                }
                if (r.type == "Pointer" && r.targetClass) {
                    if (data[r.field]) {
                        let TargetClass = new Parse.Query(r.targetClass);
                        TargetClass.equalTo("name", data[r.field].trim());
                        TargetClass.equalTo("company", 'pPZbxElQQo');
                        // 学员专业以及学员班级
                        if (r.targetClass == 'SchoolClass' && this.department) {
                            TargetClass.equalTo("department", this.department);
                        }
                        if (r.targetClass == 'SchoolMajor' && this.department) {
                            TargetClass.equalTo("school", this.department);
                        }
                        let target = await TargetClass.first();
                        if (target && target.id) {
                            map[r.other] = target.id;
                        } else {
                            map[r.other] = null;
                        }
                    }
                }
            });
            this.objectIdMap[index] = map;
            if (this.objectIdMap.length == datas.length) {
                setTimeout(() => {
                    this.isImport = true;
                    this.isDealData = false
                }, 10000)
            }
        });
        this.rowData = datas;
    }
    successData = []

    isVisible: boolean = false
    // 保存到数据库
    count: any = 0
    errCount: any = 0
    async saveLine(end?) {
        this.isVisible = true
        let count = 0;
        if (end) {
            this.isVisible = false
            return
        }
        for (let j = 0; j < this.rowData.length; j++) {
            console.log(this.objectIdMap[j].SchoolMajor)
            if (this.objectIdMap[j].SchoolMajor) {
                let profile: any = await this.getProfile(
                    this.rowData[j]["身份证号"],
                    this.rowData[j]["学员姓名"],
                    this.objectIdMap[j].SchoolMajor
                );
                let departments = []
                for (let i = 0; i < this.columnDefs[0].children.length; i++) {
                    if (this.columnDefs[0].children[i].type == "String") {
                        if (this.rowData[j][this.columnDefs[0].children[i].field]) {
                            profile.set(
                                this.columnDefs[0].children[i].other,
                                this.rowData[j][this.columnDefs[0].children[i].field].trim()
                            );
                        }
                    }
                    if (this.columnDefs[0].children[i].type == "Pointer") {
                        if (
                            this.objectIdMap &&
                            this.objectIdMap[j] &&
                            this.objectIdMap[j][this.columnDefs[0].children[i].other]
                        ) {
                            profile.set(this.columnDefs[0].children[i].other, {
                                __type: "Pointer",
                                className: this.columnDefs[0].children[i].targetClass,
                                objectId: this.objectIdMap[j][this.columnDefs[0].children[i].other]
                            });
                            if (this.columnDefs[0].children[i].targetClass == 'Department') {
                                departments.push({
                                    __type: "Pointer",
                                    className: this.columnDefs[0].children[i].targetClass,
                                    objectId: this.objectIdMap[j][this.columnDefs[0].children[i].other]
                                })
                            }
                        }
                    }
                    if (this.columnDefs[0].children[i].type == "Boolean") {
                        if (this.rowData[j][this.columnDefs[0].children[i].field] && this.rowData[j][this.columnDefs[0].children[i].field].trim() == '是') {
                            profile.set(
                                this.columnDefs[0].children[i].other,
                                true
                            );
                        } else {
                            profile.set(
                                this.columnDefs[0].children[i].other,
                                false
                            );
                        }
                    }
                    // 存助学中心， 和所属学校的 departments
                }
                profile.set('departments', departments)
                
                let res = await profile.save()
                if (res && res.id) {
                    count += 1;
                    this.count = count;
                    this.successData.push({ id: res.id, idcard: res.get('idcard'), name: res.get('name') });
                } else {
                    this.errCount += 1
                    this.errData.push({
                        name: this.rowData[j]["学员姓名"],
                        idcard: this.rowData[j]["身份证号"],
                        res: '上传失败'
                    })
                }

                if ((count + this.errCount) == this.rowData.length) {
                    this.isVisible2 = true
                    setTimeout(res => {
                        this.isVisible = false
                        this.isImport = false;
                    }, 1000)
                    
                }
            } else {
                this.errCount += 1
                this.errData.push({
                    name:this.rowData[j]["学员姓名"],
                    idcard:this.rowData[j]["身份证号"],
                    res: '缺少专业或者专业名称有误'
                })
                if ((count + this.errCount) == this.rowData.length) {
                    this.isVisible2 = true
                    setTimeout(res => {
                        this.isVisible = false
                        this.isImport = false;
                    }, 1000)
                    
                }
                continue
            }
        }


    }
    end: boolean = false
    cancelPush() {
        this.end = true
    }
    isVisible2: boolean = false;
    errData: any = []
    async compareData() {
        var set = this.successData.map(item => item['idcard'])
        var resArr = this.rowData.filter(item => {
            !set.includes(item['身份证号'])
        })
    }
    handleCancel() {
        this.isVisible2 = false;
    }
    async getProfile(idcard, name, major) {
        return new Promise(async (resolve, reject) => {
            let Profile = new Parse.Query("Profile");
            if (idcard) {
                Profile.equalTo("idcard", idcard.trim());
            }
            if (name) {
                Profile.equalTo("name", name.trim());
            }

            // Profile.equalTo("SchoolMajor", major);
            let profile = await Profile.first();
            if (profile && profile.id) {
                resolve(profile);
            } else {
                let P = Parse.Object.extend("Profile");
                let p = new P();
                p.set("company", {
                    __type: "Pointer",
                    className: "Company",
                    objectId: "pPZbxElQQo"
                });
                p.set("isCross", true);
                resolve(p);
            }
        });
    }
}
