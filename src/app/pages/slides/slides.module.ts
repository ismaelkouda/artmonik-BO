import { SharedModule } from "@/shared/shared.module";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { NgxLoadingModule } from "ngx-loading";
import { NgxPaginationModule } from "ngx-pagination";
import { SlidesRoutingModule } from "./slides.routing.module";
import { SlidesComponent } from "./ui/slides/slides.component";
import { ExcelService } from "@/shared/services/excel.service";
import { FilterSlidesComponent } from "./feature/filter-slides/filter-slides.component";
import { FormSlidesComponent } from "./feature/form-slides/form-slides.component";
import { SlideService } from "./data-access/slide.service";

@NgModule({
    declarations: [
        SlidesComponent,
        FilterSlidesComponent,
        FormSlidesComponent
    ],
    providers: [ExcelService, SlideService],
    imports: [
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        SharedModule,
        MatTableModule,
        MatPaginatorModule,
        MatDialogModule,
        NgxPaginationModule,
        NgxLoadingModule,
        SlidesRoutingModule
    ]
})

export class SlidesModule { }