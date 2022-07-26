import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import * as Parse from "parse";
import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { NzModalService } from "ng-zorro-antd/modal";

@Component({
	selector: "app-student-manage",
	templateUrl: "./student-manage.component.html",
	styleUrls: ["./student-manage.component.scss"],
	providers: [DatePipe],
})
export class StudentManageComponent implements OnInit {
	exam: Parse.Object<Parse.Attributes>;

	constructor(
		private activRoute: ActivatedRoute,
		private message: NzMessageService,
		private cdRef: ChangeDetectorRef,
		private datePipe: DatePipe,
		private http: HttpClient,
		private modal: NzModalService
	) { }
	recruit: any; // 招生计划
	company: any;
	pCompany: any;
	claStudents: any[]; // 当前班级学生
	students: any[]; // 待分配学生
	studentLen: number; // 待分配学生数量
	studentsIdArr: any[]; // 待分配学生id数组
	classId: string; // 班级id
	department: string; // 院校
	departName: string; // 院校名称
	seating: any; // 考场总人数
	sClass: any; // 考场
	isLoading: boolean = false;
	listOfColumn = [
		{
			title: "学生姓名",
			key: "name",
			compare: null,
			priority: false,
		},
		{
			title: "身份证号",
			key: "idcard",
			compare: null,
			priority: false,
		},
		{
			title: "手机号",
			key: "mobile",
			compare: null,
			priority: false,
		},
		{
			title: "座位号",
			key: "cardnum",
			compare: null,
			priority: false,
		},
		{
			title: "语种",
			key: "lang",
			compare: null,
			priority: false,
		},
		{
			title: "准考证号",
			key: "workid",
			compare: null,
			priority: false,
		},
		{
			title: '操作',
			compare: null,
			priority: false
		}
	];
	listOfColumn2 = [
		{
			title: "学生姓名",
			compare: null,
			priority: false,
		},
		{
			title: "身份证号",
			compare: null,
			priority: false,
		},
		{
			title: "语种",
			compare: null,
			priority: false,
		},
		{
			title: "地区",
			compare: null,
			priority: false,
		},
	];
	listOfData: any = [];
	filterData: Array<any> = [];
	filterType: string;
	nameVal: string;
	inputValue: String;
	searchType: any = "name";
	radioValue = "order";
	addIdArr: any[];
	areas: any[] = [
		{
			code: "inside",
			name: "省内",
		},
		{
			code: "outer",
			name: "省外",
		},
	];
	area: string = null; // 省内/省外  inside/outer
	ngOnInit(): void {
		this.activRoute.paramMap.subscribe(async (params) => {
			this.classId = params.get("PobjectId");
			await this.getClassDepart();
			let companyId = localStorage.getItem("company");
			let Company = new Parse.Query("Company");
			if (companyId) {
				this.company = await Company.get(companyId);
			}
			console.log(this.department);
			if (this.department) {
				this.pCompany = this.company.get("company");
			}

			this.addIdArr = [];
			this.getExam();
			this.getClaStudents();
		});
	}
	async getExam() {
		let Exam = new Parse.Query("Exam");
		Exam.equalTo("isEnable", true);
		Exam.equalTo("department", this.department);
		let exam = await Exam.first();
		if (exam && exam.id) {
			this.exam = exam;
		}
	}
	async getClassDepart() {
		let Class = new Parse.Query("SchoolClass");
		Class.equalTo("objectId", this.classId);
		Class.ascending("updatedAt");
		Class.include("department");
		let sClass = await Class.first();
		if (sClass && sClass.id) {
			this.sClass = sClass;
			this.seating = sClass.get("seating");
			console.log(this.sClass);
			if (sClass.get("department")) {
				this.department = sClass.get("department").id;
				this.departName = sClass.get("department").get("name");
				return sClass.get("department");
			} else {
				this.message.create("error", "无所属院校");
			}
		}
	}
	async getClaStudents() {
		this.claStudents = [];
		let recruit = await this.getRecruit();
		if (recruit && recruit.id) {
			let Profile = new Parse.Query("Profile");
			Profile.notEqualTo("isDeleted", true);
			Profile.equalTo("schoolClass", this.classId);
			Profile.ascending("cardnum");
			Profile.include("SchoolMajor");
			let profileArr: any = await Profile.find();
			console.log(profileArr);
			if (profileArr) {
				this.claStudents = profileArr;
				this.listOfData = profileArr;
				this.filterData = profileArr;
				console.log(profileArr);
			}
		} else {
			this.message.error("报名计划未开启");
		}
	}
	async getRecruit() {
		let RecruitStudent = new Parse.Query("RecruitStudent");
		RecruitStudent.equalTo("isOpen", true);
		RecruitStudent.equalTo("department", this.department);
		let recruitStudent: any = await RecruitStudent.first();
		if (recruitStudent && recruitStudent.id) {
			console.log(recruitStudent);
			this.recruit = recruitStudent;
			return recruitStudent;
		}
	}
	// 待导入考生数据
	async getStudents() {
		let area = this.area;// 地区
		let radioValue = this.radioValue;// 排序方式
		let nameVal = this.nameVal;// 考生姓名
		this.isLoading = true;
		let cateId = localStorage.getItem("cateId");
		console.log(this.sClass.get("seating"), this.claStudents.length);
		let compSdt = this.sClass.get("seating") - this.claStudents.length;
		this.students = [];
		this.studentsIdArr = [];
		this.addIdArr = [];
		console.log(compSdt, this.department);
		// 语种
		let langs = this.sClass.get("lang");
		let department = this.sClass.get("department").id;
		let baseurl = localStorage.getItem("NOVA_SERVERURL")
			? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select"
			: "https://server.fmode.cn/api/novaql/select";
		// and "pro"."state" = 'success'
		let basesql = `select "pro"."objectId","pro"."name","pro"."idcard","pro"."lang","pro"."area"
    from (select * from "Profile" where "isDeleted" is not true) as "pro"
    left join "AccountLog" as "log" on SUBSTRING("log"."orderId",2,10) = "pro"."objectId"
    where "pro"."schoolClass"  is null
     and "pro"."department" = '${department}'
    and "log"."isVerified" = true and "log"."isback" is not true and  "log"."desc" like '%${this.recruit.id}%'
    and  position("pro"."langCode" in '${langs}') > 0`;


		// 硕士同等学历英语考试使用，临时添加
		console.log(this.company);
		if (this.company.id == "jKj2z6MD07") {
			basesql = `select "pro"."objectId","pro"."name","pro"."idcard","pro"."lang","pro"."area"
      from (select * from "Profile" where "isDeleted" is not true) as "pro"
      where "pro"."schoolClass"  is null
      and "pro"."department" = '${department}'
      and  position("pro"."langCode" in '${langs}') > 0`;
		}
		let cateSql = ' ';
		let orderSql = ' ';
		let areaSql = ' ';
		let searchSql = ' ';
		let limitSql = `limit ${compSdt}`;
		let sql;
		switch (radioValue) {
			case 'order':
				orderSql = `order by "pro"."createdAt" asc`;
				break;
			case 'random':
				orderSql = `order by "pro"."updatedAt" asc`;
				break;
			default:
				break;
		}
		switch (area) {
			case 'inside':
				areaSql = `and "pro"."area" @> '["江西省"]'`;
				break;
			case 'outer':
				areaSql = `and "pro"."area"::text not like '%江西省%'`;
				break;
			default:
				break;
		}
		if (nameVal && nameVal.trim() != '') {
			searchSql = `and "pro"."name" like '%${nameVal}%'`;
		}
		console.log(this.department, cateId, this.recruit.id, areaSql, orderSql);
		if (cateId) {
			cateSql = `and "pro"."cates"  @> '[{ "objectId": "${cateId}"}]'`;
			sql = `${basesql} ${cateSql}  ${areaSql} ${searchSql} ${orderSql} ${limitSql}`;
		} else {
			sql = `${basesql}  ${areaSql} ${searchSql} ${orderSql} ${limitSql}`;
		}
		console.log(sql);

		this.http.post(baseurl, { sql: sql }).subscribe(async (res: any) => {
			console.log(res);
			if (res.code == 200) {
				if (res.data && res.data.length) {
					this.students = res.data;
					this.studentLen = res.data.length;
					this.students.forEach((student) => {
						student.checked = true;
						this.studentsIdArr.push(student.objectId);
						this.addIdArr.push(student.objectId);
					});
					this.isLoading = false;
				} else {
					this.isLoading = false;
				}
			} else {
				this.message.info("网络繁忙，数据获取失败");
			}
		});

		// for (let index = 0; index < langLen; index++) {
		//   const lang = langs[index];
		//   let langQuery = new Parse.Query("Profile");
		//   langQuery.equalTo("langCode", lang);
		//   langQuery.equalTo("schoolClass", undefined);
		//   langQuery.equalTo("state", "success");
		//   langQuery.equalTo("department", this.department);
		//   langQuery.containedIn("RecruitArray", [{
		//     "__type": "Pointer",
		//     "className": "RecruitStudent",
		//     "objectId": this.recruit.id
		//   }]);

		//   langQuery.include("SchoolMajor");
		//   if (cateId) {
		//     langQuery.containedIn("cates", [{
		//       "__type": "Pointer",
		//       "className": "Category",
		//       "objectId": cateId
		//     }]);
		//   }
		//   langQuery.include("cates");
		//   if (radioValue && radioValue == 'order') {
		//     langQuery.ascending("createdAt");
		//   }
		//   // if (lang && lang != '') {
		//   //   Profile.contains("lang", lang);
		//   // }
		//   if (area && area == 'inside') {
		//     langQuery.containedIn("area", ['江西省']);
		//   }
		//   if (area && area == 'outer') {
		//     langQuery.notContainedIn("area", ['江西省']);
		//   }
		//   querys.push(langQuery);
		//   if (index + 1 == langLen) {
		//   }
		// }

		// let Profile = Parse.Query.or(...querys);
		// console.log(Profile, querys);
		// Profile.limit(compSdt);
		// let profileArr: any = await Profile.find();
		// console.log(profileArr);
		// if (profileArr && profileArr.length) {
		//   this.students = profileArr;
		//   this.studentLen = profileArr.length;
		//   this.students.forEach(student => {
		//     student.checked = true;
		//     this.studentsIdArr.push(student.id);
		//     this.addIdArr.push(student.id)
		//   })
		// }
	}
	provinceChange(e) {
		this.searchType = e;
	}
	// 搜索考场内考生
	searchStudent() {
		console.log(this.searchType);
		if (!this.inputValue) {
			this.filterData = this.listOfData;
			return;
		}
		this.filterData = this.listOfData.filter((item: any) => {
			return (
				item.get(this.searchType) &&
				item.get(this.searchType).indexOf(this.inputValue) > -1
			);
		});
		console.log(this.filterData);
		this.cdRef.detectChanges();
	}
	langValue: string = "";
	rmvModal: any;
	rmvId: string;
	rmvMsg: string;
	async removeStu(id?) {
		this.rmvId = null;
		if (id) {
			this.rmvId = id;
			this.rmvMsg = "确认将该学生移出该考场?";
			this.rmvModal = true;
		} else {
			this.rmvMsg = "确认清空该考场考生?";
			this.listOfData.length
				? (this.rmvModal = true)
				: this.message.info("暂无考生");
		}
	}
	async rmvOk() {
		this.isConfirmLoading = true;
		let Profile = new Parse.Query("Profile");
		Profile.notEqualTo("isDeleted", true);
		let profile: any;
		if (this.rmvId) {
			Profile.equalTo("objectId", this.rmvId);
			profile = await Profile.first();
			if (profile && profile.id) {
				profile.set("schoolClass", null);
				profile.set("cardnum", null);
				profile.set("workid", null);
				profile.set("location", "");
				profile.set("serial", "");
				profile.save().then((pro) => {
					console.log(pro);
					if (pro && pro.id) {
						this.isConfirmLoading = false;
						this.getClaStudents();
						this.cdRef.detectChanges();
						this.rmvModal = false;
						this.message.create("info", "操作成功");
					}
				});
			}
		} else {
			Profile.equalTo("schoolClass", this.classId);
			profile = await Profile.find();
			if (profile && profile.length) {
				profile.forEach((pro) => {
					pro.set("schoolClass", null);
					pro.set("cardnum", null);
					pro.set("workid", null);
					pro.set("location", "");
					pro.set("serial", "");
					pro.save();
				});
				this.isConfirmLoading = false;
				this.listOfData = [];
				this.filterData = [];
				this.getClaStudents();
				this.cdRef.detectChanges();
				this.rmvModal = false;
				this.message.create("info", "操作成功");
			} else {
				this.isConfirmLoading = false;
				this.listOfData = [];
				this.filterData = [];
				this.getClaStudents();
				this.cdRef.detectChanges();
				this.rmvModal = false;
				this.message.create("info", "操作成功");
			}
		}
	}
	showEditModal: any;
	showModal() {
		if (this.sClass.get("lang")) {
			this.getStudents();
			this.showEditModal = true;
		} else {
			this.message.error("请先返回考场管理页设置考场语种");
		}
	}

