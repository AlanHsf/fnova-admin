import { AuthGuard } from '../auth.guard';

export const NcnqxRoute = {
  path: 'ncnqx', loadChildren: () => import('src/modules/ncnqx/ncnqx.module').then(mod => mod.NCNQXModule),
  canActivate: [AuthGuard],
  data: {
    title: '南昌女企协',
    icon: "project",
    nzOpen: true

  }
}
