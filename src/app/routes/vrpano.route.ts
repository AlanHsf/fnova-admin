// import { AuthGuard } from '../auth.guard';

export const VrpanoRoute = {
        path: 'vrpano', 
        loadChildren: () => import('src/modules/vrpano/vrpano.module').then(mod => mod.VrpanoModule),
        // loadChildren: "src/modules/vrpano/vrpano.module#VrpanoModule",
        //  canActivate: [AuthGuard],
         data: {
           title: "VRPANO",
           icon: "file-text",
           nzOpen: true,
           subRoutes: [
            {
              pageUrl: "common/manage/VRPano",
              title: "场景列表",
              icon: "book"
            },
            {
              pageUrl: "common/manage/Category",
              title: "分类管理",
              icon: "book",
              data: {
                equalTo: "type:vrpano"
              }
            },
             {
               pageUrl: "editor",
               title: "可视化编辑",
               icon: "book"
             }
           ]
         }
       };