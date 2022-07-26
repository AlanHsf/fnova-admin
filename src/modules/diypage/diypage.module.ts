import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { FormsModule } from '@angular/forms';
import { A11yModule } from '@angular/cdk/a11y';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { PageViewComponent } from './page-view/page-view.component';
import { CommonPageModule } from "../common/common.module";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { SiteCreatorComponent } from './site-creator/site-creator.component';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
// module
import { DiySearchComponent } from './diy-search/diy-search.component';
import { DiyCarouselComponent } from './diy-carousel/diy-carousel.component';
import { DiyHotdotbarComponent } from './diy-hotdotbar/diy-hotdotbar.component';
import { DiyGridComponent } from './diy-grid/diy-grid.component';
import { DiyShopComponent } from './diy-shop/diy-shop.component'
import { DiySingleimgComponent } from './diy-singleimg/diy-singleimg.component'
import { DiyGuidelistComponent } from './diy-guidelist/diy-guidelist.component'
import { DiyMultipleimgComponent } from './diy-multipleimg/diy-multipleimg.component'
import { DiyGuidelineComponent } from './diy-guideline/diy-guideline.component'
import { DiyTabsComponent } from './diy-tabs/diy-tabs.component'
import { DiyMyComponent } from './diy-my/diy-my.component'
import { DiyVideoComponent } from './diy-video/diy-video.component'
import { DiyStoreComponent } from './diy-store/diy-store.component'
import { DiySpellgroupComponent } from './diy-spellgroup/diy-spellgroup.component'
import { DiySeckillComponent } from './diy-seckill/diy-seckill.component'

import { PipesModule } from "../../pipes/pipes.module";
// component
import { DiyToolbarComponent } from './component/diy-toolbar/diy-toolbar.component';
import { DiyColorComponent } from './component/diy-color/diy-color.component';
import { DiyLessongroupComponent } from './diy-lessongroup/diy-lessongroup.component';
import { DiyCouponsComponent } from './diy-coupons/diy-coupons.component';
import { DiyArticleComponent } from './diy-article/diy-article.component';
import { DiyIntroComponent } from './diy-intro/diy-intro.component';
import { DiyPersonalComponent } from './diy-personal/diy-personal.component';
import { MyfunctionComponent } from './myfunction/myfunction.component';
import { DiyAccountComponent } from './diy-account/diy-account.component';
import { DiyRichtextComponent } from './diy-richtext/diy-richtext.component';



import { EditorModule } from "@tinymce/tinymce-angular";

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent, pathMatch: 'full' },
    { path: 'sitecreator', component: SiteCreatorComponent, pathMatch: 'full' },
]
// 标题栏

@NgModule({
    entryComponents: [PageViewComponent],
    declarations: [
        DashboardComponent,
        PageViewComponent,
        SiteCreatorComponent,
        DiySearchComponent,
        DiyCarouselComponent,
        DiyHotdotbarComponent,
        DiyToolbarComponent,
        DiyGridComponent,
        DiyShopComponent,
        DiyColorComponent,
        DiySingleimgComponent,
        DiyGuidelistComponent,
        DiyMultipleimgComponent,
        DiyGuidelineComponent,
        DiyTabsComponent,
        DiyLessongroupComponent,
        DiyMyComponent,
        DiyVideoComponent,
        DiyCouponsComponent,
        DiyStoreComponent,
        DiyArticleComponent,
        DiySpellgroupComponent,
        DiySeckillComponent,
        DiyIntroComponent,
        DiyPersonalComponent,
        MyfunctionComponent,
        DiyAccountComponent,
        DiyRichtextComponent,
      
    ],
    // exports: [EditImageComponent],
    imports: [
        CommonPageModule,
        NzModalModule,
        NzTabsModule,
        NzTableModule,
        NzRadioModule,
        NzButtonModule,
        NzIconModule,
        NzCardModule,
        NzGridModule,
        NzSelectModule,
        NzTagModule,
        CommonModule,
        RouterModule.forChild(routes),
        NzSliderModule,
        NzCarouselModule,
        FormsModule,
        A11yModule,
        CdkStepperModule,
        CdkTableModule,
        CdkTreeModule, NzDrawerModule,
        DragDropModule,
        PortalModule,
        ScrollingModule,
        NzCollapseModule,
        NzInputModule,
        NzFormModule,
        NzSwitchModule,
        PipesModule,
        NzInputNumberModule,
        NzStatisticModule,
        EditorModule
    ]
})
export class DiypageModule { }