	handleCancel() {
		this.showEditModal = false;
	}
	msgModal: boolean = false;
	msg: string = "";
	isConfirmLoading: boolean = false;
	async handleOk() {
		this.isConfirmLoading = true;
		console.log(this.addIdArr);
		console.log(this.students);
		let tempArr = [];
		tempArr = this.AllChecked ? this.studentsIdArr : this.addIdArr;
		console.log(tempArr.length, this.seating, this.claStudents.length);
		// 置空
		this.addIdArr = [];
		if (tempArr.length > this.seating - this.claStudents.length) {
			this.message.error(
				"超过该考场限制人数，请重新选择" +
				"(" +
				(tempArr.length + this.claStudents.length) +
				"/" +
				this.seating +
				")"
			);
			return;
		}
		console.log("aaaaaaaaaa", tempArr);
		this.message.info("考生导入中");
		for (let index = 0; index < tempArr.length; index++) {
			let Profile = new Parse.Query("Profile");
			Profile.notEqualTo("isDeleted", true);
			const addId = tempArr[index];
			Profile.equalTo("objectId", addId)
			let pro = await Profile.first()
			if (pro && pro.id) {
				pro.set("schoolClass", {
					className: "SchoolClass",
					__type: "Pointer",
					objectId: this.classId,
				});
				let count = await this.getCount();
				let seat = count + 1 >= 10 ? "" + (count + 1) : "0" + (count + 1);
				pro.set("cardnum", seat);
				pro.set("location", this.sClass.get("address"));
				pro.set("serial", this.sClass.get("testNumber") + '');
				console.log(seat);

				await pro.save();
				if (pro && pro.id) {
					console.log(pro);
				} else {
					this.message.create("error", "操作失败");
					return;
				}
			}
			// Profile.equalTo("objectId", addId);
			// let profile: any = await Profile.first();
		}
		setTimeout(() => {
			this.isConfirmLoading = false;
			this.message.create("success", "操作成功");
			this.getClaStudents();
			this.showEditModal = false;
		}, 1000);
	}
	loadExamNum: boolean = false;
	async setExamNum() {
		let ruleConf = this.recruit && this.recruit.get("config")["ruleConf"];
		if (!ruleConf) {
			this.msg =
				"招生计划下未配置准考证号生成规则，请先返回配置准考证号生成规则。";
			this.msgModal = true;
			return;
		}
		let examNumConf = ruleConf["examNumConf"];
		if (!examNumConf) {
			this.msg =
				"招生计划下未配置准考证号生成规则，请先返回配置准考证号生成规则。";
			this.msgModal = true;
			return;
		}
		let listData = this.listOfData;
		let listLen = this.listOfData.length;
		if (listLen) {
			this.loadExamNum = true;
			for (let index = 0; index < listLen; index++) {
				let item = listData[index];
				let examNum = await this.getExamNum(
					item,
					examNumConf,
					item.get("cardnum")
				); //seat 座位号
				console.log(examNum);
				item.set("workid", examNum); // 当前时间加考场号 座位号
				await item.save();
			}
			this.loadExamNum = false;
		} else {
			this.message.info("暂无考生");
		}
	}
	// 先根据classname判断是哪张表，在依据字段类型判断
	getExamNum(profile, examNumConf, seat) {
		return new Promise(async (resolve, reject) => {
			let examNum = "";
			let numLen = examNumConf.length;
			try {
				for (let index = 0; index < numLen; index++) {
					let conf = examNumConf[index];
					if (conf.isEnabled) {
						if (conf["className"]) {
							switch (conf["className"]) {
								case "Profile":
									switch (conf["type"]) {
										case "String":
											if (conf["field"] == "degreeNumber") {
												let numLen = profile.get("degreeNumber").length;
												let num;
												// 南大获取报名序号后5位
												if (this.company.id == "EATkBGf8T9") {
													num = profile.get("degreeNumber").substring(numLen - 5, numLen);
												} else {
													// 其他院校获取报名序号后4位
													num = profile.get("degreeNumber").substring(numLen - 4, numLen);
												}
												examNum += num;
											} else if (conf["field"] == "cardnum") {
												console.log(conf["field"]);
												examNum += seat;
											} else {
												console.log(conf["field"], profile.get(conf["field"]));
												examNum += profile.get(conf["field"])
													? profile.get(conf["field"])
													: "";
											}
											break;
										case "Number":
											console.log(conf["field"]);
											if (profile.get(conf["field"])) {
												examNum += profile.get(conf["field"]);
											}
											break;
										// 所属报名站点代码
										case "Array":
											if (
												conf["field"] == "cates" &&
												profile.get(conf["field"]) &&
												profile.get("cates").length
											) {
												console.log(conf["field"]);
												let name_en = "";
												if (profile.get("cates")[0]) {
													let namealias = profile
														.get("cates")[0]
														.get("name_en");
													if (namealias) {
														name_en = namealias;
													} else {
														name_en = await this.getNameEn(
															profile.get("cates")[0].id
														);
													}
												}
												console.log(name_en);
												console.log("cates", profile.get(conf["field"]));
												examNum += name_en;
											}
											break;
										// 所属考场编号
										case "Pointer":
											console.log(conf["field"]);
											if (
												profile.get(conf["field"]) &&
												conf["field"] == "schoolClass"
											) {
												if (this.sClass.get(conf["pointField"])) {
													let classNum = this.sClass.get(conf["pointField"]);
													console.log(this.department);

													if (this.department == "UmjXxAjvBK") {
														examNum +=
															classNum < 10
																? "00" + classNum
																: classNum < 100
																	? "0" + classNum
																	: classNum;
													} else {
														examNum +=
															classNum < 10 ? "0" + classNum : classNum;
													}
												}
											}
											break;
										default:
											break;
									}

									break;
								case "RecruitStudent":
									console.log(this.recruit);
									if (this.recruit.get(conf["field"])) {
										console.log(this.recruit.get(conf["field"]));
										examNum += this.recruit.get(conf["field"])
											? this.recruit.get(conf["field"])
											: "";
									}
									break;
								case "Company":
									console.log(this.company);
									if (this.company.get(conf["field"])) {
										console.log(this.company.get(conf["field"]));
										examNum += this.company.get(conf["field"])
											? this.company.get(conf["field"])
											: "";
									}
									break;
								default:
									break;
							}
						} else {
							// 非数据库数据 如date
							if (conf["type"] == "date") {
								let date = this.getTime(null, conf["value"]);
								examNum += date;
							}
						}
					}
					if (index + 1 == numLen) {
						resolve(examNum);
					}
				}
			} catch {
				this.loadExamNum = false;
				this.message.error("准考证号生成错误,请检查准考证号生成规则");
			}
		});
	}

