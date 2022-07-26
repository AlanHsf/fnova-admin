import { AuthGuard } from "../auth.guard";

export const DegreeRoute = {
  path: "degree",
  loadChildren: () =>
    import("src/modules/bf-degree/degree.module").then(mod => mod.DegreeModule),
  canActivate: [AuthGuard],
  data: {
    title: "英语学位通",
    icon: "file-text",
    nzOpen: true,
  }
};