import { AuthGuard } from '../auth.guard';

export const WisdomRoute = {
    path: 'wisdom', loadChildren: () => import('src/modules/wisdom/wisdom.module').then(mod => mod.WisdomModule),
    canActivate: [AuthGuard],
    data: {
      title: '智慧关务',
      icon: "project",
      nzOpen: true,
      subRoutes:
        [
          { pageUrl: 'dashboard-park', title:'平台看板', icon:'project' },
        ]
    }
  }
