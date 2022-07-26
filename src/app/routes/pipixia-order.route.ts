import { AuthGuard } from '../auth.guard';

export const PipixiaOrderRoute = {
    path: 'pipixia-order', loadChildren: () => import('src/modules/pipixia-order-manage/pipixia-order-manage.module').then(mod => mod.PipixiaOrderManageModule),
    canActivate: [AuthGuard],
    data: {
        title: '订单管理',
        icon: "car",
        nzOpen: true,
        subRoutes:
            [
                { path: 'order', title: '订单管理', icon: 'dashboard' },
                { path: 'refund', title: '退款管理', icon: 'dashboard' },
            ]
    }
}