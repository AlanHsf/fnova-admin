import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { authPayload } from '../../services/common';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppStore } from '../../app.store';
import { mainAction } from '../../pages/main/actions';
import { chatAction } from '../../pages/chat/actions';
import { global } from '../../services/common';

@Component({
    selector: 'message-transmit-component',
    templateUrl: './message-transmit.component.html',
    styleUrls: ['./message-transmit.component.scss']
})

export class MessageTransmitComponent implements OnInit, OnDestroy {
     messageTransmitStream$;
    @Input()
     messageTransmit;
    @Output()
     isMessageTransmit: EventEmitter<any> = new EventEmitter();
    @Output()
     searchMessageTransmit: EventEmitter<any> = new EventEmitter();
    @Output()
     confirmTransmit: EventEmitter<any> = new EventEmitter();
     selectList = [];
     _searchResult = {
        result: {
            singleArr: [],
            groupArr: []
        },
        isSearch: false
    };
    get searchResult(){
        return JSON.parse(JSON.stringify(this._searchResult))
    }
    set searchResult(v){
        this._searchResult = JSON.parse(JSON.stringify(v))
    }
    constructor(
        private store$: Store<any>
    ) {
        // pass
    }
    public ngOnInit() {
        this.init();
        this.messageTransmitStream$ = this.store$.select((state) => {
            let chatState = state['chatReducer'];
            this.stateChanged(chatState);
            return state;
        }).subscribe((state) => {
            // pass
        });
    }
    public ngOnDestroy() {
        this.messageTransmitStream$.unsubscribe();
    }
     init() {
        for (let item of this.messageTransmit.list) {
            item.checked = false;
        }
    }
     stateChanged(chatState) {
        switch (chatState.actionType) {
            case chatAction.searchMessageTransmit:
                this.searchResult = chatState.messageTransmit.searchResult;
                for (let item of this.searchResult.result.singleArr) {
                    item.checked = false;
                    for (let select of this.selectList) {
                        if (select.type === 3 && item.username === select.name) {
                            item.checked = true;
                        }
                    }
                    if (item.username === global.user) {
                        item.checked = true;
                        item.disabled = true;
                    }
                }
                for (let item of this.searchResult.result.groupArr) {
                    item.checked = false;
                    for (let select of this.selectList) {
                        if (select.type === 3 && Number(item.gid) === Number(select.key)) {
                            item.checked = true;
                        }
                    }
                }
                break;
            default:
        }
    }
     searchKeyupEmit(value) {
        this.searchMessageTransmit.emit(value);
    }
     changeInputEmit(item) {
        let flag = true;
        if (item.gid) {
            item.key = item.gid;
            item.type = 4;
        }
        for (let i = 0; i < this.selectList.length; i++) {
            let group = item.type === 4 && Number(item.key) === Number(this.selectList[i].key);
            let single = item.type === 3 && item.username === this.selectList[i].name;
            if (group || single) {
                flag = false;
                this.selectList.splice(i, 1);
                item.checked = false;
                break;
            }
        }
        if (flag) {
            item.checked = true;
            this.selectList.push(item);
        }
        for (let member of this.messageTransmit.list) {
            if (member.type === 4 && Number(item.key) === Number(member.key)) {
                member.checked = item.checked;
                break;
            } else if (member.type === 3 && item.name === member.name) {
                member.checked = item.checked;
                item.key = member.key;
                break;
            }
        }
    }
     confirmMessageTransmit() {
        if (this.selectList.length > 0) {
            this.confirmTransmit.emit({
                type: this.messageTransmit.type,
                selectList: this.selectList
            });
            this.messageTransmit.show = false;
        }
    }
     cancelMessageTransmit(ev?) {
        this.messageTransmit.show = false;
    }
     selectItem(event, user) {
        if (!event.target.checked) {
            this.deleteItem(user);
        } else {
            if (user.name) {
                user.username = user.name;
            }
            user.flag = 0;
            this.selectList.push(user);
        }
        for (let member of this.messageTransmit.list) {
            let group = member.type === 4 && Number(member.key) === Number(user.key);
            let single = member.type === 3 && member.name === user.name;
            if (group || single) {
                member.checked = event.target.checked;
                return;
            }
        }
    }
     cancelSelect(user) {
        this.deleteItem(user);
        for (let member of this.messageTransmit.list) {
            let group = member.type === 4 && Number(member.key) === Number(user.key);
            let single = member.type === 3 && member.name === user.name;
            if (group || single) {
                member.checked = false;
                return;
            }
        }
    }
    // 删除已选元素操作
     deleteItem(user) {
        for (let i = 0; i < this.selectList.length; i++) {
            let group = this.selectList[i].type === 4 &&
                Number(this.selectList[i].key) === Number(user.key);
            let single = this.selectList[i].type === 3 && this.selectList[i].name === user.name;
            if (group || single) {
                this.selectList.splice(i, 1);
                break;
            }
        }
    }
}
