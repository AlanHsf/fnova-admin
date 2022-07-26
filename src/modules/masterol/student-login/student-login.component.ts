import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../auth.service';
import { JIMService } from '../jim.servvice';
import * as Parse from "parse";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from "@angular/common/http";

@Component({
	selector: "app-student-login",
	templateUrl: "./student-login.component.html",
	styleUrls: ["./student-login.component.scss"]
})
export class StudentLoginComponent implements OnInit {

	constructor(
		public authServ: AuthService,
		public jimServ: JIMService,
		private fb: FormBuilder,
		private message: NzMessageService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private http: HttpClient
	) {
		this.validateForm = this.fb.group({
			// 加入验证的表单项 ： 初始值、 是否验证 调用的验证方法
			username: ["", [Validators.required], [this.userNameAsyncValidator]],
			password: ["", [Validators.required], [this.passwordAsyncValidator]],
			// initCode: [this.code ],
			checkCode: ["", [Validators.required], [this.codeAsyncValidator]]
		});
		this.registForm = this.fb.group({
			// 加入验证的表单项 ： 初始值、 是否验证 调用的验证方法
			registName: ["", [Validators.required], [this.registNameAsyncValidator]],
			registIdcard: ["", [Validators.required], [this.registIdcardAsyncValidator]],
			registPhone: ["", [Validators.required], [this.registPhoneAsyncValidator]],
			phoneCode: ["", [Validators.required], [this.registCodeAsyncValidator]],
			regpassword: ["", [Validators.required], [this.regpasswordAsyncValidator]],
			confirmPassword: ["", [Validators.required], [this.confirmPasswordAsyncValidator]]
		});
		this.forgetForm = this.fb.group({

			forgetusername: ["", [Validators.required], [this.forgetNameAsyncValidator]],
			forgetPassword: ["", [Validators.required], [this.forgetPasswordAsyncValidator]],
			forgetConfirmpassword: ["", [Validators.required], [this.forgetConfirmPasswordAsyncValidator]],
			forgerphoneCode: ["", [Validators.required], [this.registCodeAsyncValidator]],

		})

	}

	nums = ['C', '6', 'Z', 't'];
	str = '';
	canvas: any;
	image: any;


	//   验证码
	vCode: string;
	// 登录验证表单对象
	validateForm!: FormGroup;
	// 用户名错误提示
	userErrorTip: any;
	// 密码错误提示
	passwordErrorTip: any;
	forgetphoneCodesErrorTip: any;
	phoneErrorTip: any;
	codeErrorTip: any
	// 用户名（手机号码）
	username: any;
	//   forgetusername
	forgetusername: string;
	forgetPassword: string;
	forgetConfirmpassword: string;
	forgerphoneCode: string;

	// 密码
	phoneCode: any;


	// 注册
	registForm!: FormGroup;
	// 忘记密码
	forgetForm!: FormGroup;
	// 注册姓名错误提示
	registNameErrorTip: any;
	// 密码错误提示
	registIdcardErrorTip: any;
	// 注册姓名
	registName: any;
	phoneCodes: any;
	registPhone: any;
	// 注册身份证号码
	registIdcard: any;
	passwordVisible = false;
	passwordVisible2 = false;
	passwordVisible3 = false;

	redirectUrl: any = localStorage.getItem("redirectUrl");
	// 点击登录按钮
	submitForm(value: { username: string; password: string; checkCode: string }): void {
		for (const key in this.validateForm.controls) {
			this.validateForm.controls[key].markAsDirty();
			this.validateForm.controls[key].updateValueAndValidity();
		}
		this.username = value.username;
		this.password = value.password;
		let checkCode = value.checkCode;
		let c = this.code.toLowerCase()
		let vc = checkCode.toLowerCase()
		if (c != vc) {
			this.message.create("error", "验证码错误");
		} else {
			this.login();
		}
	}

