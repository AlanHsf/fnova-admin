import { AuthGuard } from '../auth.guard';

export const CmsRoute = {
  path: "cms",
  loadChildren: "src/modules/cms/cms.module#CmsModule",
  canActivate: [AuthGuard],
  data: {
    title: "CMS管理",
    icon: "file-text",
    nzOpen: true,
    subRoutes: [
      {
        pageUrl: "common/manage/Article",
        title: "文章列表",
        icon: "book"
      },
      {
        pageUrl: "common/manage/Category",
        title: "分类管理",
        icon: "book",
        data: {
          equalTo: "type:article",
          filters: [
            {
              equalTo: {
                key: "type",
                value: "admin"
              }
            }
          ]
        }
      },
      {
        pageUrl: "common/manage/Banner",
        title: "首页轮播图",
        icon: "book"
      },
      {
        pageUrl: "common/manage/SiteConfig",
        title: "站点参数",
        icon: "book"
      },
      {
        pageUrl: "common/manage/ContractAgreement",
        title: "用户协议",
        icon: "book"
      },
      {
        pageUrl: "common/manage/CompanySwitch",
        title: "开关配置",
        icon: "book"
      },
      {
        pageUrl: "common/manage/Footer",
        title: "网站底部信息",
        icon: "book"
      }
    ]
  }
};