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
import { UsersComponent } from "./users.component";
import { UsersFormComponent } from "./features/users-form/users-form.component";
import { UsersService } from "./data-access/users.service";
import { UsersRoutingModule } from "./users.routing.module";

@NgModule({
    declarations: [
        UsersComponent,
        UsersFormComponent
    ],
    providers: [ExcelService, UsersService],
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
        UsersRoutingModule
    ]
})

export class UsersModule { }