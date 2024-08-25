import { NgModule } from "@angular/core";

import { MaterialModule } from "./material/material.module";
import { NgScrollbarModule } from "ngx-scrollbar";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { NgxGaugeModule } from "ngx-gauge";
import { NgxMatTimepickerModule } from "ngx-mat-timepicker";
import { NgxDropzoneModule } from "ngx-dropzone";
import { ColorPickerModule } from "ngx-color-picker";
import { CarouselModule } from "ngx-owl-carousel-o";
import { FullCalendarModule } from "@fullcalendar/angular";
import { NgxPaginationModule } from "ngx-pagination";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

// Directives
import { DisableKeyPressDirective } from "./directives/disable-key-press.directive";
import { NgxLoadingModule } from "ngx-loading";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { BreadcrumbComponent } from "./component/breadcrumb/breadcrumb.component";
import { DisablePastDatesDirective } from "./directives/disable-past-dates.directives";
import { TranslateModule } from "@ngx-translate/core";
import { SidebarComponent } from "@/components/common/sidebar/sidebar.component";
import { HeaderComponent } from "@/components/common/header/ui/header.component";
import { FooterComponent } from "@/components/common/footer/ui/footer.component";
import { InternalErrorComponent } from "@/components/common/internal-error/ui/internal-error.component";
import { NotFoundComponent } from "@/components/common/not-found/ui/not-found.component";
import { NotNetworkComponent } from "@/components/common/not-network/ui/not-network.component";
import { DateFormatService } from "@/shared/utils/date-format.service";
import { PagginationComponent } from './component/paggination/paggination.component';
import { HistoryComponent } from './component/history/history.component';
import { ContentComponent } from "./component/layout/content/content.component";
import { FullComponent } from "./component/layout/full/full.component";


import { AngularModule } from "./angular.module";
import { PrimengModule } from "./primeng.module";
import { UiTitleComponent } from "./component/ui-title/ui-title.component";

@NgModule({
  declarations: [
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    ContentComponent,
    FullComponent,
    DisableKeyPressDirective,
    InternalErrorComponent,
    NotFoundComponent,
    NotNetworkComponent,
    BreadcrumbComponent,
    DisablePastDatesDirective,
    PagginationComponent,
    HistoryComponent,
    UiTitleComponent
  ],
  imports: [
    AngularModule,
    PrimengModule,
    MaterialModule,
    NgScrollbarModule,
    FullCalendarModule,
    CarouselModule,
    DragDropModule,
    CdkAccordionModule,
    NgxGaugeModule,
    NgxMatTimepickerModule,
    NgxPaginationModule,
    NgxDropzoneModule,
    ColorPickerModule,
    NgbModule,
    NgxSkeletonLoaderModule,
    NgxLoadingModule.forRoot({}),
    TranslateModule,
  ],
  providers: [DateFormatService],
  exports: [
    AngularModule,
    PrimengModule,
    NgbModule,
    MaterialModule,
    BreadcrumbComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    PagginationComponent,
    DisableKeyPressDirective,
    DisablePastDatesDirective,
    HistoryComponent,
    NgxSkeletonLoaderModule,
    TranslateModule,
    UiTitleComponent,
    
  ],
})
export class SharedModule {}
