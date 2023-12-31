import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LOCALE_ID } from '@angular/core'; 
import { LocalizationService } from '@progress/kendo-angular-l10n'; 
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
import { InputPassComponent } from './directive/input-pass/input-pass.component';
import { JsonPipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { ReportVehicleSpeedViolationComponent } from './report-vehicle-speed-violation/report-vehicle-speed-violation.component';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { VehiclePlatePipe } from './pipe/vehicle-plate.pipe/vehicle-plate.pipe';
import { NumberReportPipe } from './pipe/number-report.pipe/number-report.pipe';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { IntlModule } from '@progress/kendo-angular-intl';
import { registerLocaleData } from '@angular/common'; 
import localeVi from '@angular/common/locales/vi'; 
import { MultiSelectModule } from '@progress/kendo-angular-dropdowns'; 
import "@progress/kendo-angular-intl/locales/vi/all";

registerLocaleData(localeVi, 'vi-VN');

export function HttpLoaderFactory(http: HttpClient) {

  return new TranslateHttpLoader(http, './assets/i18n/');
}
@NgModule({
  declarations: [
    AppComponent,
    Test1Component,
    NavMenuComponent,
    ModalComfirmComponent,
    ForgetPassUserComponent,
    PhoneFormatPipe,
    NumberReportPipe,
    VehiclePlatePipe,
    SimpleComponent,
    InputPassComponent,
    Exercise1Component,
    Exercise2Component,
    HomeComponent,
    EditUserComponent,
    ListUserComponent,
    ReportVehicleSpeedViolationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    JsonPipe,
    IntlModule,
    MultiSelectModule,
    ReactiveFormsModule,
    AppRoutingModule,
    DateInputsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    TypeaheadModule.forRoot(),
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
    }),
  ],
  providers: [
    SharedService,
    { provide: LOCALE_ID, useValue: 'vi-VN' }, // Set your desired locale here
    LocalizationService // Provide LocalizationService

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
  ) {

  }
}


