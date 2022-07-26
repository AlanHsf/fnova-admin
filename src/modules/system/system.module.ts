import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from "@angular/router";


import { SettingsComponent } from "./settings/settings.component"

export const routes: Routes = [
    {
      path: "setting",
      component: SettingsComponent,
      pathMatch: "full"
    } //
  ];
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class SystemModule { }
