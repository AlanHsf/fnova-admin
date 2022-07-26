import {
    Component, OnInit, Input, Output,
    EventEmitter, AfterViewInit, ElementRef, ViewChild
} from '@angular/core';

@Component({
    selector: 'create-group-next-component',
    templateUrl: './create-group-next.component.html',
    styleUrls: ['./create-group-next.component.scss']
})

export class CreateGroupNextComponent implements OnInit, AfterViewInit {
    @ViewChild('createGroupNextInput')  createGroupNextInput;
    @Input()
     groupAvatarInfo:any;
    @Input()
     createGroupNext;
    @Output()
     changeCreateGroupAvatar: EventEmitter<any> = new EventEmitter();
    @Output()
     createGroupPrev: EventEmitter<any> = new EventEmitter();
    @Output()
     closeCreateGroupNext: EventEmitter<any> = new EventEmitter();
    @Output()
     completeCreateGroup: EventEmitter<any> = new EventEmitter();
     nameTip = '';
    constructor() {
        // pass
    }
    public ngOnInit() {
        // pass
    }
    public ngAfterViewInit() {
        this.createGroupNextInput.nativeElement.focus();
    }
     changeCreateGroupAvatarAction(event) {
        this.changeCreateGroupAvatar.emit(event.target);
    }
     createGroupPrevAction() {
        this.createGroupPrev.emit();
    }
     closeCreateGroupNextAction() {
        this.closeCreateGroupNext.emit();
    }
     groupNameKeyup() {
        this.nameTip = '';
    }
     completeCreateGroupAction(groupName, groupType) {
        if (groupName.value.length === 0) {
            this.nameTip = '群名称不能为空';
        } else {
            let groupInfo = {
                avatar: this.groupAvatarInfo.formData,
                avatarUrl: this.groupAvatarInfo.src,
                isLimit: groupType,
                groupName: groupName.value,
                memberUsernames: this.createGroupNext.info.memberUsernames
            };
            this.completeCreateGroup.emit(groupInfo);
        }
    }
}
