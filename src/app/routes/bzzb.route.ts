import { AuthGuard } from '../auth.guard';

export const BzzbRoute = {
    path: 'bzzb', loadChildren: () => import('src/modules/bzzb/bzzb.module').then(mod => mod.BzzbModule),
    canActivate: [AuthGuard],
    data: {
        title: '伴盏资本',
        icon: "project",
        nzOpen: true
    }
}