import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { TooltipModule } from "primeng/tooltip";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { ExcelService } from "src/app/shared/services/excel.service";
import { SettingsRoutingModule } from "./settings-routing.module";
import { NgxLoadingModule } from "ngx-loading";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { TranslateModule } from "@ngx-translate/core";
import { TableModule } from "primeng/table";
import { UsersComponent } from "@/pages/administration/settings/ui/users/users.component";
import { UsersFormComponent } from "@/pages/administration/settings/ui/users/feature/users-form/users-form.component";
import { MatDialogModule } from "@angular/material/dialog";
import { FaqFormComponent } from "@/pages/administration/settings/ui/faq/feature/faq-form/faq-form.component";
import { FaqComponent } from "@/pages/administration/settings/ui/faq/faq.component";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    TooltipModule,
    SettingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxLoadingModule,
    NgxSkeletonLoaderModule,
    TranslateModule,
    
  ],
  declarations: [UsersComponent, UsersFormComponent, FaqComponent, FaqFormComponent ],
  providers: [ExcelService],
})
// @ts-ignore
export class SettingsModule {}
