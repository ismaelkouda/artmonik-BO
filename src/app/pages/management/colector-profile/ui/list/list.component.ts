import { ExcelService } from '@/shared/services/excel.service';
import { NotyfService } from '@/shared/services/notyf.service';
import { DateFormatService } from '@/shared/utils/date-format.service';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { handleGetAllCollectorRequestMode } from '../../data-access/functions/colector-profile-mode.functions';
import { CollectorRequestService } from '../../data-access/services/colector-profile-mode.service';
import { DetailAskComponent } from '../detail-ask/detail-ask.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild("dt") dt: Table;
  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    this.dt.filterGlobal(value, "contains");
  }

  public breadcrumbObject: any = {
    first: "COLECTOR-PROFILE.BREADCRUMB.FIRST",
    second: "COLECTOR-PROFILE.BREADCRUMB.SECOND",
  };
  public response: any;
  public columns = [
    {
      field: "user.name",
      header: "COLECTOR-PROFILE.COLUMNS.0.header",
      isText: true,
      isCenter:true,
    },
    {
      field: "user.email",
      header: "COLECTOR-PROFILE.COLUMNS.1.header",
      isText: true,
      isCenter:true,
    },
    {
      field: "status",
      header: "COLECTOR-PROFILE.COLUMNS.2.header",
      isCenter: true,
      isBadge: true,
    },
    {
      field: "user.role",
      header: "COLECTOR-PROFILE.COLUMNS.3.header",
      isText: true,
      isCenter:true,
    },
    {
      field: "user.balance",
      header: "COLECTOR-PROFILE.COLUMNS.4.header",
      isText: true,
      isCenter:true,
    },
    {
      field: "user.created_at",
      header: "COLECTOR-PROFILE.COLUMNS.5.header",
      isText: true,
      isCenter: true,
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
  public listCollectorRequest: any = [];

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
    private CollectorService : CollectorRequestService,
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
    await this.loadAllCollectorRequest();
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
      this.router.navigate(['request-colector/list', {onglet: 'liste'}]);
    } else if(event === 1) {
      this.router.navigate(['request-colector/list', {onglet: 'historique'}]);
    }
  }

  private async subscribeToPaymentModeStorage() {
    this.subscriptions.add();
  }

  public async loadAllCollectorRequest(nb : number=1): Promise<void> {
    this.response = await handleGetAllCollectorRequestMode(
      () => this.CollectorService.getAllCollector(nb),
      this.notyfService,
    );

    this.totalRecords = this.response?.data?.total,
    this.currentPage = this.response?.data?.current_page,
    this.totalPages = this.response?.data?.total_pages,
    this.rows = this.response?.data?.per_page,

    this.listCollectorRequest = this.response?.data?.data.map((collectorMode) =>
      this.mapDepositModeDates(collectorMode),
    );
  }

  openDialog(data: any): void {
    this.dialog.open(DetailAskComponent, {
      width: '100vw',
      height: '100vh',
      data: data,
      disableClose: true
    });
  }

  public onPageChange(event: any): void {    
    this.loadAllCollectorRequest(event.page +1)
   }


   translateStatus(status: string): string {
    const statusTranslations: { [key: string]: string } = {
      'pending': 'Encours',
      'approved': 'Approuvé',
      'rejected': 'Rejeté'
    };

    return statusTranslations[status] || status;
  }
  private mapDepositModeDates(collectorMode: any): any {
    return {
      ...collectorMode,
      user: {
        ...collectorMode.user,
        created_at: this.dateFormatService.formatIsoDate(collectorMode.user.created_at),
      },
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
        this.translate.instant("collector  mode list"),
      );
    } catch (error) {
      console.error("Failed to export data", error);
    }
  }

  private isListEmpty(): boolean {
    return this.listCollectorRequest?.length === 0;
  }

  private showNoDataToast(): void {
    this.notyfService.showToast(
      "error",
      this.translate.instant("noDataInTable"),
      "toast-error",
    );
  }


  private mapCampaignModeData(): any[] {
    return this.listCollectorRequest.map((element: any) => ({
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
