import { AuthGuard } from "../auth.guard";

export const MasterolStudentRoute = {
  path: "masterol",
  loadChildren: () =>
    import("src/modules/masterol/masterol.module").then(mod => mod.MasterolModule),
  canActivate: [AuthGuard],
  data: {
    title: "学生管理",
    icon: "file-text",
    nzOpen: true,
    subRoutes: [
      { pageUrl: "common/manage/Profile", title: "学生信息管理", icon: "book" },
      { pageUrl: "common/manage/SchoolUserMajor", title: "学生选择专业管理", icon: "book" },
      { pageUrl: "common/manage/LessonRecord", title: "学生学习记录", icon: "book" },
      { pageUrl: "common/manage/SchoolScore", title: "学生成绩管理", icon: "book" },
      { pageUrl: "common/manage/SchoolSingleScore", title: "学生单门成绩管理", icon: "book" },
      { pageUrl: "common/manage/SchoolAppEdu", title: "学生毕业申请", icon: "book" }
    ]
  }
};
