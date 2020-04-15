import { NgModule,APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppLoadService,init_app} from 'src/service/app-load.service'
@NgModule({
  providers: [
  AppLoadService,
  { provide: APP_INITIALIZER, useFactory: init_app, deps: [AppLoadService], multi: true }]
  ,
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
