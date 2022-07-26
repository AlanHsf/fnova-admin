import { AuthGuard } from '../auth.guard';

export const NcsyRoute = {
    path: 'ncsy', loadChildren: () => import('src/modules/ncsy/ncsy.module').then(mod => mod.NcsyModule),
    canActivate: [AuthGuard],
    data: {
        title: '南昌水业',
        icon: "project",
        nzOpen: true
    }
}