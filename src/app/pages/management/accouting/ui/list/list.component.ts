import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ExcelService } from "@/shared/services/excel.service";
import { DateFormatService } from "@/shared/utils/date-format.service";
import { NotyfService } from "@/shared/services/notyf.service";
import { Subscription } from "rxjs";
import { Table } from "primeng/table";
import { AccountingModel } from "@/core/entities/accounting/accountingModel";
import { AccountingService } from "@/pages/management/accouting/data-access/services/accounting-mode.service";
import { handleGetAllRechargeMode } from "@/pages/management/accouting/data-access/functions/accounting-mode.functions";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("dt") dt: Table;
  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    this.dt.filterGlobal(value, "contains");
  }
  public breadcrumbObject: any = {
    first: "ACCOUNTING.BREADCRUMB.FIRST",
    second: "ACCOUNTING.BREADCRUMB.SECOND",
  };
  public response: any;
  public columns = [
    {
      field: "reference",
      header: "ACCOUNTING.COLUMNS.0.header",
      isText: true,
      isCenter:true,
    },
    {
      field: "amount",
      header: "ACCOUNTING.COLUMNS.1.header",
      isText: true,
      isCenter:true,
    },
    {
      field: "paymentMethod",
      header: "ACCOUNTING.COLUMNS.2.header",
      isText: true,
      isCenter:true,
    },
    {
      field: "user",
      header: "ACCOUNTING.COLUMNS.3.header",
      isText: true,
      isCenter:true,
    },
    {
      field: "phone",
      header: "ACCOUNTING.COLUMNS.4.header",
      isText: true,
      isCenter:true,
    },
    {
      field: "status",
      header: "ACCOUNTING.COLUMNS.5.header",
      isBadge: true,
      isCenter: true,
    },
    {
      field: "created_at",
      header: "ACCOUNTING.COLUMNS.6.header",
      isText: true,
      isCenter:true,    },
  ];
  public globalFilterFieldsObject: string[] = [
    "reference",
    "amount",
    "paymentMethod",
    "user",
    "status",
    "phone",
    "created_at",
  ];
  public listRecharge: any = [];

  public totalRecords: number;
  public rows: number;
  public currentPage: number = 1;
  public totalPages: number;
  public pageSize: number ;

  private subscriptions: Subscription = new Subscription();
  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private AccountService: AccountingService,
    private translate: TranslateService,
    private excelService: ExcelService,
    private dateFormatService: DateFormatService,
    private notyfService: NotyfService,
  ) {}

  async ngOnInit() {
    this.subscribeToRouteData();
    this.subscribeToPaymentModeStorage();
  }

  async ngAfterViewInit() {
    await this.loadAllRecharge();
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

  private async subscribeToPaymentModeStorage() {
    this.subscriptions.add();
  }

  public async loadAllRecharge(nb : number =1): Promise<void> {
    this.response = await handleGetAllRechargeMode(
      () => this.AccountService.getAllAccounting(),
      this.notyfService,
    );

    this.totalRecords = this.response?.recharges?.original?.pagination?.total,
    this.currentPage = this.response?.recharges?.original?.pagination?.current_page,
    this.totalPages = this.response?.recharges?.original?.pagination?.total_pages,
    this.rows = this.response?.recharges?.original?.pagination?.per_page,

    this.listRecharge = this.response?.recharges?.original?.data.map((RechargeMode) =>
      this.mapAccountingModeDates(RechargeMode),
    );
  }

  public onPageChange(event: any): void {    
    this.loadAllRecharge(event.page +1)
   }

  private mapAccountingModeDates(accountingMode: any): AccountingModel {
    return {
      ...accountingMode,
      created_at: this.dateFormatService.formatIsoDate(accountingMode.created_at),
      updated_at: this.dateFormatService.formatIsoDate(accountingMode.updated_at),
    };
  }


  translateStatus(status: string): string {
    const statusTranslations: { [key: string]: string } = {
      'pending': 'en cours',
      'failed': 'échoué',
      'succeeded': 'réussi'
    };

    return statusTranslations[status] || status;
  }

  public exportExcel(): void {
    if (this.isListEmpty()) {
      this.showNoDataToast();
      return;
    }
    try {
      const data = this.mapAccountingModeData();
      this.excelService.exportAsExcelFile(
        data,
        this.translate.instant("RechargeMode list"),
      );
    } catch (error) {
      console.error("Failed to export data", error);
    }
  }

  private isListEmpty(): boolean {
    return this.loadAllRecharge?.length === 0;
  }

  private showNoDataToast(): void {
    this.notyfService.showToast(
      "error",
      this.translate.instant("noDataInTable"),
      "toast-error",
    );
  }

  private mapAccountingModeData(): any[] {
    return this.listRecharge.map((element: any) => ({
      [this.translate.instant("ACCOUNTING.COLUMNS.0.header")]:
        element?.reference,
        [this.translate.instant("ACCOUNTING.COLUMNS.1.header")]:
        element?.amount,
      [this.translate.instant("ACCOUNTING.COLUMNS.2.header")]:
        element?.paymentMethod,
      [this.translate.instant("ACCOUNTING.COLUMNS.3.header")]: element?.user,
      [this.translate.instant("ACCOUNTING.COLUMNS.4.header")]: element?.status,
      [this.translate.instant("ACCOUNTING.COLUMNS.5.header")]:
        element?.phone,
      [this.translate.instant("ACCOUNTING.COLUMNS.6.header")]:
        element?.created_at,
    }));
  }

  public getCellValue(field: string, paymentMode: any): string {
    if (!field) return "";
    const fieldParts = field.split(".");
    let value = paymentMode;
    for (const part of fieldParts) {
      value = value ? value[part] : "";
    }
    return value;
  }
}