	// 点击重置密码
	async forgetFormFun(value: { forgetusername: string; forgetPassword: string; forgetConfirmpassword: string; forgerphoneCode: string }): Promise<void> {
		console.log(value)
		for (const key in this.forgetForm.controls) {
			this.forgetForm.controls[key].markAsDirty();
			this.forgetForm.controls[key].updateValueAndValidity();
		}
		console.log(value.forgetusername, value.forgetPassword, value.forgetConfirmpassword)
		if (value.forgetPassword != value.forgetConfirmpassword) {

			this.message.create("error", "两次密码不一致");
			return
		}
		if (value.forgerphoneCode != this.vCode) {
			this.message.create("error", "验证码错误");
			return
		}

		// let checkCode = value.forgetConfirmpassword;
		// Parse.initialize('nova');
		// Parse.masterKey ='NovaTest666';
		let User = new Parse.Query('_User')
		User.equalTo('username', value.forgetusername)
		User.equalTo('company', 'pPZbxElQQo')
		let user = await User.first()
		if (user && user.id) {
			user.set('password', value.forgetConfirmpassword)
			user.save(null, { useMasterKey: true }).then(res => {
				this.message.create("info", "密码修改成功");
				this.type = 'login'
			})
		}

	}
	// 点击注册按钮
	regpassword: any;
	confirmPassword: any;
	registSubmitForm(value: { registName: string; registIdcard: string, regpassword: string; confirmPassword: string; phoneCode: string; registPhone: string }): void {
		// localStorage.removeItem("user")
		for (const key in this.registForm.controls) {
			this.registForm.controls[key].markAsDirty();
			this.registForm.controls[key].updateValueAndValidity();
		}

		this.registName = value.registName;
		this.registIdcard = value.registIdcard;
		this.registPhone = value.registPhone;
		this.phoneCode = value.phoneCode;
		this.regpassword = value.regpassword;
		this.confirmPassword = value.confirmPassword;

		if (value.phoneCode != this.vCode) {
			this.message.create("error", "验证码错误");
			return
		}
		this.queryProfile();
	}
	login() {
		let profile: any;
		let currentUser: any;
		// 调用auth.service中的login方法
		//  setTimeout(function(){
		console.log(this.username, this.password)
		this.authServ
			.login(this.username, this.password)
			.then(async data => {
				currentUser = Parse.User.current();
				let query = new Parse.Query("Profile");
				query.equalTo("user", currentUser.id);
				profile = await query.first();
				if (!currentUser.get('company')) {
					currentUser.set('company', profile.get('company'))
					currentUser.save()
				}

				localStorage.setItem("profile", JSON.stringify(profile));
				this.jimServ.initJMessage()
				if (profile && profile.id) {
					this.router.navigate([data["url"]]);
				} else {
					this.createMessage("error");
				}
			})
			.catch(err => {
				this.message.create("error", "错误的用户名或密码");
			});
		// callback(data)
		//  },1000)
	}
	// 查询该学生信息是否存在
	isVisible: boolean = false
	profile: ParseObject
	async queryProfile() {
		// 查询到的profile
		let registProfile;
		let queryProfile = new Parse.Query("Profile");
		queryProfile.equalTo("name", this.registName);
		queryProfile.equalTo("idcard", this.registIdcard);
		registProfile = await queryProfile.first();
		// 如果有profile 根据profile的user寻找绑定的user
		console.log(registProfile)
		if (registProfile && registProfile.id) {
			// 该profile是否指向了一个user
			this.profile = registProfile
			let mobile = registProfile.get("mobile");
			if (!mobile) {
				this.message.info(`该用户缺少手机号`);
			}

			let userObject = registProfile.get("user");
			// 如果指向了一个user 说明该profile绑定了user  告诉客户号码XXXXXXX已经注册了 是否使用该电话号码登录
			if (userObject && userObject.id) {
				let queryUser = new Parse.Query("User");
				queryUser.equalTo("objectId", userObject.id);
				let user = await queryUser.first();
				if (user.id) {
					this.message.info(`该账户已激活，使用手机号密码直接登录`);
				}
			} else {
				// 查找这个用户存不存在，存在直接绑定登录，不存在注册
				let User = new Parse.Query('_User')
				User.equalTo("username", mobile);
				User.equalTo("company", 'pPZbxElQQo')
				let user = await User.first()
				if (user && user.id) {
					registProfile.set("user", {
						__type: "Pointer",
						className: "_User",
						objectId: user.id
					});
					registProfile.save().then(res => {
						this.message.info(`该账户已激活，使用手机号密码直接登录`);
						return
					})
				} else {
					// 核验手机号
					if (this.registPhone != mobile) {
						this.isVisible = true
					} else {
						Parse.User.signUp(
							this.registPhone,
							this.regpassword,
							""
						).then(async res => {
							if (res.id) {
								console.log(res)
								res.set("company", {
									__type: "Pointer",
									className: "Company",
									objectId: 'pPZbxElQQo'
								});
								res.save();
								this.username = this.profile.get("mobile");
								this.password = this.regpassword;
								// 绑定profile的user
								this.profile.set("user", {
									__type: "Pointer",
									className: "_User",
									objectId: res.id
								});
								this.profile.save().then(result => {
									console.log(result)
									this.login();
									this.isVisible = false
								});
							}
						});
					}
				}
			}
		} else {
			// 如果没有profile 不是学校学生  报错 不让进
			this.createMessage("error");
		}
	}
	type: string = 'login'

