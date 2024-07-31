import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { NgxPaginationModule } from "ngx-pagination";
import { ExcelService } from "src/app/shared/services/excel.service";
import { SettingsRoutingModule } from "./settings-routing.module";
import { NgxLoadingModule } from "ngx-loading";
import { UsersComponent } from "@/pages/administration/settings/ui/users/users.component";
import { UsersFormComponent } from "@/pages/administration/settings/ui/users/feature/users-form/users-form.component";
import { MatDialogModule } from "@angular/material/dialog";
import { FaqFormComponent } from "@/pages/administration/settings/ui/faq/feature/faq-form/faq-form.component";
import { FaqComponent } from "@/pages/administration/settings/ui/faq/faq.component";

@NgModule({
  imports: [
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    SettingsRoutingModule,
    NgxPaginationModule,
    NgxLoadingModule,
    
  ],
  declarations: [UsersComponent, UsersFormComponent, FaqComponent, FaqFormComponent ],
  providers: [ExcelService],
})
// @ts-ignore
export class SettingsModule {}
