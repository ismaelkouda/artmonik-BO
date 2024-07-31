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
import { MembersComponent } from "./members.component";
import { MembersService } from "./data-access/members.service";
import { MembersRoutingModule } from "./members.routing.module";
import { MembersFormComponent } from "./features/members-form.component";

@NgModule({
    declarations: [
        MembersComponent,
        MembersFormComponent
    ],
    providers: [ExcelService, MembersService],
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
        MembersRoutingModule
    ]
})

export class MembersModule { }