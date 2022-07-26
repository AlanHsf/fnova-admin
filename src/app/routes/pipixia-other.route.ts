import { AuthGuard } from '../auth.guard';

export const PipixiaOtherRoute = {
    path: 'pipixia-other', loadChildren: () => import('src/modules/pipixia-other-manage/pipixia-other-manage.module').then(mod => mod.PipixiaOtherManageModule),
    canActivate: [AuthGuard],
    data: {
        title: '硬件及围栏',
        icon: "car",
        nzOpen: false,
        subRoutes:
            [
                { path: 'hardware', title: '硬件管理', icon: 'dashboard' },
                { path: 'fence', title: '电子围栏', icon: 'dashboard' }
            ]
    }
}