	async getNameEn(cateId) {
		console.log(cateId);

		let Category: any = new Parse.Query("Category");
		let cate = await Category.get(cateId);
		console.log(cate);
		if (cate && cate.id) {
			return cate.get("name_en");
		} else {
			return "";
		}
	}
	getTime(date, format) {
		if (!date) {
			date = new Date();
		}
		if (!format) {
			format = "YYYY";
		}
		let year = date.getFullYear();
		let month =
			date.getMonth() >= 10 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
		let day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
		switch (format) {
			case "YYYY-MM-DD":
				return year + "-" + month + "-" + day;
			case "YYYYMMDD":
				return year + month + day;
			case "YYYY":
				return year;
			case "YY":
				console.log(format, year);
				year = (year + "").substring(2);
				return year;
			default:
				break;
		}
	}
	async getCount() {
		let profile: any = new Parse.Query("Profile");
		profile.notEqualTo("isDeleted", true);
		profile.equalTo("schoolClass", this.classId);
		profile.equalTo("department", this.department);
		let count = await profile.count();
		return count;
	}
	AllChecked: boolean = true;
	onAllChecked(value: boolean): void {
		console.log("select all 2");
		this.students.forEach((item) => {
			item.checked = this.AllChecked;
		});
		if (this.AllChecked == false) {
			this.addIdArr = [];
		}
		console.log(this.AllChecked);

		// this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
		// this.refreshCheckedStatus();
	}
	onItemChecked(id, e) {
		console.log(id, e);
		if (e == true) {
			this.addIdArr.push(id);
		} else {
			this.AllChecked = false;
			this.addIdArr.splice(
				this.addIdArr.findIndex((item) => item == id),
				1
			);
		}
		console.log(this.addIdArr);
		// 全部选择后全选自动为true
		let status = true;
		this.students.forEach((student) => {
			if (!student.checked) {
				status = false;
			} else {
				return;
			}
		});
		setTimeout(() => {
			console.log(status);
			if (status == true) {
				this.AllChecked = true;
			}
		}, 500);
	}

