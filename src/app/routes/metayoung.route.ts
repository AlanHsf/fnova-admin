import { AuthGuard } from '../auth.guard';

export const MetaYoungRoute = {
    path: 'metayoung', loadChildren: () => import('src/modules/metayoung/metayoung.module').then(mod => mod.MetaYoungModule),
    canActivate: [AuthGuard],
    data: {
      title: '元氧文化',
      icon: "project",
      nzOpen: true,
      subRoutes:
        [
          { pageUrl: 'dashboard', title:'元氧文化', icon:'project' },
        ]
    }
  }
