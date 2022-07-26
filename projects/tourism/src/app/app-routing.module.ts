import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [];

let TourismRoute = [
  // {
  //   path: "",
  //   redirectTo: "/tourism/home",
  //   pathMatch: "full"
  // },
  // {
  //   path: 'tourism', loadChildren: () => import('../../../../src/modules/tourism/tourism.module').then(mod => mod.TourismModule),
  //   data: {
  //     title: 'tourism',
  //     icon: "project",
  //     nzOpen: true,
  //   }
  // }
]



routes.push(...TourismRoute)

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
