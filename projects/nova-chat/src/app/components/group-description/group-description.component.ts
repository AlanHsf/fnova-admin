import {
    Component, OnInit, Input, Output,
    EventEmitter, AfterViewInit, ViewChild
} from '@angular/core';

@Component({
    selector: 'group-description-component',
    templateUrl: './group-description.component.html',
    styleUrls: ['./group-description.component.scss']
})

export class GroupDescriptionComponent implements OnInit, AfterViewInit {
    @ViewChild('groupDescrptionTextarea')  groupDescrptionTextarea;
    @Input()
     description;
    @Output()
     updateGroupInfo: EventEmitter<any> = new EventEmitter();
    constructor() {
        // pass
    }
    public ngOnInit() {
        // pass
    }
    public ngAfterViewInit() {
        this.groupDescrptionTextarea.nativeElement.focus();
    }
     stopPropagation(event) {
        event.stopPropagation();
    }
     groupAction(event?, desc?) {
        event.stopPropagation();
        if (desc) {
            desc.actionType = 'modifyDescription';
            this.updateGroupInfo.emit(desc);
        } else {
            this.updateGroupInfo.emit();
        }
    }
}
