import {
    Component, OnInit, Input, Output, EventEmitter, ViewChild,
    HostListener, ElementRef, DoCheck
} from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppStore } from '../../app.store';
import { chatAction } from '../../pages/chat/actions';
import { global } from '../../services/common';
import { SearchMemberComponent } from '../search-member/search-member.component';

@Component({
    selector: 'group-setting-component',
    templateUrl: './group-setting.component.html',
    styleUrls: ['./group-setting.component.scss']
})

export class GroupSettingComponent implements OnInit, DoCheck {
    @ViewChild('groupSettingHeader')  groupSettingHeader;
    @ViewChild(SearchMemberComponent)  SearchMemberComponent;
    @Input()
     groupSetting;
    @Output()
     closeGroupSetting: EventEmitter<any> = new EventEmitter();
    @Output()
     exitGroup: EventEmitter<any> = new EventEmitter();
    @Output()
     modifyGroupDescription: EventEmitter<any> = new EventEmitter();
    @Output()
     addMember: EventEmitter<any> = new EventEmitter();
    @Output()
     searchGroupMember: EventEmitter<any> = new EventEmitter();
    @Output()
     watchOtherInfo: EventEmitter<any> = new EventEmitter();
    @Output()
     watchSelfInfo: EventEmitter<any> = new EventEmitter();
    @Output()
     deleteMember: EventEmitter<any> = new EventEmitter();
    @Output()
     modifyGroupName: EventEmitter<any> = new EventEmitter();
    @Output()
     updateGroupAvatar: EventEmitter<any> = new EventEmitter();
    @Output()
     keepSilence: EventEmitter<any> = new EventEmitter();
     global = global;
     searchResult = {
        result: [],
        show: false,
        keywords: '',
        placeholder: '搜索群成员'
    };
     hostHover = {
        tip: '群主',
        position: {
            left: -10,
            top: 23
        },
        show: false
    };
     modifyGroupNameShow = false;
     listTop = 203;
    constructor(
        private store$: Store<AppStore>,
        private elementRef: ElementRef
    ) { }
    public ngOnInit() {
        // pass
    }
    public ngDoCheck() {
        // 修改群描述时，调整群成员列表的位置
        if (this.groupSettingHeader&&this.groupSettingHeader.nativeElement) {
            this.listTop = this.groupSettingHeader.nativeElement.offsetHeight;
        }
    }
     stopPropagation(event) {
        event.stopPropagation();
        this.searchResult.show = false;
        this.searchResult.keywords = '';
    }
    @HostListener('window:click')  onWindowClick() {
        this.groupSetting.show = false;
        this.searchResult.result = [];
        this.searchResult.show = false;
        this.closeGroupSetting.emit();
        this.SearchMemberComponent.clearKeyWords();
    }
     clearInputEmit() {
        this.searchResult.result = [];
        this.searchResult.show = false;
    }
     seachKeyupEmit(value) {
        this.searchResult.result = [];
        if (value) {
            this.searchResult.show = true;
            let result = [];
            for (let member of this.groupSetting.memberList) {
                let memoNameExist = member.memo_name &&
                    member.memo_name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
                let usernameExist = member.username &&
                    member.username.toLowerCase().indexOf(value.toLowerCase()) !== -1;
                let nickNameExist = member.nickName &&
                    member.nickName.toLowerCase().indexOf(value.toLowerCase()) !== -1;
                if (memoNameExist || nickNameExist || usernameExist) {
                    result.push(member);
                }
            }
            this.searchResult.result = result;
        } else {
            this.searchResult.show = false;
        }
    }
     addMemberAction() {
        this.addMember.emit();
    }
     closeGroupSettingAction() {
        this.groupSetting.show = false;
        this.closeGroupSetting.emit();
    }
     exitGroupAction() {
        this.exitGroup.emit(this.groupSetting.groupInfo);
    }
     modifyGroupDescriptionAction() {
        this.modifyGroupDescription.emit();
    }
     modifyGroupNameAction() {
        this.modifyGroupNameShow = true;
        setTimeout(() => {
            this.elementRef.nativeElement.querySelector('#groupSettingNameInput').focus();
        });
    }
     modifyGroupNameBlur(event) {
        if (this.groupSetting.groupInfo.name !== event.target.value) {
            this.modifyGroupName.emit(event.target.value);
        }
        this.modifyGroupNameShow = false;
    }
     changeGroupShieldEmit() {
        this.store$.dispatch({
            type: chatAction.changeGroupShield,
            payload: this.groupSetting.active
        });
    }
     changeGroupNoDisturbEmit() {
        this.store$.dispatch({
            type: chatAction.changeGroupNoDisturb,
            payload: this.groupSetting.active
        });
    }
     searchItemEmit(item) {
        if (item.username === global.user) {
            this.watchSelfInfo.emit();
        } else {
            this.watchOtherInfo.emit({
                username: item.username
            });
        }
        this.searchResult.result = [];
        this.searchResult.show = false;
    }
     watchInfoAction(item) {
        if (item.username === global.user) {
            this.watchSelfInfo.emit();
        } else {
            let info: any = {
                username: item.username
            };
            if (item.hasOwnProperty('avatarUrl')) {
                info.avatarUrl = item.avatarUrl;
            }
            this.watchOtherInfo.emit(info);
        }
    }
     deleteMemberAction(item) {
        this.deleteMember.emit(item);
    }
     groupAvatarChange(event) {
        this.updateGroupAvatar.emit(event.target);
    }
     keepSilenceAction(item) {
        this.keepSilence.emit(item);
    }
}
