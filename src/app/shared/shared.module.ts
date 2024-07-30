import { NgModule } from "@angular/core";

import { MaterialModule } from "./material/material.module";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgScrollbarModule } from "ngx-scrollbar";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { NgxGaugeModule } from "ngx-gauge";
import { NgxMatTimepickerModule } from "ngx-mat-timepicker";
import { NgxDropzoneModule } from "ngx-dropzone";
import { ColorPickerModule } from "ngx-color-picker";
import { CarouselModule } from "ngx-owl-carousel-o";
import { FullCalendarModule } from "@fullcalendar/angular";
import { CommonModule, DecimalPipe } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgxPaginationModule } from "ngx-pagination";

// Primeng Modules
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { SplitButtonModule } from "primeng/splitbutton";
import { CalendarModule } from "primeng/calendar";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { PaginatorModule } from "primeng/paginator";
import { TabViewModule } from "primeng/tabview";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CheckboxModule } from "primeng/checkbox";
import { InputTextareaModule } from "primeng/inputtextarea";
import { ContentComponent } from "./component/layout/content/content.component";
import { FullComponent } from "./component/layout/full/full.component";
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';




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
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgScrollbarModule,
    FormsModule,
    FullCalendarModule,
    ReactiveFormsModule,
    DialogModule,
    CarouselModule,
    DragDropModule,
    HttpClientModule,
    CdkAccordionModule,
    NgxGaugeModule,
    NgxMatTimepickerModule,
    NgxPaginationModule,
    NgxDropzoneModule,
    ColorPickerModule,
    TableModule,
    FieldsetModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    RadioButtonModule,
    SplitButtonModule,
    CalendarModule,
    OverlayPanelModule,
    PaginatorModule,
    TabViewModule,
    RouterModule,
    NgbModule,
    CardModule,
    CheckboxModule,
    InputTextareaModule,
    NgxSkeletonLoaderModule,
    NgxLoadingModule.forRoot({}),
    TranslateModule,
  ],
  providers: [DecimalPipe, DateFormatService],
  exports: [
    NgbModule,
    MaterialModule,
    BreadcrumbComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    PagginationComponent,
    DisableKeyPressDirective,
    DisablePastDatesDirective,
    CardModule,
    FieldsetModule,
    TabViewModule,
    RadioButtonModule,
    DialogModule,
    HistoryComponent
  ],
})
export class SharedModule {}
