import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";

import * as Parse from "parse";
import { AuthService } from "../../services/auth.service";
import { HttpClient } from "@angular/common/http";
@Component({
	selector: "app-student-profile",
	templateUrl: "./student-profile.component.html",
	styleUrls: ["./student-profile.component.scss"],
})
export class StudentProfileComponent implements OnInit {
	// 当前tab项索引
	current: number = 0;
	// 意见反馈子级tab项索引
	current2: number = 1;
	// 意见反馈类型
	fbType: string = '学生问答';
	// 意见反馈内容
	feedbackContent: string = ''
	// 当前用户
	currentUser: any;
	// 当前用户手机号
	mymobile: string;
	// 输入的手机号
	mobile: string;
	sms: boolean = true;
	verifyCode: any
	// 等待时间
	wait: number = 60;
	// 等待状态
	waitStatus: boolean = false;
	// 修改密码

	newPassword: any;
	confirmPassword: any;
	constructor(
		public authService: AuthService,
		private message: NzMessageService,
		private router: Router,
		private http: HttpClient
	) { }

	// 个人档案
	schoolname: any;
	Profile: any = [];
	// 加入党派
	joinDetail: any = [
		{
			joinTime: "",
			joinLocal: "",
			introducePerson: "",
			joinParty: "",
			becomeTime: "",
		},
		{
			joinTime: "",
			joinLocal: "",
			introducePerson: "",
			joinParty: "",
			becomeTime: "",
		},
	];
	relation: any = [
		{
			filiation: "",
			name: "",
			sex: "",
			age: "",
			work: "",
			political: "",
			address: "",
		},
		{
			filiation: "",
			name: "",
			sex: "",
			age: "",
			work: "",
			political: "",
			address: "",
		},
	];
	reward: "";
	punish: "";
	eduResume: any = [
		{
			Period: "",
			schoolname: "",
			witness: "",
		},
		{
			Period: "",
			schoolname: "",
			witness: "",
		},
	];

	workResume: any = [
		{
			workPeriod: "",
			Workunit: "",
			job: "",
			voucher: "",
		},
		{
			workPeriod: "",
			Workunit: "",
			job: "",
			voucher: "",
		},
	];
	selfIntroduction: "";

	ngOnInit() {
		this.getProfile();
		this.currentUser = Parse.User.current();
	}

	async submitInfo() {
		let joinDetail = this.joinDetail;
		let relation = this.relation;
		let eduResume = this.eduResume;
		let workResume = this.workResume;
		let reward = this.reward;
		let punish = this.punish;
		let selfIntroduction = this.selfIntroduction;
		let query = new Parse.Query("SchoolEduFile");
		let profileId = this.Profile.objectId;
		query.equalTo("profile", profileId);
		let eduFile: any = await query.first();
		if (eduFile && eduFile.id) {
			eduFile.set("joinDetail", joinDetail);
			eduFile.set("relation", relation);
			eduFile.set("eduResume", eduResume);
			eduFile.set("workResume", workResume);
			eduFile.set("reward", reward);
			eduFile.set("punish", punish);
			eduFile.set("selfIntroduction", selfIntroduction);
			eduFile.set("departments", this.Profile.departments);
			eduFile.save().then((res) => {
				this.message.success("提交成功");
			});
		} else {
			let SchoolEduFile = Parse.Object.extend("SchoolEduFile");
			let schoolEduFile = new SchoolEduFile();
			schoolEduFile.set("joinDetail", joinDetail);
			schoolEduFile.set("relation", relation);
			schoolEduFile.set("eduResume", eduResume);
			schoolEduFile.set("workResume", workResume);
			schoolEduFile.set("reward", reward);
			schoolEduFile.set("punish", punish);
			schoolEduFile.set("selfIntroduction", selfIntroduction);
			schoolEduFile.set("profile", {
				__type: "Pointer",
				className: "Profile",
				objectId: profileId,
			});
			eduFile.set("departments", this.Profile.departments);
			schoolEduFile.save().then((res) => {
				this.message.success("提交成功");
			});
		}
	}
	async getEduFile() {
		let query = new Parse.Query("SchoolEduFile");
		let profileId = this.Profile.objectId;
		query.equalTo("profile", profileId);
		let eduFile: any = await query.first();
		if (eduFile && eduFile.id) {
			this.joinDetail = eduFile.get("joinDetail") || [];
			this.relation = eduFile.get("relation") || [];
			this.eduResume = eduFile.get("eduResume") || [];
			this.workResume = eduFile.get("workResume") || [];
			this.reward = eduFile.get("reward") || "";
			this.punish = eduFile.get("punish") || "";
			this.selfIntroduction = eduFile.get("selfIntroduction") || "";
			console.log(this.joinDetail);
		}
	}

