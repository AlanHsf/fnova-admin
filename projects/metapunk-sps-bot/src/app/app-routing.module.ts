import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [];

let MetaPunkRoute = {
  path: 'metapunk', loadChildren: () => import('../../../../src/modules/metapunk/metapunk.sps.module').then(mod => mod.MetapunkSPSModule),
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
