import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG as DIY_CONFIG } from '../../services/common';
import { LinkmanListComponent } from './linkman-list.component';
import { SharedPipeModule } from '../../pipes';
import { SharedDirectiveModule } from '../../directives';

@NgModule({
    declarations: [
        LinkmanListComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        PerfectScrollbarModule,//.forRoot(PERFECT_SCROLLBAR_CONFIG),
        SharedPipeModule,
        SharedDirectiveModule
    ],
    exports: [
        LinkmanListComponent
    ],
    providers: [{
        provide: PERFECT_SCROLLBAR_CONFIG,
        useValue: DIY_CONFIG
    }]
})

export class LinkmanListModule { }