	forget() {
		this.type = 'forget'
	}

	backLogin() {
		this.type = 'login'
	}
	createMessage(type: string, text?: string): void {
		this.authServ.logout(null);
		if (text) {
			this.message.create(type, text);
		} else {
			this.message.create(type, `非学校用户，不允许登录`);
		}
	}
	handleCancel() {
		this.isVisible = false
	}
	password: any;
	handleOk() {
		Parse.User.signUp(
			this.registPhone,
			this.regpassword,
			""
		).then(async res => {
			if (res.id) {
				console.log(res)
				res.set("company", {
					__type: "Pointer",
					className: "Company",
					objectId: 'pPZbxElQQo'
				});
				res.save();
				this.username = this.registPhone
				this.password = this.regpassword;
				// 绑定profile的user
				this.profile.set("user", {
					__type: "Pointer",
					className: "_User",
					objectId: res.id
				});
				this.profile.set("mobile", this.registPhone)
				this.profile.save().then(result => {
					console.log(result)
					this.login();
					this.isVisible = false
				});
			}
		});
	}
	isOkLoading = false;


	//   获取短信验证码
	async getCode() {

		if (this.registPhone == undefined || this.registPhone.trim() == "") {
			this.message.info(`请输入注册手机号`);
			return;
		}
		let a = /^1[3456789]\d{9}$/;
		if (!this.registPhone.match(a)) {
			this.message.info(`请输入正确的手机号`);
			return;
		}
		let User = new Parse.Query('User')
		User.equalTo('username', this.registPhone)
		User.equalTo('company', 'pPZbxElQQo')
		let user = await User.first()
		if (user && user.id) {
			this.message.info(`该手机号已注册，请使用账号密码登录`);
			return;
		}
		let url = "https://server.fmode.cn/api/apig/message"
		this.http.post(url, { company: 'pPZbxElQQo', mobile: this.registPhone, }).subscribe((res: any) => {
			this.vCode = res.data.code
			this.countDownFun()
		}, error => {
			this.message.info(`系统繁忙中，请稍后重试`);
			console.log(error)
		})
	}

	async getCode2() {
		if (this.forgetusername == undefined || this.forgetusername.trim() == "") {
			this.message.info(`请输入账号`);
			return;
		}
		let a = /^1[3456789]\d{9}$/;
		if (!this.forgetusername.match(a)) {
			this.message.info(`请输入正确的手机号`);
			return;
		}
		console.log(this.forgetusername)
		let User = new Parse.Query('User')
		User.equalTo('username', this.forgetusername)
		User.equalTo('company', 'pPZbxElQQo')
		let user = await User.first()
		if (!user) {
			this.message.info(`账号不存在`);
			return;
		}
		let url = "https://server.fmode.cn/api/apig/message"
		this.http.post(url, { company: 'pPZbxElQQo', mobile: this.forgetusername, }).subscribe((res: any) => {
			console.log(res)
			this.vCode = res.data.code
			this.countDownFun()
		}, error => {
			this.message.info(`系统繁忙中，请稍后重试`);
			console.log(error)
		})
	}

	countDown: number = 60
	isCountDown: boolean = false
	// 倒计时
	countDownFun() {
		this.isCountDown = true
		if (this.countDown == 0) {
			return
		}
		let timer = setInterval(() => {
			this.countDown = this.countDown - 1
			if (this.countDown == 0) {
				clearInterval(timer)
				this.countDown = 60
				this.isCountDown = false
			}
		}, 1000)


	}

	

	// 登录 用户名（手机号码）验证
	userNameAsyncValidator = (control: FormControl) =>
		new Observable((observer: Observer<ValidationErrors | null>) => {
			let reg = /^1[3456789]\d{9}$/;
			let username = control.value;
			setTimeout(() => {
				if (username == undefined || username.trim() == "") {
					this.userErrorTip = "请输入登录账号";
					observer.next({ error: true, duplicated: true });
					observer.complete();
					return;
				}
				if (!username.match(reg)) {
					this.userErrorTip = "请输入正确的登录账号";
					observer.next({ error: true, duplicated: true });
					observer.complete();
					return;
				}
				observer.next(null);
				observer.complete();
			}, 1000);
		});
	// 登录 密码验证
	passwordAsyncValidator = (control: FormControl) =>
		new Observable((observer: Observer<ValidationErrors | null>) => {
			setTimeout(() => {
				let password = control.value;
				if (password == undefined || password.trim() == "") {
					this.passwordErrorTip = "请输入密码";
					observer.next({ error: true, duplicated: true });
					observer.complete();

					return;
				}
				if (password.length < 6) {
					this.passwordErrorTip = "密码长度不得小于6位";
					observer.next({ error: true, duplicated: true });
					observer.complete();
					return;
				}
				observer.next(null);
				observer.complete();
			}, 1000);
		});

