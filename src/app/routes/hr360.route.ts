import { AuthGuard } from '../auth.guard';

export const HR360Route = {
    path: 'hr360', loadChildren: () => import('src/modules/hr360/hr360.module').then(mod => mod.HR360Module),
    canActivate: [AuthGuard],
    data: {
      title: '绩效环评',
      icon: "home",
      nzOpen: true,
      subRoutes:
        [
          { path: 'dashboard', title:'数据总览', icon:'dashboard' },
          { pageUrl: 'common/manage/Evaluation', title:'评比发布', icon:'usergroup-add' },
          { pageUrl: 'common/manage/UserCertify', title:'证书审核', icon:'usergroup-add' },
          // { path: 'dashboard-2019', title:'2019考评报告', icon:'dashboard' },
          // { pageUrl: 'common/frame/shop/member.list', title:'志愿者审核', icon:'usergroup-add' },
          // { pageUrl: 'common/manage/HR360Profile', title:'往届志愿者', icon:'usergroup-add' },
          // { pageUrl: 'common/manage/ActivityRegister', title:'服务记录', icon:'usergroup-add' },
        ]
    }
  }

  export const HR360ProfileRoute = {
    path: 'hr360-profile', loadChildren: () => import('src/modules/hr360/hr360.module').then(mod => mod.HR360Module),
    canActivate: [AuthGuard],
    data: {
      title: '人事档案',
      icon: "home",
      nzOpen: true,
      subRoutes:
        [
          { pageUrl: 'common/manage/Department', title:'组织架构', icon:'usergroup-add' },
          { pageUrl: 'common/manage/Profile', title:'人事档案', icon:'usergroup-add',data:{equalTo:"type:depart"} },
          // { pageUrl: 'common/frame/shop/member.list', title:'志愿者审核', icon:'usergroup-add' },
          // { pageUrl: 'common/manage/HR360Profile', title:'往届志愿者', icon:'usergroup-add' },
          // { pageUrl: 'common/manage/ActivityRegister', title:'服务记录', icon:'usergroup-add' },
        ]
    }
  }

  export const HR360BuildRoute = {
    path: 'hr360-build', loadChildren: () => import('src/modules/hr360/hr360.module').then(mod => mod.HR360Module),
    canActivate: [AuthGuard],
    data: {
      title: '建筑项目',
      icon: "home",
      nzOpen: true,
      subRoutes:
        [
          { pageUrl: 'organization/dashboard', title:'人才沙盘', icon:'usergroup-add',data:{equalTo:"type:depart"} },
          { pageUrl: 'common/manage/DepartBuild', title:'建筑项目', icon:'usergroup-add' },
          { pageUrl: 'common/manage/DepartCert', title:'挂证情况', icon:'usergroup-add' },
          { pageUrl: 'common/manage/Profile', title:'人事档案', icon:'usergroup-add' },
          // { pageUrl: 'common/frame/shop/member.list', title:'志愿者审核', icon:'usergroup-add' },
          // { pageUrl: 'common/manage/HR360Profile', title:'往届志愿者', icon:'usergroup-add' },
          // { pageUrl: 'common/manage/ActivityRegister', title:'服务记录', icon:'usergroup-add' },
        ]
    }
  }