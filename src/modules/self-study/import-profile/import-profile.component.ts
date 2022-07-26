import { Component, OnInit } from "@angular/core";
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
    selector: 'app-import-profile',
    templateUrl: './import-profile.component.html',
    styleUrls: ['./import-profile.component.scss']
})
export class ImportProfileComponent implements OnInit {
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
    isOkLoading: boolean = true
    gridColumnApi;
    classExcTpl;
    company;
    center;
    async ngOnInit() {
        if (localStorage.getItem('department')) {
            this.department = localStorage.getItem('department')
        }
        // 服务点
        let depa = new Parse.Query("Department")
        depa.equalTo("objectId", this.department);
        depa.equalTo("type", "training");
        let depaInfo = await depa.first()
        console.log(depaInfo)
        if (depaInfo && depaInfo.id) {
            this.center = depaInfo.id
            // this.company = depaInfo.get("company").id
            // this.department = ''
            this.getCenterDepaList()
        }

        this.require = [
            {
                headerName: "专业类别",
                field: "专业类别",
                other: "identyType",
                type: "String"
            },
            {
                headerName: "准考证号",
                field: "准考证号",
                other: "studentID",
                type: "String"
            },
            {
                headerName: "报考专业",
                field: "报考专业",
                other: "SchoolMajor",
                type: "Pointer",
                targetClass: "SchoolMajor"
            },
            {
                headerName: "姓名",
                field: "姓名",
                other: "name",
                type: "String"
            },
            {
                headerName: "性别",
                field: "性别",
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
                headerName: "民族",
                field: "民族",
                other: "nation",
                type: "String"
            },
            {
                headerName: "籍贯",
                field: "籍贯",
                other: "nativePlace",
                type: "String"
            },
            {
                headerName: "户籍",
                field: "户籍",
                other: "state",
                type: "String"
            },
            {
                headerName: "政治面貌",
                field: "政治面貌",
                other: "polity",
                type: "String"
            },
            {
                headerName: "主考院校",
                field: "主考院校",
                other: "department",
                type: "Pointer",
                targetClass: "Department"
            },
            {
                headerName: "报考层次",
                field: "报考层次",
                other: "education",
                type: "String"
            },
            {
                headerName: "前置学历",
                field: "前置学历",
                other: "positionPart",
                type: "String"
            },
            {
                headerName: "职业",
                field: "职业",
                other: "position",
                type: "String"
            },
            {
                headerName: "联系方式",
                field: "联系方式",
                other: "mobile",
                type: "String"
            },
            {
                headerName: "服务点",
                field: "服务点",
                other: "center",
                type: "Pointer",
                targetClass: "Department"
            },
            {
                headerName: "报读院校",
                field: "报读院校",
                other: "school",
                type: "String"
            },
            {
                headerName: "批次",
                field: "批次",
                other: "batch",
                type: "String"
            },
            {
                headerName: "班级",
                field: "班级",
                other: "classType",
                type: "String"
            },
            {
                headerName: "身份证地址",
                field: "身份证地址",
                other: "address",
                type: "String"
            },
            {
                headerName: "邮箱",
                field: "邮箱",
                other: "email",
                type: "String"
            }
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

        let company = new Parse.Query("Company");
        let companyInfo = await company.get("1ErpDVc1u6");
        this.classExcTpl = companyInfo.get('config')?.profileExcTpl
    }
    depaList;
    depaId;
    async getCenterDepaList() {
        let department = new Parse.Query("Department")
        department.equalTo("company", "1ErpDVc1u6");
        department.notEqualTo("type", "training");
        let depaList = await department.find();
        console.log(depaList)
        if (depaList.length) {
            this.depaList = depaList
        }
    }

    // 文件拖拽
    handleDropOver(e, over?) {
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
        console.log(this.depaId)
        if (this.center && !this.depaId) {
            this.message.error("请先选择院校!")
            return;
        }

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
    // async exportData() {
    //     this.gridApi.exportDataAsExcel();
    // }


    isImport: boolean = false;
    isDealData: boolean = false;
    isClick = true
    async getOnjectIdMap(datas) {
        // 对数据的处理，以及错误查询
        this.isDealData = true
        console.log(1111, datas)
        datas.forEach((data, index) => {
            let map: any = {};
            this.require.forEach(async r => {
                if (r.other == 'name') {
                    if (!data[r.field]) {
                        this.isImport = false;
                        this.isClick = false;
                        alert('存在未填写姓名')
                    }
                }

                if (r.other == 'sex') {
                    if (!data[r.field]) {
                        this.isImport = false;
                        this.isClick = false;
                        alert(data['姓名'] + '未填写性别')
                    }
                }

                if (r.other == 'nation') {
                    if (!data[r.field]) {
                        this.isImport = false;
                        this.isClick = false;
                        alert(data['姓名'] + '未填民族')
                    }
                    if (this.nationList.indexOf(data[r.field].indexOf("族") == -1 ? data[r.field] : data[r.field].substring(0, data[r.field].indexOf('族')) + data[r.field].substring(data[r.field].indexOf('族') + 1)) == -1) {
                        this.isImport = false;
                        this.isClick = false;
                        alert(data['姓名'] + '民族填写不正确')
                    }

                }

                if (r.other == 'mobile') {
                    if (!data[r.field]) {
                        this.isImport = false;
                        this.isClick = false;
                        alert(data['姓名'] + '未填写联系方式')
                    }
                    let mobile = data[r.field].trim()
                    let reg = new RegExp('^1[0-9]{10}$', 'g')
                    let checkMobile = reg.test(mobile)
                    if (!checkMobile) {
                        this.isImport = false;
                        this.isClick = false;
                        alert(data['姓名'] + '联系方式格式不正确')
                    }
                }

                if (r.other == 'education') {
                    if (!data[r.field]) {
                        this.isImport = false;
                        this.isClick = false;
                        alert(data['姓名'] + '报考层次未填写')
                    }
                    if (data[r.field] != "专科" && data[r.field] != "本科") {
                        this.isImport = false;
                        this.isClick = false;
                        alert(data['姓名'] + '报考层次填写不正确')
                    }
                }

                if (r.other == 'idcard') {
                    if (!data[r.field]) {
                        this.isImport = false;
                        this.isClick = false;
                        alert(data['姓名'] + '身份证号未填写')
                    }
                    let idcard = data[r.field].trim()
                    let reg = new RegExp('^[1-9][0-9]{16}[0-9Xx]$', 'g')
                    let checkIdcard = reg.test(idcard)
                    if (!checkIdcard) {
                        this.isImport = false;
                        this.isClick = false;
                        alert(data['姓名'] + '身份证号格式不正确')
                    }

                    let pro = new Parse.Query("Profile");
                    pro.equalTo("company", "1ErpDVc1u6");
                    pro.equalTo("idcard", idcard);
                    pro.equalTo("education", data['报考层次']);
                    if (this.depaId) {
                        pro.equalTo("department", this.depaId);
                    } else {
                        pro.equalTo("department", this.department);
                    }
                    let proList = await pro.find().catch(err => console.log(err))
                    console.log(proList)
                    if (proList && proList.length) {
                        if (proList.length > 0) {
                            this.isImport = false;
                            this.isClick = false;
                            alert(data['姓名'] + data['身份证号'] + data['报考层次'] + ', 该学生信息已存在')
                        }
                    }
                }

                // 类别
                if (r.other == 'identyType') {
                    if (!data[r.field]) {
                        this.isImport = false;
                        this.isClick = false;
                        alert(data['姓名'] + '学生专业类别未填写')
                    }
                    if (data[r.field] != "二学历" && data[r.field] != "衔接" && data[r.field] != "试点") {
                        this.isImport = false;
                        this.isClick = false;
                        alert(data['姓名'] + '学生专业类别填写不正确')
                    }
                }

                // 籍贯
                if (r.other == 'nativePlace') {
                    if (!data[r.field]) {
                        this.isImport = false;
                        this.isClick = false;
                        alert(data['姓名'] + '学生籍贯未填写')
                    }
                }

                // 报读院校
                if (r.other == 'school') {
                    if(data["专业类别"] == '二学历'){
                        if (!data[r.field]) {
                            this.isImport = false;
                            this.isClick = false;
                            alert(data['姓名'] + '学生报读院校未填写')
                        }

                        if (data[r.field] != "福州外语外贸学院" && data[r.field] != "福建师范大学" && data[r.field] != "华侨大学" && data[r.field] != "福州大学") {
                            this.isImport = false;
                            this.isClick = false;
                            alert(data['姓名'] + '学生报读院校填写不正确')
                        }

                    }
                }

                // 批次
                if (r.other == 'batch') {
                    if (!data[r.field]) {
                        this.isImport = false;
                        this.isClick = false;
                        alert(data['姓名'] + '学生批次未填写')
                    }
                    let query = new Parse.Query("Company")
                    query.equalTo("company", "1ErpDVc1u6")
                    query.equalTo("name", data[r.field].trim)
                    let companyInfo = await query.first()
                    if (companyInfo && companyInfo.id) {
                        let batchValue = companyInfo.get("cmsconfig")["fieldConf"]["batch"]["options"][0]
                        console.log(batchValue)
                        if (batchValue) {
                            if (batchValue != data[r.field]) {
                                this.isImport = false;
                                this.isClick = false;
                                alert(data['姓名'] + '学生批次填写不正确')
                            }
                        } else {
                            this.isImport = false;
                            this.isClick = false;
                            alert(data['主考院校'] + '未配置预报名批次数据参数!')
                        }
                    } else {
                        this.isImport = false;
                        this.isClick = false;
                        alert(data['主考院校'] + '未配置预报名批次数据参数')
                    }

                }

                // 面貌
                if (r.other == 'polity') {
                    if (!data[r.field]) {
                        this.isImport = false;
                        this.isClick = false;
                        alert(data['姓名'] + '政治面貌未填写')
                    }
                    if (data[r.field] != "党员" && data[r.field] != "团员" && data[r.field] != "其它") {
                        this.isImport = false;
                        this.isClick = false;
                        alert(data['姓名'] + '政治面貌填写不正确')
                    }
                }

                // 户籍
                if (r.other == 'state') {
                    if (!data[r.field]) {
                        this.isImport = false;
                        this.isClick = false;
                        alert(data['姓名'] + '户籍未填写')
                    }
                    if (data[r.field] != "城镇" && data[r.field] != "农村") {
                        this.isImport = false;
                        this.isClick = false;
                        alert(data['姓名'] + '户籍填写不正确')
                    }
                }

                // 学历
                if (r.other == 'positionPart') {
                    if (!data[r.field]) {
                        this.isImport = false;
                        this.isClick = false;
                        alert(data['姓名'] + '前置学历未填写')
                    }
                    if (data[r.field] != "本科以上" && data[r.field] != "本科" && data[r.field] != "大专(专科)" &&
                        data[r.field] != "中专(中校)" && data[r.field] != "高中(职高)" && data[r.field] != "初中及初中以下") {
                        this.isImport = false;
                        this.isClick = false;
                        alert(data['姓名'] + '前置学历填写不正确')
                    }
                }

                // 职业
                if (r.other == 'position') {
                    if (!data[r.field]) {
                        this.isImport = false;
                        this.isClick = false;
                        alert(data['姓名'] + '职业未填写')
                    }
                    if (this.positionList.indexOf(data[r.field]) == -1) {
                        this.isImport = false;
                        this.isClick = false;
                        alert(data['姓名'] + '职业填写不正确')
                    }
                }


                if (r.type == "Pointer" && r.targetClass) {
                    if (data[r.field]) {
                        let TargetClass = new Parse.Query(r.targetClass);
                        TargetClass.equalTo("name", data[r.field].trim());
                        TargetClass.equalTo("company", '1ErpDVc1u6');
                        if (this.center && r.targetClass == 'Department' && r.headerName == "主考院校") {
                            let depa = new Parse.Query("Department");
                            let depaInfo = await depa.get(this.depaId);
                            console.log(depaInfo, data[r.field])
                            if (data[r.field] != depaInfo.get("name")) {
                                alert(data['姓名'] + '主考院校与现在院校不符!');
                            }
                        }
                        if (r.targetClass == 'SchoolMajor' && this.department) {
                            if (this.depaId) {
                                TargetClass.equalTo("school", this.depaId);
                            } else {
                                TargetClass.equalTo("school", this.department);
                            }
                            TargetClass.equalTo("type", data["报考层次"]);
                            TargetClass.equalTo("types", data["专业类别"]);
                        }
                        if (r.targetClass == 'Category' && this.department) {
                            TargetClass.equalTo("department", this.department);
                        }
                        if (r.headerName == '服务点' && this.department) {
                            TargetClass.equalTo("type", "training");
                            TargetClass.equalTo("info", data["专业类别"]);
                        }
                        TargetClass.select('objectId')
                        let target = await TargetClass.first();

                        if (target && target.id) {
                            map[r.other] = target.id;
                        } else {
                            map[r.other] = null;
                            // this.isImport = false;
                            // alert(data['姓名'] + data[r.headerName] + ": " + data[r.field] + '填写错误!')
                        }
                    } else {
                        this.isImport = false;
                        this.isClick = false;
                        alert(data['姓名'] + '[专业] 或 [服务点] 或 [主考院校] 未填写')
                    }
                }
            });

            this.objectIdMap[index] = map;
            console.log(datas)
        });
        console.log(this.objectIdMap, datas)
        if (this.objectIdMap.length == datas.length) {
            setTimeout(() => {
                this.isImport = true;
                this.isDealData = false
            }, 3000)
        }
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
            console.log(this.objectIdMap[j])
            if (this.objectIdMap[j].SchoolMajor && this.objectIdMap[j].department && this.objectIdMap[j].center) {
                let profile: any = await this.getProfile(
                    this.rowData[j]["身份证号"],
                    this.rowData[j]["姓名"],
                    this.objectIdMap[j].SchoolMajor,
                    this.rowData[j]["报考层次"]
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
                        name: this.rowData[j]["姓名"],
                        idcard: this.rowData[j]["身份证号"],
                        res: '上传失败'
                    })
                }

            } else {
                this.errCount += 1
                if (!this.objectIdMap[j].SchoolMajor) {
                    this.errData.push({
                        name: this.rowData[j]["姓名"],
                        idcard: this.rowData[j]["身份证号"],
                        res: '缺少专业或者专业名称有误'
                    })
                }
                if (!this.objectIdMap[j].department) {
                    this.errData.push({
                        name: this.rowData[j]["姓名"],
                        idcard: this.rowData[j]["身份证号"],
                        res: '缺少所属学校或者所属学校名称有误'
                    })
                }
                if (!this.objectIdMap[j].center) {
                    this.errData.push({
                        name: this.rowData[j]["姓名"],
                        idcard: this.rowData[j]["身份证号"],
                        res: '缺少教学点或者教学点名称有误'
                    })
                }
                console.log(this.errCount, count)
                if (this.errCount > 0) {
                    this.isVisible2 = true
                    setTimeout(res => {
                        this.isVisible = false
                        this.isImport = false;
                    }, 1000)

                }
                continue
            }
        }
        console.log(this.errCount, count)
        if (count != this.rowData.length) {
            this.isVisible2 = true
            setTimeout(res => {
                this.isVisible = false
                this.isImport = false;
            }, 1000)
        } else {
            setTimeout(res => {
                this.isVisible = false
                this.isImport = false;
            }, 1000)
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
    async getProfile(idcard, name, major, education) {
        return new Promise(async (resolve, reject) => {
            let Profile = new Parse.Query("Profile");
            if (idcard) {
                Profile.equalTo("idcard", idcard.trim());
            }
            if (name) {
                Profile.equalTo("name", name.trim());
            }
            Profile.equalTo("company", "1ErpDVc1u6");
            Profile.equalTo("education", education);
            // Profile.equalTo("SchoolMajor", major);
            let profile = await Profile.first();
            if (profile && profile.id) {
                profile.set("isCross", false)
                profile.set("studentType", "在籍学员")
                resolve(profile);
            } else {
                let P = Parse.Object.extend("Profile");
                let p = new P();
                p.set("company", {
                    __type: "Pointer",
                    className: "Company",
                    objectId: "1ErpDVc1u6"
                });
                p.set("isCross", false);
                p.set("studentType", "在籍学员")
                resolve(p);
            }
        });
    }

    nationList = [
        "汉",
        "蒙古",
        "回",
        "藏",
        "维吾尔",
        "苗",
        "彝",
        "壮",
        "布依",
        "朝鲜",
        "满",
        "侗",
        "瑶",
        "白",
        "土家",
        "哈尼",
        "哈萨克",
        "傣",
        "黎",
        "傈僳",
        "佤",
        "畲",
        "高山",
        "拉祜",
        "水",
        "东乡",
        "纳西",
        "景颇",
        "柯尔克孜",
        "土",
        "达斡尔",
        "仫佬",
        "羌",
        "布朗",
        "撒拉",
        "毛难",
        "仡佬",
        "锡伯",
        "阿昌",
        "普米",
        "塔吉克",
        "怒",
        "乌孜别克",
        "俄罗斯",
        "鄂温克",
        "崩龙",
        "保安",
        "裕固",
        "京",
        "塔塔尔",
        "独龙",
        "鄂伦春",
        "赫哲",
        "门巴",
        "珞巴",
        "基诺",
        "其他",
        "外国血统",
        "未采集"
    ]

    positionList = ["中国共产党中央委员会和地方各级组",
        "国家机关及其工作机构负责人",
        "民主党派和社会团体及其工作机构负",
        "事业单位负责人",
        "企业负责人",
        "军人",
        "不便分类的其他从业人员",
        "待业、失业及无业人员",
        "科学研究人员",
        "工程技术人员",
        "农业技术人员",
        "飞机和船舶技术人员",
        "卫生专业技术人员",
        "经济业务人员",
        "金融业务人员",
        "法律专业人员",
        "教学人员",
        "文学艺术工作人员",
        "体育工作人员",
        "新闻出版、文化工作人员",
        "宗教职业者",
        "其他专业技术人员",
        "学生",
        "行政办公人员",
        "安全保卫和消防人员",
        "邮政和电信业务人员",
        "其他办事人员和有关人员",
        "购销人员",
        "仓储人员",
        "餐饮服务人员",
        "饭店、旅游及健身娱乐场所服务人员",
        "运输服务人员",
        "医疗卫生辅助服务人员",
        "社会服务和居民生活服务人员",
        "其他商业、服务业人员",
        "种植业生产人员",
        "林业生产及野生动植物保护人员",
        "畜牧业生产人员",
        "渔业生产人员",
        "水利设施管理养护人员",
        "其他农、林、牧、渔、水利业生产人",
        "勘测及矿物开采人员",
        "金属冶炼、轧制人员",
        "化工产品生产人员",
        "机械制造加工人员",
        "机电产品装配人员",
        "机械设备修理人员",
        "电力设备安装、运行、检修及供电人",
        "电子元器件与设备制造、装配、调试",
        "橡胶和塑料制品生产人员",
        "纺织、针织、印染人员",
        "裁剪、缝纫和皮革、毛皮制品加工制",
        "粮油、食品、饮料生产加工及饲料生",
        "烟草及其制品加工人员",
        "药品生产人员",
        "木材加工、人造板生产、木制品制作",
        "建筑材料生产加工人员",
        "玻璃、陶瓷、搪瓷及其制品生产加工",
        "广播影视制品制作、播放及文物保护",
        "印刷人员",
        "工艺、美术品制作人员",
        "文化教育、体育用品制作人员",
        "工程施工人员",
        "运输设备操作人员及有关人员",
        "环境监测与废物处理人员",
        "检验、计量人员",
        "其他生产、运输设备操作人员及有关",
        "未采集"]
}

