import { AuthGuard } from "../auth.guard";
let company = localStorage.getItem('company')
export const AccountManagementRoute = {
         path: "account-management",
         loadChildren: () =>
           import(
             "src/modules/account-management/account-management.module"
           ).then(mod => mod.AccountManagementModule),
         canActivate: [AuthGuard],
         data: {
           title: "账号权限管理",
           icon: "shop",
           nzOpen: true,
           subRoutes: [
             {
               pageUrl: "common/manage/Department",
               title: "学校管理",
               icon: "ordered-list"
             },
             {
               pageUrl: "common/manage/Company",
               title: "助学中心",
               icon: "ordered-list",
               data: { equalTo: `company:${company}` }
             }
           ]
         }
       };
