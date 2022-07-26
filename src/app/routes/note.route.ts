import { AuthGuard } from '../auth.guard';

export const NoteRoute = {
         path: "note",
         loadChildren: "src/modules/note/note.module#NoteModule",
        //  loadChildren: () =>
        //  import("src/modules/account/account.module").then(
        //    mod => mod.AccountModule
        //  ),
         canActivate: [AuthGuard],
         data: {
           title: "笔记协同",
           icon: "file-text",
           nzOpen: true,
           subRoutes: [
             {
               pageUrl: "common/manage/NoteSpace",
               title: "笔记空间",
               icon: "book"
             },
             {
              pageUrl: "common/manage/NotePad",
              title: "笔记文档",
              icon: "book"
            },
           ]
         }
       };