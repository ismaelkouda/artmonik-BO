import {
  APP_INITIALIZER,
  ErrorHandler,
  NgModule,
  LOCALE_ID,
} from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { DatePipe, registerLocaleData } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
import { BrowserModule } from "@angular/platform-browser";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";
import { NotyfService } from "./shared/services/notyf.service";
import localeFr from "@angular/common/locales/fr";
import { EncodingDataService } from "./shared/services/encoding-data.service";
import { NgxWebstorageModule } from "ngx-webstorage";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { Router } from "@angular/router";
import * as Sentry from "@sentry/angular-ivy";
import { HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http";
import { GlobalHttpInterceptorService } from "./shared/services/global-http-interceptor.service";
import { TableModule } from "primeng/table";
import { SharedModule } from "./shared/shared.module";
import { EnvServiceProvider } from "./shared/services/env.service.provider";
import { LoaderComponent } from "./shared/component/loader/loader.component";
import { ExcelService } from "./shared/services/excel.service";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { GlobalErrorHandlerService } from "@/shared/services/global-error-handler.service";
import { DashboardComponent } from "./pages/dashboard/ui/dashboard.component";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent, LoaderComponent, DashboardComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    NgxWebstorageModule.forRoot(),
    SharedModule,
    LoadingBarHttpClientModule,
    ScrollingModule,
    SweetAlert2Module.forRoot(),
    NgxsModule.forRoot([]),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    TableModule,
  ],
  providers: [
    EncodingDataService,
    ExcelService,
    EnvServiceProvider,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalHttpInterceptorService,
      multi: true,
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true,
    },
    { provide: LOCALE_ID, useValue: "fr-FR" },
    DatePipe,
    NotyfService,
  ],
  bootstrap: [AppComponent],
  exports: [DatePipe],
})
export class AppModule {
  constructor() {
    registerLocaleData(localeFr);
  }
}
