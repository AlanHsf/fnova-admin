import { NgModule } from '@angular/core';
import { KvArray } from './common'
import { ToK } from './tok'
import { ShowImg } from './show-img';
import { ShowName } from './show-name';
import { PinYinPipe } from './pinyin-pipe';
import { SanitizeHtmlPipe } from './safe-html';
import { EngIndex } from './english-index';

@NgModule({
  declarations: [
    KvArray, PinYinPipe, SanitizeHtmlPipe, ShowImg, ShowName, EngIndex, ToK,
  ],
  imports: [
  ],
  exports: [
    KvArray, PinYinPipe, SanitizeHtmlPipe, ShowImg, ShowName, EngIndex, ToK,
  ]
})
export class PipesModule {
}