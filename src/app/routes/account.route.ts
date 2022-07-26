import { AuthGuard } from "../auth.guard";

export const AccountRoute = {
         path: "account",
         loadChildren: () =>
           import("src/modules/account/account.module").then(
             mod => mod.AccountModule
           ),
         canActivate: [AuthGuard],
         data: {
           title: "财务管理",
           icon: "shop",
           nzOpen: true,
           subRoutes: [
             {
               path: "dashboard",
               title: "资金总览",
               icon: "dashboard"
             },
             {
               pageUrl: "common/manage/Account",
               title: "资金账户",
               icon: "ordered-list"
             },
             {
               pageUrl: "common/manage/AccountLog",
               title: "流水对账",
               icon: "ordered-list"
             },
             {
               pageUrl: "common/manage/AccountPayCard",
               title: "卡密充值",
               icon: "ordered-list"
             },
            //  {
            //    pageUrl: "common/manage/_User",
            //    title: "等级管理",
            //    icon: "ordered-list"
            //  }
           ]
         }
       };
