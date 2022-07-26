import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
  // https://www.cnblogs.com/shcrk/p/9241102.html
/*
  JIT(Just in Time)：
*/
// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import { AppModule } from './app.module';

// platformBrowserDynamic().bootstrapModule(AppModule);
/*
 (Ahead of Time):
*/
// import { platformBrowser } from '@angular/platform-browser';
// import { AppModuleNgFactory } from './app.module.ngfactory';

// platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
