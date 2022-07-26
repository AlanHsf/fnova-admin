import { AuthGuard } from '../auth.guard';

export const PipixiaMoneyManageRoute = {
    path: 'pipixia-money-manage', loadChildren: () => import('src/modules/pipixia-money-manage/pipixia-money-manage.module').then(m => m.PipixiaMoneyManageModule),
    canActivate: [AuthGuard],
    data: {
        title: '资金管理',
        icon: "money-collect",
        nzOpen: true,
        subRoutes:
            [
                { path: 'finance-account', title: '金融账户', icon: 'user', },
                { path: 'transaction-flow', title: '交易流水', icon: 'pay-circle', }
            ]
    }
}