	codeAsyncValidator = (control: FormControl) =>
		new Observable((observer: Observer<ValidationErrors | null>) => {
			setTimeout(() => {
				let checkCode = control.value;
				if (checkCode == undefined || checkCode.trim() == "") {
					this.codeErrorTip = "请输入验证码";
					observer.next({ error: true, duplicated: true });
					observer.complete();
					return;
				}
				if (checkCode.length < 4) {
					this.codeErrorTip = "验证码长度不得小于4位";
					observer.next({ error: true, duplicated: true });
					observer.complete();
					return;
				}
				observer.next(null);
				observer.complete();
			}, 1000);
		});
	confirmPasswordErrorTip: any;
	regpasswordErrorTip: any;
	phoneCodesErrorTip: any
	// 注册 身份证号码验证
	registIdcardAsyncValidator = (control: FormControl) =>
		new Observable((observer: Observer<ValidationErrors | null>) => {
			let registIdcard = control.value;

			setTimeout(() => {
				if (registIdcard == undefined || registIdcard.trim() == "") {
					this.registIdcardErrorTip = "请输入正确的身份证号码";
					observer.next({ error: true, duplicated: true });
					observer.complete();
					return;
				}
				if (/^\d{17}(\d|X|x)$/.test(registIdcard) === false) {
					this.registIdcardErrorTip = "请输入正确的身份证号码";
					observer.next({ error: true, duplicated: true });
					observer.complete();
					return;
				}

				observer.next(null);
				observer.complete();
			}, 1000);
		});
	// 忘记密码 验证
	forgetNameAsyncValidator = (control: FormControl) =>
		new Observable((observer: Observer<ValidationErrors | null>) => {
			setTimeout(() => {
				let forgetName = control.value;
				if (forgetName == undefined || forgetName.trim() == "") {
					this.registNameErrorTip = "请输入账户账号或者手机号";
					observer.next({ error: true, duplicated: true });
					observer.complete();
					return;
				}
				this.forgetusername = forgetName;
				observer.next(null);
				observer.complete();
			}, 1000);
		});

	forgetPasswordAsyncValidator = (control: FormControl) =>
		new Observable((observer: Observer<ValidationErrors | null>) => {
			setTimeout(() => {
				let forgetPassword = control.value;
				if (forgetPassword == undefined || forgetPassword.trim() == "") {
					this.passwordErrorTip = "请输入新密码";
					observer.next({ error: true, duplicated: true });
					observer.complete();
					return;
				}
				if (forgetPassword.length < 6) {
					this.passwordErrorTip = "密码长度不得小于6位";
					observer.next({ error: true, duplicated: true });
					observer.complete();
					return;
				}
				this.forgetPassword = forgetPassword;
				observer.next(null);
				observer.complete();
			}, 1000);
		});

	forgetConfirmPasswordAsyncValidator = (control: FormControl) =>
		new Observable((observer: Observer<ValidationErrors | null>) => {
			setTimeout(() => {
				let forgetConfirmpassword = control.value;
				if (forgetConfirmpassword == undefined || forgetConfirmpassword.trim() == "") {
					this.forgetphoneCodesErrorTip = "请确认新密码";
					observer.next({ error: true, duplicated: true });
					observer.complete();
					return;
				}
				if (forgetConfirmpassword.length < 6) {
					this.forgetphoneCodesErrorTip = "密码长度不得小于6位";
					observer.next({ error: true, duplicated: true });
					observer.complete();
					return;
				}
				this.forgetConfirmpassword = forgetConfirmpassword;
				observer.next(null);
				observer.complete();
			}, 1000);
		});

	forgetCodeAsyncValidator = (control: FormControl) =>
		new Observable((observer: Observer<ValidationErrors | null>) => {
			setTimeout(() => {
				let forgerphoneCode = control.value;
				if (forgerphoneCode == undefined || forgerphoneCode.trim() == "") {
					this.phoneCodesErrorTip = "请输入新密码";
					observer.next({ error: true, duplicated: true });
					observer.complete();
					return;
				}
				this.forgerphoneCode = forgerphoneCode;
				observer.next(null);
				observer.complete();
			}, 1000);
		});




