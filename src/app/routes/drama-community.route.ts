import { AuthGuard } from "../auth.guard";

export const DramaCommunityRoute = {
  path: "drama",
  loadChildren: () =>
    import("src/modules/bi-dev/drama/drama.module").then(mod => mod.DramaModule),
  canActivate: [AuthGuard],
  data: {
    title: "推理社社区",
    icon: "file-text",
    nzOpen: true,
    subRoutes: [
      { pageUrl: "common/manage/DramaPost",title:"发帖管理",icon:"book"},
      { pageUrl: "common/manage/DramaPostLog",title:"点赞回帖",icon:"book"}
    ]
  }
};
