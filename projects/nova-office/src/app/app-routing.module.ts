import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OfficeModule } from "../modules/office/office.module"
import {CloudModule } from "../modules/cloud/cloud.module"
const routes: Routes = [
  {
    path: "office", loadChildren: () => import("../modules/office/office.module").then(mod => mod.OfficeModule),
      // canActivate: [AuthGuard],
  },
  {
    path: "cloud", loadChildren: () => import("../modules/cloud/cloud.module").then(mod => mod.CloudModule),
      // canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [CloudModule, OfficeModule, RouterModule.forRoot(routes)],
  exports: [RouterModule, CloudModule, OfficeModule ]
})
export class AppRoutingModule { }
