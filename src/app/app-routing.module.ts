import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EditImageComponent } from "src/modules/common/edit-image/edit-image.component";

const routesArray: Routes = [
  {
    path: "",
    redirectTo: "/user/login",
    // redirectTo: "/masterol/student-center",
    pathMatch: "full"
  }
];

// 全局系统模块路由
import { UserRoute } from "./routes/user.route";
import { CommonRoute } from "./routes/common.route";
import { AppRoute } from "./routes/app.route";
routesArray.push(CommonRoute);
routesArray.push(UserRoute);
routesArray.push(AppRoute);

routesArray.push({
  path: "office", loadChildren: () => import("../../projects/nova-office/src/modules/office/office.module").then(mod => mod.OfficeModule),
  // canActivate: [AuthGuard],
})



// 皮皮虾系列路由
import { PipixiaIndexRoute } from "./routes/pipixia-index.route";
routesArray.push(PipixiaIndexRoute); //  首页
import { PipixiaMemberManageRoute } from "./routes/pipixia-member.route";
routesArray.push(PipixiaMemberManageRoute); //  用户管理
import { PipixiaOrderRoute } from "./routes/pipixia-order.route";
routesArray.push(PipixiaOrderRoute); //  订单管理
import { PipixiaMoneyManageRoute } from "./routes/pipixia-money-manage.route";
routesArray.push(PipixiaMoneyManageRoute); //  资金管理
import { PipixiaVehicleRoute } from "./routes/pipixia-vehicle.route";
routesArray.push(PipixiaVehicleRoute); //  车辆管理
import { PipixiaPositionRoute } from "./routes/pipixia-position.route";
routesArray.push(PipixiaPositionRoute); //  位置管理
import { PipixiaRoute } from "./routes/pipixia.route";
routesArray.push(PipixiaRoute);

// 考试系统
import { EnglishRoute } from "./routes/english-test.route";
routesArray.push(EnglishRoute); //  优惠券管理

// 测试定制功能路由
import { XiaofangRoute } from "./routes/xiaofang.route";
routesArray.push(XiaofangRoute);
import { VolunteerRoute } from "./routes/volunteer.route";
import { VolunteerActivityRoute } from "./routes/volunteer.route";
import { VolunteerShopRoute } from "./routes/volunteer.route";
routesArray.push(VolunteerRoute);
routesArray.push(VolunteerActivityRoute);
routesArray.push(VolunteerShopRoute);


// 更多功能应用路由
import { QuestionRoute } from "./routes/question.route"; // 测试问卷调查
routesArray.push(QuestionRoute);

// 心上人
import { LoveRoute } from "./routes/love.route"; // 测试问卷调查
routesArray.push(LoveRoute);
// 智慧关务
import { WisdomRoute } from "./routes/wisdom.route"; // 测试问卷调查
routesArray.push(WisdomRoute);

import { NoteRoute } from "./routes/note.route";
routesArray.push(NoteRoute);
import { ActivityRoute } from "./routes/volunteer.route";
routesArray.push(ActivityRoute);
// import { CmsRoute } from "./routes/cms.route";
// routesArray.push(CmsRoute);
import { RoomRoute } from "./routes/room.route";
routesArray.push(RoomRoute);
import { ProjectRoute, ProjectSettingRoute } from "./routes/project.route";
routesArray.push(ProjectRoute, ProjectSettingRoute);
// 矿池
import { MetapunkRoute } from "./routes/metapunk.route";
routesArray.push(MetapunkRoute);
// 矿池
import { PoolRoute } from "./routes/pool.route";
routesArray.push(PoolRoute);
import { HR360BuildRoute } from "./routes/hr360.route";
routesArray.push(HR360BuildRoute);
import { HR360Route } from "./routes/hr360.route";
routesArray.push(HR360Route);
import { HR360ProfileRoute } from "./routes/hr360.route";
routesArray.push(HR360ProfileRoute);
import { SurveyRoute } from "./routes/survey.route";
routesArray.push(SurveyRoute);
import { ShopRoute } from "./routes/shop.route";
routesArray.push(ShopRoute);

import { ShareEatingRoute } from './routes/share-eating.route'
routesArray.push(ShareEatingRoute)

import { LessonRoute } from "./routes/lesson.route";
routesArray.push(LessonRoute);

import { LessonCardRoute } from "./routes/lesson.route";
routesArray.push(LessonCardRoute);

