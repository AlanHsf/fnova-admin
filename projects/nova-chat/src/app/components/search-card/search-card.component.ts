import {
    Component, OnInit, Input, Output, EventEmitter,
    AfterViewInit, ViewChild, OnDestroy
} from '@angular/core';
import { Observable,fromEvent } from 'rxjs';

@Component({
    selector: 'search-card-component',
    templateUrl: './search-card.component.html',
    styleUrls: ['./search-card.component.scss']
})

export class SearchCardComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('searchCard')  searchCard;
    @Input()
     searchResult:any;
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
        this.inputStream$ = fromEvent(this.searchCard.nativeElement, 'keyup')
            .subscribe((event: any) => this.searchKeyup.emit(event.target.value));
    }
    public ngOnDestroy() {
        this.inputStream$.unsubscribe();
    }
     stopPropagation(event) {
        event.stopPropagation();
    }
     searchItemAction(item) {
        this.searchItem.emit(item);
    }
     clearInputAction() {
        this.searchCard.nativeElement.focus();
        this.searchResult.keywords = '';
        this.clearInput.emit();
    }
     changeCheckedAction(item) {
        this.changeChecked.emit(item);
    }
}
