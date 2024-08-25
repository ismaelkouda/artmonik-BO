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
import { ExcelService } from "@/shared/services/excel.service";
import { LogoComponent } from "./ui/logo/logo.component";
import { FormLogoComponent } from "./features/form-logo/form-logo.component";
import { LogoService } from "./data-access/logo.service";
import { LogoRoutingModule } from "./logo.routing.module";

@NgModule({
    declarations: [
        LogoComponent,
        FormLogoComponent
    ],
    providers: [ExcelService, LogoService],
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
        LogoRoutingModule
    ]
})

export class LogoModule { }