	/* -------- 短信通知 begin -------- */
	noticeModal: boolean = false;
	siteUrl: string;
	tpl: any;
	errSet = [];
	async checkTpl() {
		let templateId = await this.getTplId();
		// let templateId = "201599";
		// 获取短信模板信息
		let { tpl, errmsg } = await this.getTpl(templateId);
		if (errmsg) {
			this.message.error(errmsg);
			return;
		}
		this.tpl = tpl;
		this.getSiteUrl();

		this.noticeModal = true;
	}
	async getTplId() {
		let Company = new Parse.Query("Company");
		let comp = await Company.get(this.company);
		if (comp && comp.id) {
			return comp.get("config") && comp.get("config")["printNoticeTpl"];
		} else {
			return false;
		}
	}
	async getNoticeLen() {
		let APIGAuth = new Parse.Query("APIGAuth");
		APIGAuth.equalTo("api", "ZssiTFnDZC");
		APIGAuth.equalTo("company", this.company);
		let auth = await APIGAuth.first();
		if (auth && auth.id) {
			return auth;
		} else {
			return false;
		}
	}
	async sendNotice(errSet?) {
		let arr = this.listOfData;
		let arrLen = this.listOfData.length;
		let noticeArr = [];
		let params = {
			tplid: this.tpl.get("tplid"),
			type: "Profile",
			idArr: [],
			recipient: {},
		};
		if (errSet) {
			arr = errSet;
			arrLen = errSet.length;
		}
		if (arrLen) {
			let auth = await this.getNoticeLen();
			if (!auth) {
				this.message.error("未开通短信权限");
				return;
			}
			if (auth.get("count") < arrLen * 2) {
				this.message.error("短信调用次数不足，请及时充值");
				return;
			}
			this.isConfirmLoading = true;
			let beginTime = this.datePipe.transform(
				this.exam.get("printExamTime"),
				"yyyy-MM-dd HH:mm"
			);
			let endTime = this.datePipe.transform(
				this.sClass.get("beginTime"),
				"yyyy-MM-dd HH:mm"
			);
			// templateId recipients : mobile temp_para:school name beginTime endTime site_url
			// mobile name
			console.log(beginTime, endTime);
			params["recipient"] = {
				temp_para: {
					school: this.departName,
					beginTime: beginTime,
					endTime: endTime,
					site_url: `http://${this.siteUrl}/testsystem/index`,
				},
			};
			for (let index = 0; index < arr.length; index++) {
				let student = arr[index];
				params["idArr"].push(student.id);
				if (index + 1 == arr.length) {
					console.log(index, student);
					let res: any = await this.postBatch(params);
					console.log(res);
					if (!res || res.error) {
						// 请求失败
						this.errSet = arr;
						this.isConfirmLoading = false;
						return;
					}
					if (res && res.fail_count) {
						// 有短信发送失败
						this.errSet = [];
						arr.forEach((stu) => {
							res.recipients.forEach((item) => {
								console.log(item.error_message, stu.get("mobile"), item.mobile);
								if (item.error_message && stu.get("mobile") == item.mobile) {
									this.errSet.push(stu);
								}
							});
						});
						console.log(this.errSet);
						this.isConfirmLoading = false;
						return;
					}
					if (res && !res.fail_count) {
						// 短信批量发送成功
						this.errSet = [];
						this.isConfirmLoading = false;
						this.noticeModal = false;
						return;
					}
				}
			}
		} else {
			this.message.info("该考场暂无考生");
		}
	}
	async postBatch(params) {
		return new Promise((resolve, reject) => {
			console.log(params);
			let baseurl = `https://server.fmode.cn/api/notice/send/batch`;
			let companyId = this.company.id;
			params = JSON.stringify(params);
			this.http.post(baseurl, { companyId, params }).subscribe(
				async (res: any) => {
					console.log(res);
					if (res.data) {
						let data = JSON.parse(res.data);
						let success_count;
						let fail_count;
						let recipients;
						// 有短信发送失败  遍历recipients  有error_message  存mobile数组
						if (data.failure_count) {
							success_count = data["success_count"];
							fail_count = data.failure_count;
							recipients = data.recipients;
							this.message.error(
								`成功发送${success_count}条短信，发送失败${fail_count}条`
							);
							resolve({ success_count, fail_count, recipients });
							return;
						}
						this.message.success(`${success_count}条短信发送成功`);
						resolve(res.data);
					} else {
						this.message.error("网络异常，请稍后重试");
						resolve(false);
					}
				},
				(err) => {
					this.message.error("网络异常，请稍后重试");
					resolve(err);
				}
			);
		});
	}
	async getSiteUrl() {
		let querySite = new Parse.Query("Site");
		querySite.equalTo("company", this.company);
		let site = await querySite.first();
		if (site && site.id) {
			this.siteUrl = site.get("domain")[0];
		}
	}
	async setNotice(student, paramsMap) {
		let notice;
		try {
			paramsMap.name = student.get("name");
			let content = await this.paramToStr(this.tpl.get("content"), paramsMap);
			let Notice = Parse.Object.extend("Notice");
			notice = new Notice();
			notice.set("tpl", {
				__type: "Pointer",
				className: "NoticeTpl",
				objectId: this.tpl.id,
			});
			console.log(content, paramsMap);
			notice.set("paramMap", paramsMap);
			notice.set("type", "sms");
			notice.set("company", {
				__type: "Pointer",
				className: "Company",
				objectId: this.company.id,
			});
			notice.set("targets", [
				{
					type: "Profile",
					value: [student.id],
				},
			]);
			await notice.save();
			if (notice && notice.id) {
				return { notice };
			} else {
				return {
					errmsg: "短信内容生成错误",
				};
			}
		} catch (err) {
			console.log(err);
			return {
				errmsg: "短信内容生成错误",
			};
		}
	}
	async cancelNotice() {
		this.noticeModal = false;
		this.errSet = [];
	}
	// sendSMS(recipients) {
	//   return new Promise((resolve, reject) => {
	//     let baseurl = `https://test.fmode.cn/api/notice/send/batch`
	//     let tplid = this.tpl.get("tplid");
	//     this.http.post(baseurl, { tplid, recipients })
	//       .subscribe(async (res: any) => {
	//         console.log(res);
	//         if (res.data.smsdata && res.data.smsdata.indexOf("msg_id") == -1) {
	//           this.message.error("短信发送失败")
	//           resolve(false)
	//         } else {
	//           this.message.success("短信发送成功")
	//           resolve(res.data)
	//         }
	//       });
	//   })
	// }
	async getTpl(templateId) {
		let NoticeTpl = new Parse.Query("NoticeTpl");
		NoticeTpl.equalTo("tplid", templateId);
		NoticeTpl.equalTo("company", this.company);
		let tpl = await NoticeTpl.first();
		if (tpl && tpl.id) {
			return { tpl };
		} else {
			return {
				tpl,
				errmsg: "未配置该短信模板",
			};
		}
	}
	paramToStr(str, params) {
		console.log("parseString", str, params);
		Object.keys(params).forEach((key) => {
			str = str.replace(new RegExp(`{{${key}}}`, "g"), params[key]);
		});
		return str;
	}

