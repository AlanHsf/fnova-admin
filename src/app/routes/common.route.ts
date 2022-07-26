import { AuthGuard } from '../auth.guard';

export const CommonRoute = {
    path: 'common', loadChildren: () => import('src/modules/common/common.module').then(mod => mod.CommonPageModule),
    // path: 'common', loadChildren: 'src/pages/common/common.module#CommomPageModule',
    canActivate: [AuthGuard],
    data: {
      preload: true,
      isShow: true,  // 无需在导航显示，设置为false
      title: '通用模块',
      subRoutes:
        [
          {
            path: 'list', title: '通用列表'
          }
        ]
    }
  }