import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { NzNoAnimationModule } from "ng-zorro-antd/core/no-animation";

import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { PipesModule } from "../../pipes/pipes.module";

import { ScrollingModule } from "@angular/cdk/scrolling";

export const routes: Routes = [
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NzNoAnimationModule,
    NzDrawerModule,
    PipesModule,
    ScrollingModule
  ]
})
export class AccountManagementModule {}