	/* 地区选择 */
	areaChange(e) {
		console.log(e);
		this.area = e;
		this.getStudents();
	}


	editId: string;
	cardnum: string;
	cardnum2: string;
	isEdit: boolean;
	editObj: any;
	editObj2: any;
	changeNumModal: boolean;
	/* 表格编辑 */
	startEdit(data, cardNum): void {
		this.isEdit = true;
		this.editId = data.id;
		this.cardnum = cardNum

	}

	async saveEdit(data): Promise<void> {

		if (this.cardnum) {
			// 查询该座位号考生是否已经存在
			console.log(this.cardnum);
			this.editObj = data;
			let pro2: any = this.getProByNum(data.id)
			if (pro2) {
				this.editObj2 = pro2;
				console.log(this.editObj, this.editObj2);
				this.changeNumModal = true;
				console.log(this.editObj, this.editObj2);
				this.cdRef.detectChanges()

			} else {
				this.setCardNum(data.id, this.cardnum)

				// await this.setCardNum(pro2.id, pro2.get("cardnum"))
			}
		} else {
			this.message.error("座位号不可为空")
		}

	}
	reset() {
		this.cardnum = null
		this.cardnum2 = null
		this.editId = null;
		this.isEdit = false;
		this.editObj = null;
		this.editObj2 = null;
	}
	cancelEdit() {
		this.reset()
	}

	getProByNum(id) {
		for (let index = 0; index < this.listOfData.length; index++) {
			let item = this.listOfData[index];
			console.log(item.get("cardnum"), this.cardnum);
			if (item.get("cardnum") == this.cardnum && item.id != id) {
				console.log(item);

				return item
			}
		}
	}
	async setCardNum(id, num) {
		let queryPro = new Parse.Query("Profile")
		queryPro.notEqualTo("isDeleted", true);
		queryPro.equalTo("objectId", id);
		let pro = await queryPro.first()
		pro.set('cardnum', num)
		let res = await pro.save()
		if (res && res.id) {
			console.log(res);
			this.message.success("修改成功")
			this.reset()
		}
	}
	enterExchange() {
		this.setCardNum(this.editObj.id, this.editObj2.get("cardnum"))
		this.setCardNum(this.editObj2.id, this.editObj.get("cardnum"))
		this.reset()
		this.changeNumModal = false;
	}

}
