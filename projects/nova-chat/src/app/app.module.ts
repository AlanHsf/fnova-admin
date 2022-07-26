import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// 
import { ApplicationRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// 
// import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appReducer } from './reducers';
import { loginReducer } from './pages/login/reducers';
import { LoginEffect } from './pages/login/effects';
import { registerReducer } from './pages/register/reducers';
import { RegisterEffect } from './pages/register/effects';
import { mainReducer } from './pages/main/reducers';
import { MainEffect } from './pages/main/effects';
import { chatReducer } from './pages/chat/reducers';
import { ChatEffect } from './pages/chat/effects';
import { contactReducer } from './pages/contact/reducers';
import { ContactEffect } from './pages/contact/effects';
import { roomReducer } from './pages/room/reducers';
import { RoomEffect } from './pages/room/effects';
import { MainCanActivate } from './services/common';
import { TipModalModule } from './components/tip-modal';
import { HMR } from '../config/hmr';
import { StorageService, PreloadService, ApiService, SignatureService } from './services/common';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,

    StoreModule.forRoot({
          appReducer,
          loginReducer,
          registerReducer,
          mainReducer,
          chatReducer,
          contactReducer,
          roomReducer
      }, {
          initialState: {
      },
    }),

    EffectsModule.forRoot([LoginEffect,
      RegisterEffect,
      MainEffect,
      ChatEffect,
      ContactEffect,
      RoomEffect
    ]),


    TipModalModule
    // 是否启用ngrx调试工具
    // StoreDevtoolsModule.instrumentOnlyWithExtension(),
  ],
  providers: [
    MainCanActivate,
    StorageService,
    PreloadService,
    ApiService,
    SignatureService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
