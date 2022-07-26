import { AuthGuard } from '../auth.guard';

export const AppRoute = {
    path: 'app', loadChildren: () => import('src/modules/app/app.module').then(mod => mod.AppModule),
    canActivate: [AuthGuard],
    data: {
      title: '应用管理',
      icon: "home",
      nzOpen: true,
      subRoutes:
        [
          { pageUrl: 'common/manage/App', title:'应用管理', icon:'dashboard' },
          { pageUrl: 'common/manage/Category', title:'应用分类', icon:'book',data:{equalTo:"type:app"} },
        ]
    }
  }
