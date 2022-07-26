import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCardModule } from 'ng-zorro-antd/card';
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
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angular2-qrcode';
import { AuthGuard } from "./metapunk-games/user/auth.guard";

import { HomeComponent } from './metapunk-games/home/home.component'
import { RecommendComponent } from './metapunk-games/recommend/recommend.component'
import { GamesComponent } from './metapunk-games/games/games.component'
import { GameStoreComponent } from './metapunk-games/game-store/game-store.component'
import { GameDetailComponent } from './metapunk-games/game-detail/game-detail.component'
import { SetingComponent } from './metapunk-games/seting/seting.component'
import { HyperspaceComponent } from './metapunk-games/hyperspace/hyperspace.component'
import { LoginComponent } from './metapunk-games/login/login.component'
import { PlayerComponent } from './metapunk-games/player/player.component';
import { DeviceTestComponent } from './metapunk-games/device-test/device-test.component'
import { GameArenaComponent } from './metapunk-games/game-arena/game-arena.component';


import { GameService } from './metapunk-games/game.service';

export const routes: Routes = [
  { path: "login", component: LoginComponent, pathMatch: "full" },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  },
  { path: 'home', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'device-test', component: DeviceTestComponent, pathMatch: 'full' },
]

@NgModule({
  declarations: [
    LoginComponent,
    HomeComponent,
    RecommendComponent,
    GamesComponent,
    GameStoreComponent,
    GameDetailComponent,
    SetingComponent,
    PlayerComponent,
    HyperspaceComponent,
    DeviceTestComponent,
    GameArenaComponent
  ],
  imports: [
    CommonModule, FormsModule,
    RouterModule.forChild(routes),
    NzLayoutModule,
    NzButtonModule,
    NzIconModule,
    NzTabsModule,
    NzBadgeModule,
    NzPageHeaderModule, NzToolTipModule, NzStepsModule,
    NzRadioModule,
    NzPopoverModule, NzCardModule, NzTagModule, NzSkeletonModule,
    NzAlertModule, NzResultModule,
    NzSwitchModule, NzAvatarModule, NzFormModule,
    NzDrawerModule, NzGridModule, NzInputModule,
    NzSelectModule, NzTableModule, NzDividerModule,
    NzListModule, NzCheckboxModule, NzPipesModule,
    NzDropDownModule, NzProgressModule,
    NzCarouselModule, NzPaginationModule,
    NzSpinModule,
    QRCodeModule,
  ],
  providers: [GameService]

})
export class MetapunkGamesModule { }
