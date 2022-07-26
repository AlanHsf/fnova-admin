import {
    Component, OnInit, Input, Output,
    EventEmitter, AfterViewInit, ViewChild
} from '@angular/core';
import { global } from '../../services/common';
import { md5 } from '../../services/tools';

@Component({
    selector: 'modify-password-component',
    templateUrl: './modify-password.component.html',
    styleUrls: ['./modify-password.component.scss']
})

export class ModifyPasswordComponent implements OnInit, AfterViewInit {
    @ViewChild('modifyPasswordInput')  modifyPasswordInput;
     oldPassword = '';
     newPassword = '';
     newPasswordRepeat = '';
     oldPwdTip = false;
     repeatPwdTip = 0;
    @Output()
     modifyPassword: EventEmitter<any> = new EventEmitter();
    constructor() {
        // pass
    }
    public ngOnInit() {
        // pass
    }
    public ngAfterViewInit() {
        this.modifyPasswordInput.nativeElement.focus();
    }
     confirmModify() {
        if (global.password !== md5(this.oldPassword)) {
            this.oldPwdTip = true;
            return;
        }
        if (this.newPassword !== this.newPasswordRepeat) {
            this.repeatPwdTip = 1;
            return;
        } else if (this.newPassword.length > 128 || this.newPassword.length < 4) {
            this.repeatPwdTip = 2;
            return;
        }
        this.modifyPassword.emit({
            old_pwd: this.oldPassword,
            new_pwd: this.newPassword,
            is_md5: false
        });
    }
     cancelModify() {
        this.oldPassword = '';
        this.newPassword = '';
        this.newPasswordRepeat = '';
        this.oldPwdTip = false;
        this.repeatPwdTip = 0;
        this.modifyPassword.emit();
    }
     emptyTip(type) {
        if (type === 'oldPassword') {
            this.oldPwdTip = false;
        } else if (type === 'newPassword') {
            this.repeatPwdTip = 0;
        }
    }
}
