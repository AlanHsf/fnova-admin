import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [];

let MetaPunkRoute = {
  path: 'metapunk', loadChildren: () => import('../../../../src/modules/metapunk/metapunk.games.module').then(mod => mod.MetapunkGamesModule),
  data: {
    title: 'Metapunk',
    icon: "project",
    nzOpen: true,
  }
}



routes.push(
  MetaPunkRoute,
  {
    path: "",
    // redirectTo: "/metapunk/sps/dashboard",
    redirectTo: "/metapunk/login",
    pathMatch: "full"
  }
  )

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
