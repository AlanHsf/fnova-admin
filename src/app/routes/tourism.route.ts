import { AuthGuard } from '../auth.guard';

export const TourismRoute = {
    path: 'toursim', loadChildren: () => import('src/modules/tourism/tourism.module').then(mod => mod.TourismModule),
    canActivate: [AuthGuard],
    data: {
      title: '旅游集散',
      icon: "project",
      nzOpen: true,
      subRoutes:
        [
          { pageUrl: 'toursim-admin', title:'旅游集散', icon:'project' },
        ]
    }
  }
