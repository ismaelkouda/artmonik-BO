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
import {
  handleGetAllCampaignMode,
  handleUpdateCampaignsStatusMode,
} from "@/pages/management/campaign/data-access/functions/campaign-mode.functions";
import { CampaignService } from "@/pages/management/campaign/data-access/services/campaign-mode.service";
import Swal, { SweetAlertOptions } from "sweetalert2";
import { StatusModalComponent } from "../feature/status-modal/status-modal.component";

interface DialogData {
  type: string;
  property: any;
}
@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("dt") dt: Table;
  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    this.dt.filterGlobal(value, "contains");
  }

  public breadcrumbObject: any = {
    first: "FORMCAMPAIGN.BREADCRUMB.FIRST",
    second: "FORMCAMPAIGN.BREADCRUMB.SECOND",
  };
  public response: any;
  public columns = [
    {
      field: "title",
      header: "FORMCAMPAIGN.COLUMNS.0.header",
      isText: true,
      isCenter:true,
    },
    {
      field: "user.name",
      header: "FORMCAMPAIGN.COLUMNS.1.header",
      isText: true,
      isCenter:true,
    },
    {
      field: "objectif",
      header: "FORMCAMPAIGN.COLUMNS.2.header",
      isText: true,
      isCenter:true,
    },
    {
      field: "collecte",
      header: "FORMCAMPAIGN.COLUMNS.3.header",
      isText: true,
      isCenter:true,
    },
    {
      field: "status",
      header: "FORMCAMPAIGN.COLUMNS.4.header",
      isBadge: true,
      isCenter: true,
    },
    {
      field: "date_fin",
      header: "FORMCAMPAIGN.COLUMNS.5.header",
      isText: true,
      isCenter:true,
    },
    {
      field: "created_at",
      header: "FORMCAMPAIGN.COLUMNS.6.header",
      isText: true,
      isCenter:true,
    },
  ];
  public globalFilterFieldsObject: string[] = [
    "title",
    "user",
    "objectif",
    "collecte",
    "status",
    "deadline",
  ];
  public listCampaign: any = [];

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
    private campService: CampaignService,
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
    await this.loadAllCampaign();
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
      this.router.navigate(['campaign/list', {onglet: 'liste'}]);
    } else if(event === 1) {
      this.router.navigate(['campaign/list', {onglet: 'historique'}]);
    }
  }

  private async subscribeToPaymentModeStorage() {
    this.subscriptions.add();
  }

  public async loadAllCampaign(nb : number=1): Promise<void> {
    this.response = await handleGetAllCampaignMode(
      () => this.campService.getAllCampaign(),
      this.notyfService,
    );

    this.totalRecords = this.response?.data?.total,
    this.currentPage = this.response?.data?.current_page,
    this.totalPages = this.response?.data?.total_pages,
    this.rows = this.response?.data?.per_page,

    this.listCampaign = this.response?.data?.data.map((campaignMode) =>
      this.mapCampaignsModeDates(campaignMode),
    );
  }

  public onPageChange(event: any): void {    
    this.loadAllCampaign(event.page +1)
   }

  private mapCampaignsModeDates(campaignMode: any): CampaignModel {
    return {
      ...campaignMode,
      created_at: this.dateFormatService.formatIsoDate(campaignMode.created_at),
      date_fin: this.dateFormatService.formatIsoDate(campaignMode.date_fin),
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
        this.translate.instant("CampaignMode list"),
      );
    } catch (error) {
      console.error("Failed to export data", error);
    }
  }

  private isListEmpty(): boolean {
    return this.listCampaign?.length === 0;
  }

  private showNoDataToast(): void {
    this.notyfService.showToast(
      "error",
      this.translate.instant("noDataInTable"),
      "toast-error",
    );
  }

  /*public async handleUpdateStatus(data): Promise<void> {
    const swalOptions = this.getSwalUpdateStatusOptions(`${data.title}`);
    const result = await Swal.fire(swalOptions);
    if (result.isConfirmed) {
    const updatedStatus = data.status === 'active' ? 'inactive' : 'active';
    const updatedData = { ...data, status: updatedStatus };
    await this.confirmUpdateStatusCampaignsMode(updatedData);
    }

  }

  public async confirmUpdateStatusCampaignsMode(data): Promise<void> {
    await handleUpdateCampaignsStatusMode(
      () => this.campService.updateCampaignsStatusMode(data),
      this.notyfService,
    );
    this.loadAllCampaign();
  }*/

  public getSwalUpdateStatusOptions(title: string): SweetAlertOptions {
    return {
      title: this.translate.instant(
        "FORMCAMPAIGN.UPDATE_CONFIRMATION_STATUS.title",
      ),
      html: this.translate.instant(
        "FORMCAMPAIGN.UPDATE_CONFIRMATION_STATUS.message",
        {
          title: title,
        },
      ),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#569C5B",
      cancelButtonColor: "#dc3545",
      cancelButtonText: this.translate.instant(
        "FORMCAMPAIGN.UPDATE_CONFIRMATION_STATUS.cancelButton",
      ),
      confirmButtonText: this.translate.instant(
        "FORMCAMPAIGN.UPDATE_CONFIRMATION_STATUS.confirmButton",
      ),
    };
  }

  translateStatus(status: string): string {
    const statusTranslations: { [key: string]: string } = {
      'active': 'actif',
      'inactive': 'inactif',
    };

    return statusTranslations[status] || status;
  }

  public openDialogCampaignStatus(type: string, data: any): void {
    console.log("les datas passés en parametres ");
    
    let dialogData: DialogData = { type: type, property: {} };
    dialogData.property = type === "edit" ? data : dialogData.property;
    const dialogRef = this.dialog.open(StatusModalComponent, {
      width: "800px",
      data: dialogData,
    });

    const instance = dialogRef.componentInstance;
    instance.updateSuccessful.subscribe(() => {
      this.loadAllCampaign();
    });
  }
  

  private mapCampaignModeData(): any[] {
    return this.listCampaign.map((element: any) => ({
      [this.translate.instant("FORMCAMPAIGN.COLUMNS.0.header")]: element?.titre,
      [this.translate.instant("FORMCAMPAIGN.COLUMNS.1.header")]: element?.user,
      [this.translate.instant("FORMCAMPAIGN.COLUMNS.3.header")]:
        element?.goalAmount,
      [this.translate.instant("FORMCAMPAIGN.COLUMNS.4.header")]:
        element?.currentAmount,
      [this.translate.instant("FORMCAMPAIGN.COLUMNS.5.header")]:
        element?.statut,
      [this.translate.instant("FORMCAMPAIGN.COLUMNS.6.header")]:
        element?.deadline,
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
