import { ExcelService } from "@/shared/services/excel.service";
import { NotyfService } from "@/shared/services/notyf.service";
import { DateFormatService } from "@/shared/utils/date-format.service";
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Table } from "primeng/table";
import { Subscription } from "rxjs";
import { CampaignModel } from "@/core/entities/campaign/campaignModel";

import Swal, { SweetAlertOptions } from "sweetalert2";
import { handleGetAllDepositMode } from "../../data-access/functions/deposit-mode.functions";
import { DepositService } from "../../data-access/services/deposit-mode.service";

interface DialogData {
  type: string;
  property: any;
}
@Component({
  selector: "app-list-deposit",
  templateUrl: "./list-deposit.component.html",
  styleUrls: ["./list-deposit.component.scss"],
})
export class ListDepositComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("dt") dt: Table;
  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    this.dt.filterGlobal(value, "contains");
  }

  public breadcrumbObject: any = {
    first: "DEPOSIT.BREADCRUMB.FIRST",
    second: "DEPOSIT.BREADCRUMB.SECOND",
  };
  public response: any;
  public columns = [
    {
      field: "reference",
      header: "DEPOSIT.COLUMNS.0.header",
      isText: true,
      isCenter:true,
    },
    {
      field: "phone",
      header: "DEPOSIT.COLUMNS.1.header",
      isText: true,
      isCenter:true,
    },
    {
      field: "user.name",
      header: "DEPOSIT.COLUMNS.2.header",
      isText: true,
      isCenter:true,
    },
    {
      field: "paiement.title",
      header: "DEPOSIT.COLUMNS.3.header",
      isText: true,
      isCenter:true,
    },
    {
      field: "amount",
      header: "DEPOSIT.COLUMNS.4.header",
      isText: true,
      isCenter: true,
    },
    {
      field: "created_at",
      header: "DEPOSIT.COLUMNS.5.header",
      isText: true,
      isCenter:true,
    },
  
  ];
  public globalFilterFieldsObject: string[] = [
    "reference",
    "phone",
    "user.name",
    "amount",
    "paiement.title",
    "date/heure",
  ];
  public listDeposit: any = [];

  public totalRecords: number;
  public rows: number;
  public currentPage: number = 1;
  public totalPages: number;
  public pageSize: number ;

  private subscriptions: Subscription = new Subscription();
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private titleService: Title,
    private depositService: DepositService,
    private translate: TranslateService,
    private excelService: ExcelService,
    private dateFormatService: DateFormatService,
    private notyfService: NotyfService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.subscribeToRouteData();
    this.subscribeToPaymentModeStorage();
  }

  async ngAfterViewInit() {
    await this.loadAllDeposit();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private subscribeToRouteData(): void {
    this.subscriptions.add(
      this.route.data.subscribe((data) => {
        const title = data["title"] || "Default Title";
        this.titleService.setTitle(title);
      }),
    );
  }

  onChange(event: number): void {
    if(event === 0) {
      this.router.navigate(['deposit/list', {onglet: 'liste'}]);
    } else if(event === 1) {
      this.router.navigate(['deposit/list', {onglet: 'historique'}]);
    }
  }

  private async subscribeToPaymentModeStorage() {
    this.subscriptions.add();
  }

  public async loadAllDeposit(nb : number=1): Promise<void> {
    this.response = await handleGetAllDepositMode(
      () => this.depositService.getAllDeposit(nb),
      this.notyfService,
    );

    this.totalRecords = this.response?.data?.total,
    this.currentPage = this.response?.data?.current_page,
    this.totalPages = this.response?.data?.total_pages,
    this.rows = this.response?.data?.per_page,

    this.listDeposit = this.response?.data?.data.map((depositMode) =>
      this.mapDepositModeDates(depositMode),
    );
  }

  public onPageChange(event: any): void {    
    this.loadAllDeposit(event.page +1)
   }

  private mapDepositModeDates(depositMode: any): CampaignModel {
    return {
      ...depositMode,
      created_at: this.dateFormatService.formatIsoDate(depositMode.created_at),
      date_fin: this.dateFormatService.formatIsoDate(depositMode.date_fin),
    };
  }

  public exportExcel(): void {
    if (this.isListEmpty()) {
      this.showNoDataToast();
      return;
    }
    try {
      const data = this.mapCampaignModeData();
      this.excelService.exportAsExcelFile(
        data,
        this.translate.instant("Deposit mode list"),
      );
    } catch (error) {
      console.error("Failed to export data", error);
    }
  }

  private isListEmpty(): boolean {
    return this.listDeposit?.length === 0;
  }

  private showNoDataToast(): void {
    this.notyfService.showToast(
      "error",
      this.translate.instant("noDataInTable"),
      "toast-error",
    );
  }


  private mapCampaignModeData(): any[] {
    return this.listDeposit.map((element: any) => ({
      [this.translate.instant("DEPOSIT.COLUMNS.0.header")]: element?.titre,
      [this.translate.instant("DEPOSIT.COLUMNS.1.header")]: element?.user,
      [this.translate.instant("DEPOSIT.COLUMNS.3.header")]:
        element?.goalAmount,
      [this.translate.instant("DEPOSIT.COLUMNS.4.header")]:
        element?.currentAmount,
      [this.translate.instant("DEPOSIT.COLUMNS.5.header")]:
        element?.statut,
      [this.translate.instant("DEPOSIT.COLUMNS.6.header")]:
        element?.deadline,
    }));
  }

  public getCellValue(field: string, depositMode: any): string {
    if (!field) return "";
    const fieldParts = field.split(".");
    let value = depositMode;
    for (const part of fieldParts) {
      value = value ? value[part] : "";
    }
    return value;
  }
}
