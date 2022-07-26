import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Routes, RouterModule } from '@angular/router';
import { SchemaListComponent } from './schema-list/schema-list.component';

// import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { DnsListComponent } from './dns-list/dns-list.component';
import { NovaqlComponent } from './novaql/novaql.component';

import { CodemirrorModule } from '@ctrl/ngx-codemirror';

import { CommonPageModule } from '../common/common.module';
import { ApigComponent } from './apig/apig.component';

import { NzListModule } from 'ng-zorro-antd/list';
import { NzRadioModule } from 'ng-zorro-antd/radio';



import { SimpleApigAuthComponent } from './apig/simple-apig-auth/simple-apig-auth.component';
import { ApigListComponent } from './apig/apig-list/apig-list.component';

import { QRCodeModule } from 'angular2-qrcode';
import { PricePipe } from './price.pipe';
import { ApigAllotComponent } from './apig/apig-allot/apig-allot.component';
export const routes: Routes = [
  {
    path: 'schemas', component: SchemaListComponent,
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'novaql', component: NovaqlComponent,
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'dnspod', component: DnsListComponent,
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'apig', component: ApigComponent,
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'simple-apigAuth', component: SimpleApigAuthComponent,
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'apig-allot', component: ApigAllotComponent,
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'apig-list', component: ApigListComponent,
    runGuardsAndResolvers: 'always',
  }
]

@NgModule({
  declarations: [
    SchemaListComponent,
    DnsListComponent,
    NovaqlComponent,
    ApigComponent,
    SimpleApigAuthComponent,
    PricePipe,
    ApigAllotComponent,
    ApigListComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    NzCardModule,
    NzGridModule,
    NzPageHeaderModule,
    NzTagModule,
    NzButtonModule,
    NzTabsModule,
    NzDrawerModule,
    NzInputModule,
    NzIconModule,
    NzFormModule,
    NzTableModule,
    NzMenuModule,
    NzBadgeModule,
    CodemirrorModule,
    CommonPageModule,
    NzListModule,
    NzRadioModule,
    QRCodeModule,
    NzModalModule,
    NzInputNumberModule,
    NzSelectModule,
    NzPopconfirmModule
  ]
})
export class DeveloperModule { }
