import { AuthGuard } from '../auth.guard';

export const PipixiaMemberManageRoute = {
    path: 'pipixia-member-manage', loadChildren: () => import('src/modules/pipixia-member-manage/pipixia-member-manage.module').then(m => m.PipixiaMemberManageModule),
    canActivate: [AuthGuard],
    data: {
        title: '用户管理',
        icon: "usergroup-add",
        nzOpen: true,
        subRoutes:
            [
                // { path: 'opsuser', title: '系统小二', icon: 'user', },
                { path: 'member', title: '平台会员', icon: 'user', }
            ]
    }
}