import { AuthGuard } from '../auth.guard';

export const VolunteerRoute = {
    path: 'volunteer', loadChildren: () => import('src/modules/volunteer/volunteer.module').then(mod => mod.VolunteerModule),
    canActivate: [AuthGuard],
    data: {
      title: '数据分析',
      icon: "home",
      nzOpen: true,
      subRoutes:
        [
          { path: 'dashboard/overview', title:'数据总览', icon:'dashboard' },
          // { pageUrl: 'common/manage/VolunteerProfile', title:'志愿者管理', icon:'usergroup-add' },
          // { pageUrl: 'common/frame/shop/member.list', title:'志愿者审核', icon:'usergroup-add' },
          // { pageUrl: 'common/manage/VolunteerProfile', title:'往届志愿者', icon:'usergroup-add' },
          // { pageUrl: 'common/manage/ActivityRegister', title:'服务记录', icon:'usergroup-add' },
        ]
    }
  }

  export const ActivityRoute = {
    path: 'activity', loadChildren: () => import('src/modules/volunteer/volunteer.module').then(mod => mod.VolunteerModule),
    canActivate: [AuthGuard],
    data: {
      title: '活动会议',
      icon: "home",
      nzOpen: true,
      subRoutes:
        [
          { path: 'dashboard', title:'活动看板', icon:'dashboard' },
          { pageUrl: 'common/manage/Activity', title:'活动会议', icon:'usergroup-add' },
          // { pageUrl: 'common/manage/Device', title:'智能终端', icon:'usergroup-add' }
        ]
    }
  }

  export const VolunteerActivityRoute = {
    path: 'volunteer-activity', loadChildren: () => import('src/modules/volunteer/volunteer.module').then(mod => mod.VolunteerModule),
    canActivate: [AuthGuard],
    data: {
      title: '志愿项目管理',
      icon: "home",
      nzOpen: true,
      subRoutes:
        [
          { pageUrl: 'volunteer/dashboard/overview', title:'数据总览', icon:'dashboard' },
          { path: 'dashboard', title:'项目看板', icon:'dashboard' },
          { pageUrl: 'common/manage/Activity', title:'志愿项目', icon:'usergroup-add' },
          { pageUrl: 'common/manage/Device', title:'智能终端', icon:'usergroup-add' }
        ]
    }
  }

  export const VolunteerShopRoute = {
    path: 'volunteer-bank', loadChildren: () => import('src/modules/volunteer/volunteer.module').then(mod => mod.VolunteerModule),
    canActivate: [AuthGuard],
    data: {
      title: '幸福V银行',
      icon: "home",
      nzOpen: false,
      subRoutes:
        [
          { pageUrl: 'common/manage/ActivityRegister', title:'时长查询', icon:'bank' },
        ]
    }
  }