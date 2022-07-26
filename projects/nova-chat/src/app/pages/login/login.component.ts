import { Component, OnInit, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { loginAction } from './actions';
import { appAction } from '../../actions';
import { AppStore } from '../../app.store';
import { global, StorageService } from '../../services/common';
import { md5 } from '../../services/tools';
import { Util } from '../../services/util';
import { ActivatedRoute, Router } from '@angular/router';
import { mainAction } from '../main/actions';
declare function JMessage(obj?: Object): void;

@Component({
    selector: 'app-login',
    styleUrls: ['./login.component.scss'],
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
     username = '';
     password = '';
     rememberPassword = ''; // 获取cookie中记住的密码
     loginRemember = false; // 是否记住密码
     loginTip = '';
     loginStream$;
     isButtonAvailable = false;
     emptyPassword = false;
     loginLoading = false;
    // 为了解决safari下记住密码时placeholder依然存在的bug
     usernamePlaceholderText = '请输入用户名';
     passwordPlaceholderText = '请输入密码';
    constructor(
        private store$: Store<AppStore>,
        private storageService: StorageService,
        private router: Router,
        private elementRef: ElementRef
    ) { }
    public ngOnInit() {
        // 创建JIM 对象，退出登录后重新创建对象
        global.JIM = new JMessage();
        if (this.username !== '' && this.password !== '') {
            this.isButtonAvailableAction();
        }
        // JIM 初始化
        this.store$.dispatch({
            type: mainAction.jimInit,
            payload: null
        });
        this.loginStream$ = this.store$.select((state) => {
            let loginState = state['loginReducer'];
            switch (loginState.actionType) {
                case loginAction.loginSuccess:
                    this.loginSuccess(loginState);
                    break;
                case loginAction.isButtonAvailableAction:
                    this.isButtonAvailable = loginState.isButtonAvailable;
                    break;
                case loginAction.loginFailed:

                case loginAction.emptyTip:
                    if (!loginState.isLoginSuccess) {
                        this.loginTip = loginState.loginTip;
                        this.loginLoading = false;
                    }
                    break;
                case mainAction.jimInitSuccess:
                    this.jimInitSuccess();
                    break;
                default:
            }
            return state;
        }).subscribe((state) => {
            // pass
        });
    }
    public ngAfterViewInit() {
        if (this.username !== '' && this.password === '') {
            this.elementRef.nativeElement.querySelector('#loginPassword').focus();
        } else {
            this.elementRef.nativeElement.querySelector('#loginUsername').focus();
        }
    }
    public ngOnDestroy() {
        this.loginStream$.unsubscribe();
    }
     loginSuccess(loginState) {
        let md5Username = md5('jchat-remember-username');
        let md5Password = md5('jchat-remember-password');
        // 是否记住密码
        if (loginState.loginRemember) {
            this.storageService.set(md5Username, loginState.userInfo.username, true);
            this.storageService.set(md5Password, loginState.userInfo.password, true);
        } else {
            // 不记住密码移除cookie
            let rememberUsername = this.storageService.get(md5Username, true);
            if (this.username === rememberUsername) {
                this.storageService.remove(md5Username);
                this.storageService.remove(md5Password);
            }
        }
        global.password = loginState.userInfo.password;
        this.router.navigate(['main']);
        this.loginLoading = false;
    }
     jimInitSuccess() {
        let username = this.storageService.get(md5('jchat-remember-username'), true);
        let password = this.storageService.get(md5('jchat-remember-password'), true);
        if (username && password) {
            this.username = username;
            this.rememberPassword = password;
            this.password = password.substring(0, 6);
            this.loginRemember = true;
            this.emptyPassword = true;
            this.usernamePlaceholderText = '';
            this.passwordPlaceholderText = '';
        }
        if (this.storageService.get('register-username')) {
            this.username = this.storageService.get('register-username');
            this.usernamePlaceholderText = '';
            this.storageService.remove('register-username');
            this.password = '';
            this.passwordPlaceholderText = '请输入密码';
        }
    }
    // 点击登陆、keyup.enter登陆、keyup, change判断button是否可用
     login(event?) {
        let password;
        if (this.rememberPassword) {
            password = this.rememberPassword;
            this.isButtonAvailable = true;
        } else {
            password = md5(this.password);
        }
        if (!this.isButtonAvailable) {
            return;
        }
        this.loginLoading = true;

        console.log(this.password)
        console.log(md5(this.password))
        console.log({
            username: this.username,
            password:password,
            md5: true,
            isButtonAvailable: this.isButtonAvailable,
            event:event,
            loginRemember: this.loginRemember
        })
        this.store$.dispatch({
            type: loginAction.login,
            payload: {
                username: this.username,
                password,
                md5: true,
                isButtonAvailable: this.isButtonAvailable,
                event,
                loginRemember: this.loginRemember
            }
        });
    }
     isButtonAvailableAction(type?: string) {
        this.rememberPassword = '';
        this.store$.dispatch({
            type: loginAction.isButtonAvailableAction,
            payload: {
                password: this.password,
                username: this.username
            }
        });
        // 当input keyup进行修改时清空提示语
        if (type === 'usernameKeyup' || type === 'passwordKeyup') {
            this.store$.dispatch({
                type: loginAction.emptyTip,
                payload: type
            });
        }
        // 密码被记住后修改用户名，清空密码
        if (type === 'usernameKeyup' && this.emptyPassword) {
            this.password = '';
            this.emptyPassword = false;
            this.passwordPlaceholderText = '请输入密码';
        }
        // 解决safari placeholder问题
        if ((type === 'usernameKeyup' || type === 'usernameChange') && this.username === '') {
            this.usernamePlaceholderText = '请输入用户名';
        }
        if ((type === 'passwordKeyup' || type === 'passwordChange') && this.password === '') {
            this.passwordPlaceholderText = '请输入密码';
        }
    }
     inputFocus(id) {
        this.elementRef.nativeElement.querySelector('#' + id).focus();
    }
}
