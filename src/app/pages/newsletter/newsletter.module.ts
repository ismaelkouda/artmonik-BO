import { SharedModule } from "@/shared/shared.module";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { NgxLoadingModule } from "ngx-loading";
import { NgxPaginationModule } from "ngx-pagination";
import { ExcelService } from "@/shared/services/excel.service";
import { NewsletterComponent } from "./ui/newsletter.component";
import { FormNewsletterComponent } from "./features/form-newsletter/form-newsletter.component";
import { NewsletterService } from "./data-access/newsletter.service";
import { NewsletterRoutingModule } from "./newsletter.routing.module";

@NgModule({
    declarations: [
        NewsletterComponent,
        FormNewsletterComponent
    ],
    providers: [ExcelService, NewsletterService],
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
        NewsletterRoutingModule
    ]
})

export class NewsletterModule { }