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
import { ServicesRoutingModule } from "./services.routing.module";
import { ServicesComponent } from "./ui/services/services.component";
import { ExcelService } from "@/shared/services/excel.service";
import { FilterServicesComponent } from "./feature/filter-services/filter-services.component";
import { ServiceService } from "./data-access/service.service";
import { FormServicesComponent } from "./feature/form-services/form-services.component";

@NgModule({
    declarations: [
        ServicesComponent,
        FilterServicesComponent,
        FormServicesComponent
    ],
    providers: [ExcelService, ServiceService],
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
        ServicesRoutingModule
    ]
})

export class ServicesModule { }