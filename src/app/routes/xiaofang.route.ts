import { AuthGuard } from '../auth.guard';

export const XiaofangRoute = {
    // path: 'xiaofang', loadChildren: 'src/pages/xiaofang/xiaofang.module#XiaofangModule',
    path: 'xiaofang', loadChildren: () => import('src/modules/xiaofang/xiaofang.module').then(mod => mod.XiaofangModule),
    canActivate: [AuthGuard],
    data: {
      title: '消防教务管理',
      icon: "home",
      nzOpen: true,
      subRoutes:
        [
          { path: 'dashboard', title:'工作台', icon:'dashboard' },
          { pageUrl: 'common/manage/Xiaofang_class', title:'班级管理', icon:'bank' },
          { pageUrl: 'common/manage/Xiaofang_student', title:'学员管理', icon:'usergroup-add' },
          // 以下是测试通用组件的轮播图列表，开发时请忽略，请自行在上方添加正常组件路由
          { pageUrl: 'common/manage/Xiaofang_course', title:"课程管理",icon:'book' }
        ]
    }
  }