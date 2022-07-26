import { AuthGuard } from '../auth.guard';

export const SelfStudyRoute = {
    path: 'self-study', loadChildren: () => import('src/modules/self-study/self-study.module').then(mod => mod.SelfStudyModule),
    canActivate: [AuthGuard],
    data: {
      title: '自学考试',
      icon: "project",
      nzOpen: true,
      subRoutes:
        [
          
        ]
    }
  }
