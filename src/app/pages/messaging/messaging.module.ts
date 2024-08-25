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
import { MessagingComponent } from "./ui/messaging/messaging.component";
import { FormMessagingComponent } from "./features/form-messaging/form-messaging.component";
import { MessagingService } from "./data-access/messaging.service";
import { MessagingRoutingModule } from "./messaging.routing.module";

@NgModule({
    declarations: [
        MessagingComponent,
        FormMessagingComponent
    ],
    providers: [ExcelService, MessagingService],
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
        MessagingRoutingModule
    ]
})

export class MessagingModule { }