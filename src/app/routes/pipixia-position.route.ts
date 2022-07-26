import { AuthGuard } from '../auth.guard';

export const PipixiaPositionRoute = {
    path: 'pipixia-position', loadChildren: () => import('src/modules/pipixia-position-manage/pipixia-position-manage.module').then(mod => mod.PipixiaPositionManageModule),
    canActivate: [AuthGuard],
    data: {
        title: '位置管理',
        icon: "car",
        nzOpen: false,
        subRoutes:
            [
                { path: 'distributed', title: '车辆分布', icon: 'dashboard' },
                { path: 'track', title: '车辆跟踪', icon: 'dashboard' },
                { path: 'fence', title: '电子围栏', icon: 'dashboard' }
            ]
    }
}