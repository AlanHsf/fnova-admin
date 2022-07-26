import {
    Component, OnInit, Input, Output, EventEmitter,
    HostListener, OnChanges, ViewChild, AfterViewInit, OnDestroy
} from '@angular/core';
import { Observable,fromEvent } from 'rxjs';
import { debounceTime } from "rxjs/operators"
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

@Component({
    selector: 'search-user-component',
    templateUrl: './search-user.component.html',
    styleUrls: ['./search-user.component.scss']
})

export class SearchUserComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    @ViewChild(PerfectScrollbarComponent)  componentScroll;
    @ViewChild('searchInput')  searchInput;
    searchKeyword;
    searchInputIsShow = true;
    inputAnimate = 'out';
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
     selectUserResult: EventEmitter<any> = new EventEmitter();
    @Output()
     selectUserRoomResult: EventEmitter<any> = new EventEmitter();
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
            .pipe(debounceTime(300))
            .subscribe((event: any) => {
                this.searchUser.emit(event.target.value);
                this.singleShowText = '显示全部';
                this.singleHeight = '200px';
            });
    }
    public ngOnDestroy() {
        this.inputStream$.unsubscribe();
    }
    @HostListener('window:click')  onClickWindow() {
        this.searchKeyword = '';
        this.searchUser.emit(this.searchKeyword);
        this.inputAnimate = 'out';
        this.searchInputIsShow = true;
        this.searchUserResult.isSearch = false;
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
        this.searchUser.emit(this.searchKeyword);
        this.searchInput.nativeElement.focus();
    }
     selectSearchItem(item) {
        this.selectUserResult.emit(item);
    }
     selectSearchRoom(item) {
        this.selectUserRoomResult.emit(item);
    }
     showSearchInput() {
        this.searchInputIsShow = false;
        this.inputAnimate = 'in';
        this.groupShowText = '显示全部';
        this.groupHeight = '200px';
        this.singleShowText = '显示全部';
        this.singleHeight = '200px';
        setTimeout(() => {
            this.searchInput.nativeElement.focus();
        }, 200);
    }
     stopPropagation(event) {
        event.stopPropagation();
    }
}
