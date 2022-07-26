import { AuthGuard } from '../auth.guard';

export const OrganizationRoute = {
    path: 'organization', loadChildren: () => import('src/modules/organization/organization.module').then(mod => mod.OrganizationModule),
    canActivate: [AuthGuard],
    data: {
      title: '组织架构',
      icon: "unordered-list",
      nzOpen: true,
      subRoutes:
        [
          // { pageUrl: 'common/manage/VolunteerProfile', title:'志愿者管理', icon:'usergroup-add' },
          { pageUrl: 'common/manage/Department', title:'部门管理', icon:'usergroup-add',data:{equalTo:"type:depart"} },
          { pageUrl: 'common/manage/Category', title:'部门分类', icon:'book',data:{equalTo:"type:depart"} },
          { pageUrl: 'common/manage/_Role', title:'角色管理', icon:'user' },
          { pageUrl: 'common/manage/_User', title:'管理员', icon:'user',data:{equalTo:"type:admin"}},
          // { pageUrl: 'common/manage/VolunteerGroup', title:'小组管理', icon:'bank' },
          // { pageUrl: 'common/manage/VolunteerCourse', title:'课程管理', icon:'book' },
        ]
    }
  }