	/* 打印 */
	print() {
		document.body.innerHTML = document.getElementById("applica_nav").innerHTML;
		window.print();
	}

	async getProfile() {
		let user = Parse.User.current();
		let queryProfile = new Parse.Query("Profile");
		queryProfile.equalTo("user", user.id);
		queryProfile.include("SchoolMajor");
		await queryProfile
			.first()
			.then(async (res) => {
				let profile: any = res;
				// if (res && res.id) {
				//   console.log(res)
				//   let id = res.get('schoolClass').id
				//   this.getSchoolClass(id)

				//   let ProfileId = res.id

				// let querySchoolSingleScore = new Parse.Query('SchoolSingleScore')
				// querySchoolSingleScore.equalTo("user",ProfileId)
				// querySchoolSingleScore.find().then(res=>{
				//   this.SchoolSingleScore=res
				//   this.SchoolSingleScore.forEach(item => {
				//       // item.get('lesson')
				//       let score = 0
				//       score += item.get("score")
				//       let querylesson = new Parse.Query("Lesson");
				//       querylesson.equalTo("objectId",item.get('lesson'))
				//       querylesson.first().then(rest=>{
				//         item.title=rest.get('title')
				//         item.tag=rest.get('tag')
				//       })
				//   this.appcredit = score
				//   });
				//   console.log(this.SchoolSingleScore)

				// })

				// profile.entryDate = new Date(profile.entryDate)
				this.Profile = profile.toJSON();
				console.log(this.Profile)
				console.log(this.Profile.entryDate.iso)

				this.getEduFile();

				// let department = await profile.get('department').fetch()
				// // let companyId = await department.get('subCompany').id
				// let companyId = await department.get('subCompany').id
				// this.schoolname = companyId
				// console.log(this.schoolname)
				// let queryArticle = new Parse.Query("Article");
				// queryArticle.equalTo("company", this.schoolname);
				// queryArticle.limit(5)
				// await queryArticle.find().then(res => {
				//   console.log(res)
				//   this.articles = res
				// })

				// console.log(this.Profile, companyId)
				// this.getSchoolMajors()
			})
			.catch((err) => {
				if (err.toString().indexOf("209") != -1) {
					console.log(err.toString(), err.toString().indexOf("209"));
					this.sessionVisible = true;
					this.parseErr = err;
				}
			});
	}
	parseErr: any;
	handleOk(): void {
		setTimeout(() => {
			this.sessionVisible = false;
			this.authService.logout("notSession");
		}, 1000);
	}

	sessionVisible: boolean = false;
	tabControl(current) {
		this.current = current;
	}
	tabControl2(current2) {
		this.current2 = current2;
	}
	// 毕业档案 新增一行
	addRow(type) {
		if (type == "relation") {
			this.relation.push({
				filiation: "",
				name: "",
				sex: "",
				age: "",
				work: "",
				political: "",
				address: "",
			});
		}
		if (type == "eduResume") {
			this.eduResume.push({
				Period: "",
				schoolname: "",
				witness: "",
			});
		}
		if (type == "workResume") {
			this.workResume.push({
				workPeriod: "",
				Workunit: "",
				job: "",
				voucher: "",
			});
		}
		if (type == "joinDetail") {
			console.log(this.joinDetail);
			this.joinDetail.push({
				joinTime: "",
				joinLocal: "",
				introducePerson: "",
				joinParty: "",
				becomeTime: "",
			});
		}
	}
	deleteRow(type) {
		if (type == "relation") {
			if (this.relation.length <= 2) {
				this.message.info("数据只剩两行，无法继续删除");
			} else {
				this.relation.splice(this.relation.length - 1, 1);
			}
		}
		if (type == "eduResume") {
			if (this.eduResume.length <= 2) {
				this.message.info("数据只剩两行，无法继续删除");
			} else {
				this.eduResume.splice(this.eduResume.length - 1, 1);
			}
		}
		if (type == "workResume") {
			if (this.workResume.length <= 2) {
				this.message.info("数据只剩两行，无法继续删除");
			} else {
				this.workResume.splice(this.workResume.length - 1, 1);
			}
		}
		if (type == "joinDetail") {
			if (this.joinDetail.length <= 2) {
				this.message.info("数据只剩两行，无法继续删除");
			} else {
				this.joinDetail.splice(this.joinDetail.length - 1, 1);
			}
		}
	}

