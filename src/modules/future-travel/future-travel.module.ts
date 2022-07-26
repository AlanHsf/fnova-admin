import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceiptComponent } from './receipt/receipt.component';
import { Routes, RouterModule } from "@angular/router";

export const routes: Routes = [
  {
    path: "receipt",
    component: ReceiptComponent,
    pathMatch: "full",
  }
];

@NgModule({
  declarations: [ReceiptComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class FutureTravelModule { }
