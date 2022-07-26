import { AuthGuard } from '../auth.guard';

export const LoveRoute = {
    path: 'love', loadChildren: () => import('src/modules/love/love.module').then(mod => mod.LoveModule),
    canActivate: [AuthGuard],
    data: {
      title: '心上人平台交易看板',
      icon: "project",
      nzOpen: true,
      subRoutes:
        [
          { pageUrl: 'love-dashboard', title:'平台交易看板', icon:'project' },
        ]
    }
  }
