import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'room-detail-component',
    templateUrl: './room-detail.component.html',
    styleUrls: ['./room-detail.component.scss']
})

export class RoomDetailComponent implements OnInit {
    @Input()
     roomDetail;
    @Input()
     enterRoomLoading;
    @Output()
     enterRoom: EventEmitter<any> = new EventEmitter();
    constructor() {
        // pass
    }
    public ngOnInit() {
        // pass
    }
     enterRoomAction() {
        this.enterRoom.emit(this.roomDetail);
    }
}
