import { AuthGuard } from "../auth.guard";

export const OtcRoute = {
         path: "otc",
         loadChildren: () =>
           import("src/modules/otc/otc.module").then(mod => mod.OtcModule),
         canActivate: [AuthGuard],
         data: {
           title: "OTC管理",
           icon: "shop",
           nzOpen: true,
           subRoutes: [
             {
               pageUrl: "common/manage/OTCBill",
               title: "挂单列表",
               icon: "ordered-list"
             },
             {
               pageUrl: "common/manage/OTCConfig",
               title: "OTC配置",
               icon: "ordered-list"
             }
           ]
         }
       };
