import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: "",
  // redirectTo: "/metapunk/sps/dashboard",
  redirectTo: "/metapunk/sps/manager",
  pathMatch: "full"
}];

let MetaPunkRoute = {
  path: 'metapunk', loadChildren: () => import('../../../../src/modules/metapunk/metapunk.sps.manager.module').then(mod => mod.MetapunkSPSManagerModule),
  data: {
    title: 'Metapunk',
    icon: "project",
    nzOpen: true,
  }
}
routes.push(MetaPunkRoute)

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
