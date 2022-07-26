import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductProfitComponent } from './settings/product-profit/product-profit.component';
import { DistributeComponent } from './settings/distribute/distribute.component';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableComponent } from './components/nz-table/nz-table.component';
export const routes: Routes = [
  { path: 'product', component: ProductProfitComponent, pathMatch: 'full' },
  { path: 'distribute', component: DistributeComponent, pathMatch: 'full' },
]

@NgModule({
  declarations: [
    ProductProfitComponent,
    DistributeComponent,
    NzTableComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NzTableModule,
    NzSwitchModule,
    NzInputModule,
    NzButtonModule
  ]
})
export class RepastModule { }
