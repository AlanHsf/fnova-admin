import { AuthGuard } from '../auth.guard';
export const notespacelRoute = {
  path: "notespace",
  loadChildren: () =>
    import("src/modules/notespace/Notespace.module").then(mod => mod.NotespaceModule),

    // canActivate: [AuthGuard],
    data: {
      title: "笔记",
      icon: "book",
      nzOpen: true,
      subRoutes: [
        
        { path: "note-login", title: "选择模版", icon: "dashboard" }, 
        { path: "note-center", title: "选择模版", icon: "dashboard" }, 
        { path: "note-edit", title: "选择模版", icon: "dashboard" },   
       
      ]
    }
  };


