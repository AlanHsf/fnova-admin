import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MessageFileComponent } from './message-file.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG as DIY_CONFIG } from '../../services/common';
import { SharedPipeModule } from '../../pipes';

@NgModule({
    declarations: [
        MessageFileComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        PerfectScrollbarModule,//.forRoot(PERFECT_SCROLLBAR_CONFIG),
        SharedPipeModule
    ],
    exports: [
        MessageFileComponent
    ],
    providers: [{
        provide: PERFECT_SCROLLBAR_CONFIG,
        useValue: DIY_CONFIG
    }]
})

export class MessageFileModule { }
