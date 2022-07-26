import {
    Component, OnInit, Input, Output, EventEmitter,
    OnChanges, ViewChild, HostListener, AfterViewInit, OnDestroy
} from '@angular/core';
import { Observable,fromEvent } from 'rxjs';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

@Component({
    selector: 'search-transmit-component',
    templateUrl: './search-transmit.component.html',
    styleUrls: ['./search-transmit.component.scss']
})

export class SearchTransmitComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    @ViewChild(PerfectScrollbarComponent)  componentScroll;
    @ViewChild('searchInput')  searchInput;
     searchKeyword;
     searchInputIsShow = true;
     singleShowText = '显示全部';
     groupShowText = '显示全部';
     singleHeight = '200px';
     groupHeight = '200px';
     inputStream$;
    @Input()
     searchUserResult;
    @Output()
     searchUser: EventEmitter<any> = new EventEmitter();
    @Output()
     changeInput: EventEmitter<any> = new EventEmitter();
    constructor() {
        // pass
    }
    public ngOnInit() {
        // pass
    }
    public ngOnChanges() {
        if (!this.searchUserResult.isSearch) {
            this.searchKeyword = '';
        }
    }
    public ngAfterViewInit() {
        this.inputStream$ = fromEvent(this.searchInput.nativeElement, 'keyup')
            .subscribe((event: any) => this.searchUser.emit(event.target.value));
    }
    public ngOnDestroy() {
        this.inputStream$.unsubscribe();
    }
    @HostListener('window:click')  onWindowClick() {
        this.searchUserResult.isSearch = false;
        this.searchKeyword = '';
        this.groupShowText = '显示全部';
        this.groupHeight = '200px';
        this.singleShowText = '显示全部';
        this.singleHeight = '200px';
    }
     stopPropagation(event) {
        event.stopPropagation();
    }
     singleShowAll() {
        this.showAll('single');
    }
     groupShowAll() {
        this.showAll('group');
    }
     showAll(type: string) {
        if (this[`${type}ShowText`] === '显示全部') {
            this[`${type}ShowText`] = '收起';
            this[`${type}Height`] = 'none';
        } else {
            this[`${type}ShowText`] = '显示全部';
            this[`${type}Height`] = '200px';
        }
        setTimeout(() => {
            this.componentScroll.directiveRef.update();
        });
    }
     clearInput() {
        this.searchKeyword = '';
        this.groupShowText = '显示全部';
        this.groupHeight = '200px';
        this.singleShowText = '显示全部';
        this.singleHeight = '200px';
        this.searchUser.emit(this.searchKeyword);
        this.searchInput.nativeElement.focus();
    }
     changeChecked(item) {
        this.changeInput.emit(item);
    }
}
