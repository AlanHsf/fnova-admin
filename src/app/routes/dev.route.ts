import { AuthGuard } from "../auth.guard";

export const DevRoute = {
         path: "developer",
         loadChildren: () =>
           import("src/modules/developer/developer.module").then(
             mod => mod.DeveloperModule
           ),
         canActivate: [AuthGuard],
         data: {
           title: "开发者管理",
           icon: "home",
           nzOpen: true,
           subRoutes: [
             // { path: 'dashboard', title:'工作台', icon:'dashboard' },
             {
               pageUrl: "common/manage/Company",
               title: "账套:公司管理",
               icon: "home"
             },
             {
               pageUrl: "common/manage/Site",
               title: "账套:站点管理",
               icon: "home"
             },
             {
               pageUrl: "common/manage/CompanyModule",
               title: "账套:功能套餐",
               icon: "home"
             },
             // { pageUrl: "common/manage/BiDev", title: "BI表格管理", icon: "book" },
             {
               pageUrl: "common/manage/DevModule",
               title: "Module设计管理",
               icon: "book"
             },
             {
               pageUrl: "common/manage/DevRoute",
               title: "Route设计管理",
               icon: "book"
             },
             {
               pageUrl: "common/manage/DevSchema",
               title: "Schema设计管理",
               icon: "book"
             },
             { path: "schemas", title: "Schema维护看板", icon: "book" }
           ]
         }
       };
