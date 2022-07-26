import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { NzNoAnimationModule } from "ng-zorro-antd/core/no-animation";

import { DealDashboardComponent } from "./deal-dashboard/deal-dashboard.component";
export const routes: Routes = [
    {
      path: "dashboard",
      component: DealDashboardComponent,
      pathMatch: "full"
    } //
  ];
@NgModule({
  declarations: [DealDashboardComponent],
  imports: [CommonModule, RouterModule.forChild(routes), NzNoAnimationModule]
})
export class AccountModule {}
