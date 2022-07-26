
export const MasterolDoctorRoute = {
  path: "masterol-doctor",
  loadChildren: () =>
    import("src/modules/masterol-doctor/masterol-doctor.module").then(mod => mod.MasterolDoctorModule),
  data: {
    title: "课程管理",
    icon: "file-text",
    nzOpen: true,
    subRoutes: [
      { pageUrl: "common/manage/Lesson", title: "课程管理", icon: "book" },
      { pageUrl: "common/manage/LessonArticle", title: "章节管理", icon: "book" },
    ]
  }
};
