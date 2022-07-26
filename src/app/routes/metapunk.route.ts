import { AuthGuard } from '../auth.guard';

export const MetapunkRoute = {
    path: 'metapunk', loadChildren: () => import('src/modules/metapunk/metapunk.module').then(mod => mod.MetapunkModule),
    canActivate: [AuthGuard],
    data: {
      title: '元宇宙朋克',
      icon: "project",
      nzOpen: true,
      subRoutes:
        [
          { pageUrl: 'axie/dashboard', title:'元宇宙朋克', icon:'project' },
        ]
    }
  }
