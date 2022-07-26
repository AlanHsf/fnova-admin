import { AuthGuard } from '../auth.guard';

export const ShareEatingRoute = {
    path: 'share', loadChildren: () =>
    import("src/modules/repast/repast.module").then(mod => mod.RepastModule),
    canActivate: [AuthGuard],
    data: {
      title: '共享门店',
      icon: "file-text",
      nzOpen: true,
      subRoutes:
        [
            { path: 'product', title:'产品管理', icon:'book' }
        ]
    }
  }

