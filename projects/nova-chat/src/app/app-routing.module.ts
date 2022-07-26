import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainCanActivate, PreloadService } from './services/common';

export let routes: Routes = [
    {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then(mod => mod.LoginModule)
    },
    {
        path: 'register',
        loadChildren: () => import('./pages/register/register.module').then(mod => mod.RegisterModule)

    },
    {
        path: 'main',
        canActivate: [MainCanActivate],
        loadChildren: () => import('./pages/main/main.module').then(mod => mod.MainModule),
        data: {
            preload: true
        }
    },
    {
        path: 'map/:pointer',
        loadChildren: () => import('./pages/map/map.module').then(mod => mod.MapModule),
    },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/login',
        pathMatch: 'full'
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    useHash: true,
    preloadingStrategy: PreloadService
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
