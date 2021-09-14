import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './_pages/index/index.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NotifierModule } from 'angular-notifier';
import { NgxEchartsModule } from 'ngx-echarts';
import { LoadingScreenComponent } from './_components/loading-screen/loading-screen.component';


@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    LoadingScreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NotifierModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
  providers: [], 
  bootstrap: [AppComponent] 
})
export class AppModule { }
