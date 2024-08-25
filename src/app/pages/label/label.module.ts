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
import { LabelRoutingModule } from "./label.routing.module";
import { AproposComponent } from "./ui/apropos/apropos.component";
import { ExcelService } from "@/shared/services/excel.service";
import { FormAproposComponent } from "./features/apropos/form-apropos/form-apropos.component";
import { LabelService } from "./data-access/label.service";
import { AproposService } from "./data-access/apropos/apropos-state.service";
import { ChampsActionComponent } from "./ui/champs-action/champs-action.component";
import { FormChampsActionComponent } from "./features/champs-action/form-champs-action/form-champs-action.component";

@NgModule({
    declarations: [
        AproposComponent, FormAproposComponent,
        ChampsActionComponent, FormChampsActionComponent
    ],
    providers: [ExcelService, LabelService, AproposService],
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
        LabelRoutingModule
    ]
})

export class LabelModule { }