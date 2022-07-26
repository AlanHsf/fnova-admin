import { AuthGuard } from '../auth.guard';

export const PipixiaVehicleRoute = {
    path: 'pipixia-vehicle', loadChildren: () => import('src/modules/pipixia-vehicle-manage/pipixia-vehicle-manage.module').then(mod => mod.PipixiaVehicleManageModule),
    canActivate: [AuthGuard],
    data: {
        title: '车辆管理',
        icon: "car",
        nzOpen: false,
        subRoutes:
            [
                { path: 'info', title: '车辆信息', icon: 'dashboard' },
                { path: 'monitor', title: '车辆监控', icon: 'dashboard' },
                { path: 'alarm',title: '车辆报警', icon: 'dashboard' }
                // { pageUrl: 'common/manage/Xiaofang_student', title: '学员管理', icon: 'usergroup-add' },
                // // 以下是测试通用组件的轮播图列表，开发时请忽略，请自行在上方添加正常组件路由
                // { pageUrl: 'common/manage/Xiaofang_course', title: "课程管理", icon: 'book' }
            ]
    }
}