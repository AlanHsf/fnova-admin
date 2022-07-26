import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavbarComponent} from './navbar.component'
import { NzModalModule } from 'ng-zorro-antd/modal';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
@NgModule({
  declarations: [NavbarComponent],
  imports: [
    CommonModule,NzModalModule,RouterModule,NzIconModule,NzTabsModule
  ],
  exports:[
    NavbarComponent
  ]
})
export class NavbarModule { }
