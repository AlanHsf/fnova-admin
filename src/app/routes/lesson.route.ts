import { AuthGuard } from "../auth.guard";

export const LessonRoute = {
         path: "lesson",
         loadChildren: () =>
           import("src/modules/lesson/lesson.module").then(
             mod => mod.LessonModule
           ),
         canActivate: [AuthGuard],
         data: {
           title: "未来课堂V1",
           icon: "shop",
           nzOpen: true,
           subRoutes: [
             {
               pageUrl: "common/manage/Lesson",
               title: "课程列表",
               icon: "ordered-list"
             },
             {
               pageUrl: "common/manage/LessonTeacher",
               title: "讲师列表",
               icon: "ordered-list"
             },
             {
               pageUrl: "common/manage/LessonOrder",
               title: "订单列表",
               icon: "ordered-list"
             },
             {
               pageUrl: "common/manage/LessonUserLog",
               title: "学习记录",
               icon: "ordered-list"
             },
             {
               pageUrl: "common/manage/LessonCardDate",
               title: "抢单配置",
               icon: "ordered-list"
             }
           ]
         }
       };

export const LessonCardRoute = {
  path: "lesson-card",
  loadChildren: () =>
    import("src/modules/lesson/lesson.module").then((mod) => mod.LessonModule),
  canActivate: [AuthGuard],
  data: {
    title: "课堂班级卡",
    icon: "shop",
    nzOpen: true,
    subRoutes: [
      {
        pageUrl: "common/manage/LessonCard",
        title: "班级卡列表",
        icon: "ordered-list",
      },
      {
        pageUrl: "common/manage/LessonCardOrder",
        title: "班级卡订单",
        icon: "ordered-list",
      }
    ],
  },
};
