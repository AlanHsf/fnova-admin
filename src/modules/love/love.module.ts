import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { TransactionComponent } from "./views/transaction/transaction.component"

export const routes: Routes = [
  {
    path: "transaction-dashboard",
    component: TransactionComponent,
    pathMatch: "full",
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  declarations: [
    TransactionComponent
  ]
})
export class LoveModule { }
