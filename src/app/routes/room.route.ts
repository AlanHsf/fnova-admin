import { AuthGuard } from '../auth.guard';

export const RoomRoute = {
    path: 'room', loadChildren: 'src/modules/room/room.module#RoomModule',
    canActivate: [AuthGuard],
    data: {
      title: '社群管理',
      icon: "file-text",
      nzOpen: true,
      subRoutes:
        [
          { pageUrl: 'common/manage/Room', title:'社群房间', icon:'book' },
          { pageUrl: 'common/manage/Category', title:'社群分类', icon:'book',data:{equalTo:"type:room"} },
        ]
    }
  }