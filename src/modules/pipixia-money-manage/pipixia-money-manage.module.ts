import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceAccountComponent } from './finance-account/finance-account.component';
import { Routes, RouterModule } from '@angular/router';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { SharedComponentModule } from 'src/shared-component/shared-component.module';
import { TransactionFlowComponent } from './transaction-flow/transaction-flow.component';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: 'finance-account', component: FinanceAccountComponent },
  { path: 'transaction-flow', component: TransactionFlowComponent },
]

@NgModule({
  declarations: [FinanceAccountComponent, TransactionFlowComponent],
  imports: [
    CommonModule,
        RouterModule.forChild(routes),
        NzNoAnimationModule,
        SharedComponentModule,
        NzMenuModule,
        NzTableModule,
        NzButtonModule,
        NzDropDownModule,
        NzInputModule,
        NzSelectModule,
        NzCollapseModule,
        NzIconModule,
        NzTypographyModule,
        NzModalModule,
        FormsModule
    ]
})
export class PipixiaMoneyManageModule { }