	time() {
		if (this.wait == 0) {
			this.waitStatus = false
			this.wait = 60
		} else {
			this.waitStatus = true
			this.wait--
			setTimeout(() => {
				this.time()
			}, 1000)
		}
	}

	sendVerifyCode() {
		let user = Parse.User.current()
		if (user && user.get('username')) {
			let url = "https://server.fmode.cn/api/apig/message"
			this.http.post(url, { company: 'pPZbxElQQo', mobile: user.get('username'), action: 'resetPassword' }).subscribe((res: any) => {
				console.log(res)
				this.time()
			}, error => {
				this.message.info(`系统繁忙中，请稍后重试`);
				console.log(error)
			})
		} else {
			this.message.info(`登录已过期请重新登录`);
			this.router.navigate(["masterol/student-login"]);
		}
	}

	async checkCode(mobile, code) {
		let url = "https://server.fmode.cn/api/apig/verifyCode"
		return new Promise(async (resolve, reject) => {
			this.http.post(url, { mobile: mobile, code: code }).subscribe((res: any) => {
				resolve(res)
			}, error => {
				console.log(error)
				resolve(error.error)
			})
		})
	}



	async editPassword() {
		let verifyCode = this.verifyCode
		let newPassword = this.newPassword;
		let confirmPassword = this.confirmPassword;
		if (newPassword == undefined || newPassword.trim() == "") {
			this.message.info("请输入新密码");
			return;
		}
		if (newPassword.length < 6) {
			this.message.info("密码长度不得小于6位");
			return;
		}
		if (confirmPassword == undefined || confirmPassword.trim() == "") {
			this.message.info("请再次确认密码");
			return;
		}

		if (newPassword.trim() != confirmPassword.trim()) {
			this.message.info("两次密码输入不一致");
			return;
		}
		let user = this.currentUser;
		let checkInfo: any = await this.checkCode(user.get('username'), verifyCode)
		if (checkInfo && checkInfo.code != 200) {
			this.message.create("error", checkInfo.mess);
			return
		} else {
			user.set('password', confirmPassword)
			Parse.Cloud.run('user_save', {
				userJson: user.toJSON()
			  }).then((data)=> {
				this.message.success("密码修改成功,请重新登录");
				setTimeout(res => {
					this.router.navigate(["masterol/student-login"]);
				}, 500)
			  }).catch((err) => {
				this.message.error("密码修改失败,请稍后重试");
			})
			
		}
	}

	// 提交意见反馈
	commitFeedback() {
		let user = Parse.User.current();
		let company = localStorage.getItem("company")
		if (this.feedbackContent == '' || this.feedbackContent.trim() == '') {
			this.message.info("请先输入反馈意见")
		} else {
			let SaveFeedback = Parse.Object.extend("Feedback");
			let saveFeedback = new SaveFeedback();
			saveFeedback.set("profile", {
				__type: "Pointer",
				className: "Profile",
				objectId: this.Profile.objectId
			});
			saveFeedback.set("user", {
				__type: "Pointer",
				className: "_User",
				objectId: user.id
			});
			saveFeedback.set("company", {
				__type: "Pointer",
				className: "Company",
				objectId: company
			});
			saveFeedback.set("type", this.fbType);
			saveFeedback.set("content", this.feedbackContent);
			saveFeedback.save().then(() => {
				this.message.info("提交成功");
				this.feedbackContent = ''
			})
		}
	}
}
