import { AuthGuard } from '../auth.guard';

export const UserRoute = {
    path: 'user', loadChildren: () => import('src/modules/user/user.module').then(mod => mod.UserModule),
    // path: 'user', loadChildren: 'src/pages/user/user.module#UserModule',
    data: {
      preload: true,
      isShow: false,  // 用户相关页面，无需在导航显示，设置为false
      title: '用户中心',
      subRoutes:
        [
          {
            path: 'login', title: '登陆'
          }
        ]
    }
  }

  export const UserManageRoute = {
    path: 'user-manage', loadChildren: () => import('src/modules/user/user.module').then(mod => mod.UserModule),
    canActivate: [AuthGuard],
    data: {
      title: '会员管理',
      icon: "shop",
      nzOpen: true,
      subRoutes:
        [
          {
            pageUrl: "common/manage/_User",
            title: "会员列表",
            icon: "ordered-list",
          },
          {
            pageUrl: "common/manage/UserAgentLevel",
            title: "分销级别",
            icon: "ordered-list",
          },
        ]
    }
  }