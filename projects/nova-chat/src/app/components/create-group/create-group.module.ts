import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CreateGroupComponent } from './create-group.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG as DIY_CONFIG } from '../../services/common';
import { SearchMemberModule } from '../search-member';
import { SharedPipeModule } from '../../pipes';
import { SharedDirectiveModule } from '../../directives';

@NgModule({
    declarations: [
        CreateGroupComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        PerfectScrollbarModule,//.forRoot(PERFECT_SCROLLBAR_CONFIG),
        SearchMemberModule,
        SharedPipeModule,
        SharedDirectiveModule
    ],
    exports: [
        CreateGroupComponent
    ],
    providers: [{
        provide: PERFECT_SCROLLBAR_CONFIG,
        useValue: DIY_CONFIG
    }]
})

export class CreateGroupModule { }
