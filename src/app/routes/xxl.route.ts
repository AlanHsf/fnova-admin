import { AuthGuard } from '../auth.guard';

export const XxlRoute = {
    path: 'xxl', loadChildren: () => import('src/modules/xxl/xxl.module').then(mod => mod.XxlModule),
    canActivate: [AuthGuard],
    data: {
        title: '修修连',
        icon: "project",
        nzOpen: true
    }
}