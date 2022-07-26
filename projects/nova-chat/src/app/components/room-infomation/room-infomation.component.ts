import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
    selector: 'room-infomation-component',
    templateUrl: './room-infomation.component.html',
    styleUrls: ['./room-infomation.component.scss']
})

export class RoomInfomationComponent implements OnInit {
    @Input()
     roomInfomation;
    @Output()
     hideRoomInfomation: EventEmitter<any> = new EventEmitter();
    constructor() {
        // pass
    }
    public ngOnInit() {
        // pass
    }
     closeRoomInfomation() {
        this.hideRoomInfomation.emit();
    }
    @HostListener('window:click')  onWindowClick() {
        this.hideRoomInfomation.emit();
    }
     stopPropagation(event) {
        event.stopPropagation();
    }
}
