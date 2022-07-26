import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';

import { BattlebotComponent } from './sps/battlebot/battlebot.component';
import { SPSDashboardMobileComponent } from './sps/dashboard-mobile/dashboard-mobile.component';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzResultModule } from 'ng-zorro-antd/result';

import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzPipesModule } from 'ng-zorro-antd/pipes';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzToolTipModule} from 'ng-zorro-antd/tooltip';
import { NzRadioModule } from 'ng-zorro-antd/radio';

import { FormsModule } from '@angular/forms';

import { SPSDashboardOverviewComponent } from './sps/dashboard-overview/dashboard-overview.component';
import { PlayerTableComponent } from './sps/player-table/player-table.component';

import { QRCodeModule } from 'angular2-qrcode';
import { TeamaiComponent } from './sps/teamai/teamai.component';

import { CardTableComponent } from './sps/card-table/card-table.component';
import { AbilityTableComponent } from './sps/ability-table/ability-table.component';
import { CardItemComponent } from './sps/card-item/card-item.component';

export const routes: Routes = [
  {
    path: 'sps/battlebot', component: BattlebotComponent,
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'sps/mboard', component: SPSDashboardMobileComponent,
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'sps/dashboard', component: SPSDashboardOverviewComponent,
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'sps/teamai', component: TeamaiComponent,
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'sps/cards', component: CardTableComponent,
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'sps/ability', component: AbilityTableComponent,
    runGuardsAndResolvers: 'always'
  }
]

@NgModule({
  declarations: [
    BattlebotComponent,
    SPSDashboardMobileComponent,
    SPSDashboardOverviewComponent,
    PlayerTableComponent,
    TeamaiComponent,
    CardTableComponent,
    AbilityTableComponent,
    CardItemComponent
  ],
  imports: [
    CommonModule,FormsModule,
    RouterModule.forChild(routes),
    NzLayoutModule,
    NzButtonModule,
    NzIconModule,
    NzTabsModule,
    NzBadgeModule,
    NzPageHeaderModule,NzToolTipModule,NzStepsModule,
    NzRadioModule,
    NzPopoverModule,NzCardModule,NzTagModule,NzSkeletonModule,
    NzModalModule,NzAlertModule,NzResultModule,
    NzSwitchModule,NzAvatarModule,NzFormModule,
    NzDrawerModule,NzGridModule,NzInputModule,
    NzSelectModule,NzTableModule,NzDividerModule,
    NzListModule,NzCheckboxModule,NzPipesModule,
    NzDropDownModule,NzProgressModule,
    QRCodeModule,
  ],
  exports:[PlayerTableComponent]
})
export class MetapunkSPSModule { }
