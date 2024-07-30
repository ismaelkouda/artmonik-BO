import { NgModule } from "@angular/core";
import { SharedModule } from "@/shared/shared.module";
import { DashboardComponent } from "./ui/dashboard.component";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { CommonModule } from "@angular/common";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    DashboardRoutingModule,
    NgxSkeletonLoaderModule,
    TranslateModule,
  ],
  declarations: [DashboardComponent],
  providers: [],
})
// @ts-ignore
export class DashboardModule {}
