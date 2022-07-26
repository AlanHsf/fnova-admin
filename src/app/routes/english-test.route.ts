import { AuthGuard } from '../auth.guard';

export const EnglishRoute = {
    path: 'english', loadChildren: () => import('src/modules/EnglishTest/EnglishTest.module').then(mod => mod.EnglishTestModule),
    // canActivate: [AuthGuard],
    data: {
      title: '应用管理',
      icon: "home",
      nzOpen: true,
    }
  }
