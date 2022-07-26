import { AuthGuard } from '../auth.guard';

export const PoolRoute = {
    path: 'pool', loadChildren: () => import('src/modules/pool/pool.module').then(mod => mod.PoolModule),
    canActivate: [AuthGuard],
    data: {
      title: '矿池管理',
      icon: "project",
      nzOpen: true,
      subRoutes:
        [
          { pageUrl: 'dashboard', title:'矿池总览', icon:'project' },
        ]
    }
  }