	// 注册 姓名验证
	registNameAsyncValidator = (control: FormControl) =>
		new Observable((observer: Observer<ValidationErrors | null>) => {
			setTimeout(() => {
				let registName = control.value;
				if (registName == undefined || registName.trim() == "") {
					this.registNameErrorTip = "请输入姓名";
					observer.next({ error: true, duplicated: true });
					observer.complete();
					return;
				}
				this.registName = registName;
				observer.next(null);
				observer.complete();
			}, 1000);
		});


	// 注册手机号验证
	registPhoneAsyncValidator = (control: FormControl) =>
		new Observable((observer: Observer<ValidationErrors | null>) => {
			let registPhone = control.value;
			setTimeout(() => {
				if (registPhone == undefined || registPhone.trim() == "") {
					this.registIdcardErrorTip = "请输入正确的身份证号码";
					observer.next({ error: true, duplicated: true });
					observer.complete();
					return;
				}

				if (/^1[3456789]\d{9}$/.test(registPhone) === false) {
					this.phoneErrorTip = "请输入正确的手机号";
					observer.next({ error: true, duplicated: true });
					observer.complete();
					return;
				}

				observer.next(null);
				observer.complete();
			}, 1000);
		});


	registCodeAsyncValidator = (control: FormControl) =>
		new Observable((observer: Observer<ValidationErrors | null>) => {
			setTimeout(() => {
				let registCode = control.value;
				if (registCode == undefined || registCode.trim() == "") {
					this.phoneCodesErrorTip = "请输入验证码";
					observer.next({ error: true, duplicated: true });
					observer.complete();
					return;
				}
				observer.next(null);
				observer.complete();
			}, 1000);
		});
	// 注册密码验证
	regpasswordAsyncValidator = (control: FormControl) =>
		new Observable((observer: Observer<ValidationErrors | null>) => {
			setTimeout(() => {
				let regpassword = control.value;
				if (regpassword == undefined || regpassword.trim() == "") {
					this.regpasswordErrorTip = "请输入密码";
					observer.next({ error: true, duplicated: true });
					observer.complete();
					return;
				}
				if (regpassword.length < 6) {
					this.regpasswordErrorTip = "密码长度不得小于6位";
					observer.next({ error: true, duplicated: true });
					observer.complete();
					return;
				}
				if (regpassword.length > 12) {
					this.regpasswordErrorTip = "密码长度不得大于12位";
					observer.next({ error: true, duplicated: true });
					observer.complete();
					return;
				}
				this.regpassword = regpassword
				observer.next(null);
				observer.complete();
			}, 1000);
		});
	// 注册 确认密码验证
	confirmPasswordAsyncValidator = (control: FormControl) =>
		new Observable((observer: Observer<ValidationErrors | null>) => {
			setTimeout(() => {
				let confirmPassword = control.value;
				if (confirmPassword == undefined || confirmPassword.trim() == "") {
					this.confirmPasswordErrorTip = "请确认密码";
					observer.next({ error: true, duplicated: true });
					observer.complete();
					return;
				}
				if (confirmPassword != this.regpassword) {
					this.confirmPasswordErrorTip = "两次输入密码不一致，请重新输入";
					observer.next({ error: true, duplicated: true });
					observer.complete();
					return;
				}
				this.confirmPassword = confirmPassword;

				observer.next(null);
				observer.complete();
			}, 1000);
		});

	code: any = ''
	ngOnInit(): void {
		localStorage.removeItem('company')
		localStorage.removeItem('pid')
		this.activatedRoute.paramMap.subscribe(parms => {
			// XNSoJI9Cmw

			if (parms.get('p')) {
				localStorage.setItem('pid', parms.get('p'))
			} else {
				localStorage.setItem('company', 'pPZbxElQQo')
			}
		})
		this.creatCode();
	}
	creatCode() {
		this.code = ''
		let codeLength = 4;  //验证码的长度
		let codeChars = [
			0,
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			"a",
			"b",
			"c",
			"d",
			"e",
			"f",
			"g",
			"h",
			"i",
			"j",
			"k",
			"l",
			"m",
			"n",
			"o",
			"p",
			"q",
			"r",
			"s",
			"t",
			"u",
			"v",
			"w",
			"x",
			"y",
			"z",
			"A",
			"B",
			"C",
			"D",
			"E",
			"F",
			"G",
			"H",
			"I",
			"J",
			"K",
			"L",
			"M",
			"N",
			"O",
			"P",
			"Q",
			"R",
			"S",
			"T",
			"U",
			"V",
			"W",
			"X",
			"Y",
			"Z"
		];
		for (let i = 0; i < codeLength; i++) {
			let charNum = Math.floor(Math.random() * 52)
			this.code += codeChars[charNum];
		}
	}

}