import { OrganizationRoute } from "./routes/organization.route";
routesArray.push(OrganizationRoute);
// 东城财务BI
// import { BiDevRoute } from "./routes/bi-dev.route";
// routesArray.push(BiDevRoute);
import { BiFinanceRoute } from "./routes/bi-finance.route";
routesArray.push(BiFinanceRoute);

// 星星加平台相关路由
import { FanstaskRoute } from "./routes/fanstask.route";
routesArray.push(FanstaskRoute);
import { OtcRoute } from "./routes/otc.route";
routesArray.push(OtcRoute);
import { UserManageRoute } from "./routes/user.route";
routesArray.push(UserManageRoute);
// 账号权限分配
import { AccountManagementRoute } from "./routes/account-management.route";
routesArray.push(AccountManagementRoute);

import { AccountRoute } from "./routes/account.route";
routesArray.push(AccountRoute);
import { LeagueRoute } from "./routes/league.route";
routesArray.push(LeagueRoute);

// VR Pano 页面
import { VrpanoRoute } from "./routes/vrpano.route";
routesArray.push(VrpanoRoute);

// diypage页面
import { DiyPageRoute } from "./routes/diypage.route";
routesArray.push(DiyPageRoute);
// 推理剧本社
import { DramaRoute } from "./routes/drama.route"
routesArray.push(DramaRoute)
//推理社社群
import { DramaCommunityRoute } from "./routes/drama-community.route"
routesArray.push(DramaCommunityRoute)
// 名片页面
import { CardRoute } from "./routes/card.route";
routesArray.push(CardRoute);
import { XiyuanRoute } from "./routes/xiyuan.route"
routesArray.push(XiyuanRoute);
//硕士在线
import { MasterolRoute } from "./routes/masterol.route";
routesArray.push(MasterolRoute);
//博士在线
import { MasterolDoctorRoute } from "./routes/masterol-doctor.route";
routesArray.push(MasterolDoctorRoute);
//硕士在线-学校管理
import { MasterolSchoolRoute } from './routes/masterol-school.route'
routesArray.push(MasterolSchoolRoute)
//自学考试-学校管理
import { SelfStudyRoute } from './routes/self-study.route'
routesArray.push(SelfStudyRoute)

// 灸大咖模块
import { JiudakaRoute } from './routes/jiudaka.route'
routesArray.push(JiudakaRoute)

//硕士在线-学生管理
import { MasterolStudentRoute } from './routes/masterol-student.route'
routesArray.push(MasterolStudentRoute)
// 硕士在线-第二课堂
import { MasterolSecondRoute } from './routes/masterol-second.route'
routesArray.push(MasterolSecondRoute)
// 博方学士英语通
import { DegreeRoute } from './routes/degree.route'
routesArray.push(DegreeRoute)
// 开发者及超管专用路由
import { SystemRoute } from "./routes/system.route";
routesArray.push(SystemRoute);
import { DevRoute } from "./routes/dev.route";
routesArray.push(DevRoute);
import { BIDevRoute } from "./routes/BIDev.route";
routesArray.push(BIDevRoute);
// 青山湖
import { QingShanHuRoute } from "./routes/qingshanhu.route";
routesArray.push(QingShanHuRoute)
// // 未来出行港
import { FutureTravelRoute } from "./routes/future-travel.route";
routesArray.push(FutureTravelRoute)

//笔记软件
import { notespacelRoute } from "./routes/notespace.route";
routesArray.push(notespacelRoute)

//旅游集散
import { TourismRoute } from "./routes/tourism.route";
routesArray.push(TourismRoute)

//旅游集散
import { MealRoute } from "./routes/meal.route";
routesArray.push(MealRoute)

//南昌女企协
import { NcnqxRoute } from "./routes/ncnqx.route";
routesArray.push(NcnqxRoute)
//南昌水业
import { NcsyRoute } from "./routes/ncsy.route";
routesArray.push(NcsyRoute)
//修修连
import { XxlRoute } from "./routes/xxl.route";
routesArray.push(XxlRoute)
// 导出路由常量
import { BzzbRoute } from "./routes/bzzb.route";
routesArray.push(BzzbRoute)



export const routes: Routes = routesArray;

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: "reload" })],
  exports: [RouterModule, EditImageComponent],
  declarations: [EditImageComponent]
})
export class AppRoutingModule { }
