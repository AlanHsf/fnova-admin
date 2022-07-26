import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as Parse from 'parse'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
interface DataItem {
	user: string;
	school: string;
	major: string;
	class: string;
	lesson: string;
	totalTime: any
}
@Component({
	selector: 'app-role',
	templateUrl: './role-manage.component.html',
	styleUrls: ['./role-manage.component.scss']
})
export class RoleManageComponent implements OnInit {

	constructor(private cdRef: ChangeDetectorRef) { }
	modules: any
	routes: any
	listOfColumn = [
		{
			title: '角色中文名',
			compare: null,
			priority: false
		},
		{
			title: '角色英文名',
			compare: null,
			priority: false
		},
		{
			title: '描述',
			compare: null,
			priority: false
		},
		{
			title: '创建时间',
			compare: null,
			priority: false
		},
		{
			title: '操作',
			compare: null,
			priority: false
		}
	];
	listOfData: any = [];
	title: any
	otherName: any;
	ngOnInit() {
		this.queryRole()
	}
	queryRole() {
		let Role = new Parse.Query("_Role")
		Role.equalTo('company', localStorage.getItem('company'))
		Role.equalTo('company', localStorage.getItem('company'))
		Role.find().then(res => {
			this.listOfData = res
		})
	}
	isVisible: boolean = false
	shouModel() {
		this.isVisible = true
		this.editType = 'add'
		this.queryUsers()
	}
	handleCancel() {
		this.isVisible = false
		this.users = null
		this.routes = null
		this.modules = null
		this.title = null
		this.otherName = null
	}
	// 保存
	async handleOk() {
		let role;
		if (this.editType == 'add') { //新增
			let roleACL = new Parse.ACL();
			roleACL.setPublicReadAccess(true);
			roleACL.setPublicWriteAccess(true);
			roleACL.setRoleReadAccess(`${localStorage.getItem('company')}_admin`, true);
			roleACL.setRoleWriteAccess(`${localStorage.getItem('company')}_admin`, true);
			role = new Parse.Role('Administrator', roleACL);
		}
		if (this.editType == 'edit') {
			let Role = new Parse.Query('_Role')
			Role.equalTo('objectId', this.editObject.id)
			role = await Role.first()
		}
		let name = localStorage.getItem('company') + '_' + this.title;
		console.log(name, this.title)

		role.set('otherName', this.otherName)
		role.set('title', this.title)
		role.set('name', name)
		console.log(this.modules)
		let modules
		if(this.modules && this.modules.length > 0) {
			modules = this.modules.filter(module => {
				return module != null
			})
		}
		let routes: any
		if (this.routes && this.routes.length > 0) {
			routes = this.routes.filter(route => {
				return route != null
			})
		}

		role.set('modules', modules)
		if (routes) {
			role.set('routers', routes)
		}

		role.set('company', {
			__type: 'Pointer',
			className: 'Company',
			objectId: localStorage.getItem('company')
		})
		let relation = role.relation("users");
		console.log(this.users)
		this.users.forEach(user => {
			relation.add(user)
		});
		console.log(11111)
		role.save().then(res => {
			console.log(res)
			this.queryUsers()
			if (res && res.id) {
				let exitsMap = {}
				this.users.forEach(user => {
					exitsMap[user.id] = true
					if (user.get('roles')) { // user中存在roles
						let roles = user.get('roles')
						let isExits = false
						roles.forEach(r => {
							if (r.id == res.id) {
								isExits = true
							}
						})
						if (!isExits) {
							roles.push({
								__type: "Pointer",
								className: "_Role",
								objectId: res.id
							})
						}
						user.set(roles, roles)
						Parse.Cloud.run('user_save', {
							userJson: user.toJSON()
						})
						this.isVisible = false
					} else { // 不存在roles
						user.set('roles', [{
							__type: "Pointer",
							className: "_Role",
							objectId: res.id
						}])
						console.log('isVisible2');
						Parse.Cloud.run('user_save', {
							userJson: user.toJSON()
						})
						this.isVisible = false
						this.routes = null
						this.modules = null
						this.title = null
						this.users = null
						this.otherName = null
					}
				});
				if(this.oldUsers && this.oldUsers.length > 0) {
					this.oldUsers.filter(li => {
						if (exitsMap[li.id]) {
							return false
						} else {
							let roles = li.get('roles')
							roles.forEach((r, index) => {
								if (r.id == res.id) {
									roles.splice(index, 1)
									li.set('roles', roles)
									Parse.Cloud.run('user_save', {
										userJson: li.toJSON()
									})
								}
							})
						}
					})
				}	
			}
			this.queryRole()
		})
	}
	listOfOption: any
	users: any
	// 查找用户
	queryUsers() {
		let Users = new Parse.Query('_User')
		Users.equalTo('company', localStorage.getItem('company'))
		Users.equalTo('type', "admin")
		Users.limit(100)
		Users.find().then(res => {
			this.listOfOption = res
		})
	}

	modelChange(e) {
		console.log(e);
	}
	editType: any
	editObject: any
	oldUsers: any
	async edit(data) {
		this.editType = 'edit'
		this.editObject = data;
		console.log(this.editObject);

		this.otherName = data.get('otherName')
		this.title = data.get('title')
		this.modules = data.get('modules')
		this.routes = data.get('routers')
		let Users = new Parse.Query('_User')
		Users.containedIn('roles', [{
			__type: 'Pointer',
			className: '_Role',
			objectId: data.id
		}])
		Users.include('roles')
		let users = await Users.find()
		this.users = users
		this.oldUsers = users
		// let role = await Role.first()
		// if(role && role.id) {
		// this.users = data.relation("users")
		this.isVisible = true
		console.log(this.users)
		this.queryUsers()
		await this.cdRef.detectChanges()
	}
	isDelete: boolean = false
	deleteData: any
	delete(data) {
		this.deleteData = data
		this.isDelete = true
	}
	cancelDelete() {
		this.isDelete = false
		this.deleteData = null
	}
	// 删除该角色
	async confirmDelete() {
		// 先删除user的role对应的
		console.log(this.deleteData);
		let User = new Parse.Query('_User')
		console.log(this.deleteData.id)
		User.containedIn('roles', [{
			__type: 'Pointer',
			className: '_Role',
			objectId: this.deleteData.id
		}])
		let users = await User.find()
		if (users && users.length > 0) {
			users.forEach(user => {
				let newRoles = []
				user.get('roles').forEach(role => {
					if (role.id != this.deleteData.id) {
						newRoles.push(role)
					}
					console.log(newRoles)
					user.set('roles', newRoles)
					user.save(null, { useMasterKey: true }).then(res => {
						console.log(res)
					})
				});
			})
		}
		let Role = new Parse.Query('_Role')
		Role.include("users");
		let role = await Role.get(this.deleteData.id)
		role.destroy().then(res => {
			this.isDelete = false
			this.queryRole()
		})
	}
}


