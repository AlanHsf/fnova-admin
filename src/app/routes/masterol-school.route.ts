import { AuthGuard } from "../auth.guard";

export const MasterolSchoolRoute = {
  path: "masterol",
  loadChildren: () =>
    import("src/modules/masterol/masterol.module").then(mod => mod.MasterolModule),
  canActivate: [AuthGuard],
  data: {
    title: "学校管理",
    icon: "file-text",
    nzOpen: true,
    subRoutes: [
      { pageUrl: "common/manage/Department", title: "学校信息管理", icon: "book" },
      { pageUrl: "common/manage/SchoolMajor", title: "学校专业", icon: "book" },
      { pageUrl: "common/manage/SchoolPlan", title: "学校培养计划", icon: "book" },
      { pageUrl: "common/manage/SchoolClass", title: "学校班级管理", icon: "book" },
      { pageUrl: "common/manage/LessonTeacher", title: "学校老师管理", icon: "book" },
      { pageUrl: "common/manage/SchoolTestLog", title: "学校考试日期表", icon: "book" },
      { path: "dashboard", title: "数据展板", icon: "book" },
    ]
  }
};
