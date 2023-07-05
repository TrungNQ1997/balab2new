import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { Test1Component } from './test1/test1.component';

import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { ModalComfirmComponent } from './common/modal-comfirm/modal-comfirm.component';
import { ForgetPassUserComponent } from './user/forget-pass/forget-pass-user.component';
import { SharedService } from './service/shared.service';
import { PhoneFormatPipe } from './pipe/phone-format.pipe/phone-format.pipe';
import { SimpleComponent } from './simple/simple.component';
import { Exercise1Component } from './exercise1/exercise1.component';
import { Exercise2Component } from './exercise2/exercise2.component'
 import { HomeComponent } from './home/home.component';
 import { ListUserComponent } from './user/list/list-user.component';
 import { EditUserComponent } from './user/edit/edit-user.component';

import { BsDatepickerConfig, BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { viLocale } from 'ngx-bootstrap/locale';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
defineLocale('vi', viLocale);
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    AppComponent,
    Test1Component,
    NavMenuComponent,
    ModalComfirmComponent,
    ForgetPassUserComponent,
    PhoneFormatPipe,
    SimpleComponent,
      Exercise1Component,
      Exercise2Component,
      HomeComponent,
      EditUserComponent,
      ListUserComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'vi',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right'
    }) ,
    BsDatepickerModule.forRoot()
  ],
  providers: [
    SharedService,
    { provide: BsDatepickerConfig, useFactory: getDatepickerConfig },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private bsLocaleService: BsLocaleService
   ) {
    this.bsLocaleService.use('vi');
}
 }
export function getDatepickerConfig(): BsDatepickerConfig {
  return Object.assign(new BsDatepickerConfig(), {
    containerClass: 'theme-dark-blue',
    dateInputFormat: 'DD/MM/YYYY'
  });
}
