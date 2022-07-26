import { AuthGuard } from '../auth.guard';

export const PipixiaIndexRoute = {
    path: 'pipixia-index', loadChildren: () => import('src/modules/pipixia-vehicle-count/pipixia-vehicle-count.module').then(mod => mod.PipixiaVehicleCountModule),
    canActivate: [AuthGuard],
    data: {
        title: '首页',
        icon: "car",
        nzOpen: true,
        subRoutes:
            [
                { path: 'index', title: '首页管理', icon: 'dashboard' }
            ]
    }
}