import { AuthGuard } from '../auth.guard';

export const ProjectRoute = {
    path: 'project', loadChildren: () => import('src/modules/project/project.module').then(mod => mod.ProjectModule),
    canActivate: [AuthGuard],
    data: {
      title: '项目管理',
      icon: "project",
      nzOpen: true,
      subRoutes:
        [
          // { path: 'dashboard', title:'工作台', icon:'dashboard' },
          { pageUrl: 'common/manage/Project', title:'项目管理', icon:'project' },
          { pageUrl: 'common/manage/ProjectRequire', title:"需求管理",icon:'book' },
          { pageUrl: 'common/manage/ProjectTask', title:'任务管理', icon:'ordered-list' },
          // { pageUrl: 'project/gantt/all', title:'项目分解（甘特图）', icon:'bar-chart' },
        ]
    }
  }

export const ProjectSettingRoute = {
  path: 'project-setting', loadChildren: () => import('src/modules/project/project.module').then(mod => mod.ProjectModule),
  canActivate: [AuthGuard],
  data: {
    title: '项目管理设置',
    icon: "setting",
    nzOpen: false,
    subRoutes:
      [
        // { path: 'dashboard', title:'工作台', icon:'dashboard' },
        { pageUrl: 'common/manage/Category', title:'项目分类', icon:'project',data:{equalTo:"type:project"} },
        { pageUrl: 'common/manage/Category', title:"需求分类", icon:'book',data:{equalTo:"type:project-require"} },
        { pageUrl: 'common/manage/Category', title:'任务分类', icon:'ordered-list',data:{equalTo:"type:project-task"} },
      ]
  }
}