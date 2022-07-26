import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'room-list-component',
    templateUrl: './room-list.component.html',
    styleUrls: ['./room-list.component.scss']
})

export class RoomListComponent implements OnInit {
    @Input()
    set loadMoreRoomsFlag(value) {
        this.flag = false;
    }
    @Input()
     roomList;
    @Input()
     active;
    @Output()
     changeRoom: EventEmitter<any> = new EventEmitter();
    @Output()
     loadMoreRooms: EventEmitter<any> = new EventEmitter();
     flag = false;
    constructor() {
        // pass
    }
    public ngOnInit() {
        // pass
    }
     changeRoomAction(room) {
        this.changeRoom.emit(room);
    }
     scrollBottomEvent() {
        if (this.roomList.length > 0 && !this.flag) {
            this.flag = true;
            this.loadMoreRooms.emit();
        }
    }
}
