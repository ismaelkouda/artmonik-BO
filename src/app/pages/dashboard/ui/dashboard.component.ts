import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { handleGetAllInfoDashboard } from "../data-access/functions/dashboard.functions";
import { DashboardService } from "../data-access/services/dashboard.service";
import { NotyfService } from "@/shared/services/notyf.service";
import { DateFormatService } from "@/shared/utils/date-format.service";
import { AccountingModel } from "@/core/entities/accounting/accountingModel";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  public listInfoDashb: any;
  public response: any = {} ;

  private subscriptions: Subscription = new Subscription();
  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private notyfService: NotyfService,
    private dashboardService: DashboardService,
    private dateFormatService: DateFormatService,
  ) {
    this.subscribeToRouteData();
  }


  ngOnInit(): void {
  }

  async ngAfterViewInit() {
    // await this.loadDataDashboard();
  }

  public async loadDataDashboard(): Promise<void> {
    this.response = await handleGetAllInfoDashboard(
      () => this.dashboardService.getAllInfoDashboard(),
      this.notyfService,
    ); 
    this.listInfoDashb = this.response?.data;
    // console.log(this.listInfoDashb);
   
   /* this.listInfoDashb = this.response?.map((dashboardData) =>
      this.mapAccountingModeDates(dashboardData),
    );*/
  }

  private mapAccountingModeDates(accountingMode: any): AccountingModel {
    return {
      ...accountingMode,
      created_at: this.dateFormatService.formatIsoDate(accountingMode.created_at),
      updated_at: this.dateFormatService.formatIsoDate(accountingMode.updated_at),
    };
  }
  

  private subscribeToRouteData(): void {
    this.subscriptions.add(
      this.route.data.subscribe((data) => {
        const title = data["title"] || "Default Title";
        this.titleService.setTitle(title);
      }),
    );
  }
}
