import { AuthGuard } from '../auth.guard';

export const JiudakaRoute = {
    path: 'jiudaka', loadChildren: () => import('src/modules/jiudaka/jiudaka.module').then(mod => mod.JiudakaModule),
    canActivate: [AuthGuard],
    data: {
      title: '数据中心',
      icon: "project",
      nzOpen: true,
      subRoutes:
        [
          { pageUrl: 'home-dashboard', title:'数据中心', icon:'project' },
        ]
    }
  }
