import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCateComponent } from './product-cate/product-cate/product-cate.component';
import { ProductManageComponent } from './product-manage/product-manage/product-manage.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'product-cate', component: ProductCateComponent, pathMatch: 'full' },
  { path: 'product-manage', component: ProductManageComponent, pathMatch: 'full' },
]

@NgModule({
  declarations: [ProductCateComponent, ProductManageComponent],
  imports: [
    CommonModule
  ]
})
export class RepastProductModule { }
