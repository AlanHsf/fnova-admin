import {
    Component, OnInit, Input, Output, EventEmitter,
    AfterViewInit, ViewChild, OnDestroy
} from '@angular/core';
import { Observable,fromEvent } from 'rxjs';

@Component({
    selector: 'search-member-component',
    templateUrl: './search-member.component.html',
    styleUrls: ['./search-member.component.scss']
})

export class SearchMemberComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('searchInput')  searchInput;
    @Input()
     searchResult;
    @Output()
     searchItem: EventEmitter<any> = new EventEmitter();
    @Output()
     searchBtn: EventEmitter<any> = new EventEmitter();
    @Output()
     clearInput: EventEmitter<any> = new EventEmitter();
    @Output()
     searchKeyup: EventEmitter<any> = new EventEmitter();
    @Output()
     changeChecked: EventEmitter<any> = new EventEmitter();
     inputStream$;
    constructor() {
        // pass
    }
    public ngOnInit() {
        // pass
    }
    public ngAfterViewInit() {
        this.inputStream$ = fromEvent(this.searchInput.nativeElement, 'keyup')
            .subscribe((event: any) => {
                if (event.keyCode !== 13) {
                    this.searchKeyup.emit(event.target.value);
                }
            });
    }
    public ngOnDestroy() {
        this.inputStream$.unsubscribe();
    }
     stopPropagation(event) {
        event.stopPropagation();
    }
     searchItemAction(item) {
        if (!this.searchResult.checkbox) {
            this.searchResult.keywords = '';
        }
        this.searchItem.emit(item);
    }
     clearInputAction() {
        this.searchInput.nativeElement.focus();
        this.searchResult.keywords = '';
        this.clearInput.emit();
    }
     searchBtnAction() {
        if (this.searchResult.keywords.length > 0 && this.searchResult.checkbox) {
            this.searchBtn.emit(this.searchResult.keywords);
        }
    }
     changeCheckedAction(item) {
        this.changeChecked.emit(item);
    }
     clearKeyWords() {
        this.searchInput.nativeElement.value = '';
    }
}
