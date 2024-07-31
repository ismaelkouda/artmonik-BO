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
import { Table } from "primeng/table";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { ExcelService } from "@/shared/services/excel.service";
import { DateFormatService } from "@/shared/utils/date-format.service";
import { NotyfService } from "@/shared/services/notyf.service";
import { CampaignCategoryModel } from "@/core/entities/campaign/campaignCategoryModel";
import { CampaignService } from "@/pages/management/campaign/data-access/services/campaign-mode.service";
import {
  
  handleDeleteCatecoryCampaigns,
  handleGetAllCategoryCampaign,
  handleUpdateCaterogyStatusMode,
} from "@/pages/management/campaign/data-access/functions/campaign-mode.functions";
import { CategoryFormComponent } from "@/pages/management/campaign/ui/feature/category-form/category-form.component";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { ImageModalComponent } from "../feature/image-modal/image-modal.component";
import Swal, { SweetAlertOptions } from "sweetalert2";

interface DialogData {
  type: string;
  property: any;
}
@Component({
  selector: "app-categorie",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.scss"],
})
export class CategoryComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("dt") dt: Table;
  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    this.dt.filterGlobal(value, "contains");
  }
  public breadcrumbObject: any = {
    first: "FormCategory.BREADCRUMB.FIRST",
    second: "FormCategory.BREADCRUMB.SECOND",
  };
  public response: any;
  public columns = [
    {
      field: "title",
      header: "FormCategory.COLUMNS.0.header",
      isText: true,
      isCenter: true,
    },
    {
      field: "image",
      header: "FormCategory.COLUMNS.1.header",
      isText: false,
      isActions: true,
      isCenter: true,
    },
    {
      field: "status",
      header: "FormCategory.COLUMNS.2.header",
      isBadge: true,
      isCenter: true,
    },
    {
      field: "created_at",
      header: "FormCategory.COLUMNS.3.header",
      isText: true,
      isCenter: true,
    },
    {
      field: "updated_at",
      header: "FormCategory.COLUMNS.4.header",
      isText: true,
      isCenter: true,
    },
  ];
  public globalFilterFieldsObject: string[] = [
    "title",
    "image",
    "status",
    "created_at",
    "updated_at",
  ];
  public listCampaignCategory: any = [];

  public activeTabLabel: string = 'Liste';

  public totalRecords: number;
  public rows: number;
  public currentPage: number = 1;
  public totalPages: number;
  public pageSize: number ;

  private subscriptions: Subscription = new Subscription();
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router : Router,
    private titleService: Title,
    private modalService: NgbModal,
    private campService: CampaignService,
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
    await this.loadAllCampaignCateroy();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onChange(event: number): void {
    if(event === 0) {
      this.router.navigate(['campaign/category', {onglet: 'liste'}]);
    } else if(event === 1) {
      this.router.navigate(['campaign/category', {onglet: 'historique'}]);
    }
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

  public async loadAllCampaignCateroy(nb : number =1): Promise<void> {
    this.response = await handleGetAllCategoryCampaign(
      () => this.campService.getAllCampaignCategory(nb),
      this.notyfService,
    );

    this.totalRecords = this.response?.data?.total,
    this.currentPage = this.response?.data?.current_page,
    this.totalPages = this.response?.data?.last_page,
    this.rows = this.response?.data?.per_page,
    this.listCampaignCategory = this.response?.data?.data.map((campaignMode) =>
      this.mapCampaignsModeDates(campaignMode),
    );
  }

  public showImageModal(category: any) {
  
    const modalOptions: NgbModalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: true,
      keyboard: true,
      centered: true
  };

  const modalRef = this.modalService.open(ImageModalComponent, modalOptions);
  // console.log("contenu de category", category);
  
  modalRef.componentInstance.imageData = category;
  
}

  public onPageChange(event: any): void {    
    this.loadAllCampaignCateroy(event.page +1)
   }

  private mapCampaignsModeDates(campaignMode: any): CampaignCategoryModel {
    return {
      ...campaignMode,
      created_at: this.dateFormatService.formatIsoDate(campaignMode.created_at),
      updated_at: this.dateFormatService.formatIsoDate(campaignMode.updated_at),
    };
  }

  public showCampaignsCategoryMode(
    type: string,
    data: CampaignCategoryModel,
  ): void {
    let dialogData: DialogData = { type: type, property: {} };
    dialogData.property = type === "edit" ? data : dialogData.property;
    const dialogRef =this.dialog.open(CategoryFormComponent, {
      width: "600px",
      data: dialogData,
    });

    const instance = dialogRef.componentInstance;
    instance.updateSuccessful.subscribe(() => {
      this.loadAllCampaignCateroy();
    });
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
    return this.listCampaignCategory?.length === 0;
  }

  private showNoDataToast(): void {
    this.notyfService.showToast(
      "error",
      this.translate.instant("noDataInTable"),
      "toast-error",
    );
  }

  

  public async handleUpdateStatus(data): Promise<void> {
    const swalOptions = this.getSwalUpdateStatusOptions(`${data.title}`);
    const result = await Swal.fire(swalOptions);
    if (result.isConfirmed) {

    await this.confirmUpdateStatusCategorieMode(data);
    }

  }

  public async confirmUpdateStatusCategorieMode(data): Promise<void> {
    await handleUpdateCaterogyStatusMode(
      () => this.campService.CampaignCategorieStatus(data),
      this.notyfService,
    );
    this.loadAllCampaignCateroy();
  }

  public getSwalUpdateStatusOptions(title: string): SweetAlertOptions {
    return {
      title: this.translate.instant(
        "FormCategory.UPDATE_CONFIRMATION_STATUS.title",
      ),
      html: this.translate.instant(
        "FormCategory.UPDATE_CONFIRMATION_STATUS.message",
        {
          title: title,
        },
      ),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#569C5B",
      cancelButtonColor: "#dc3545",
      cancelButtonText: this.translate.instant(
        "FormCategory.UPDATE_CONFIRMATION_STATUS.cancelButton",
      ),
      confirmButtonText: this.translate.instant(
        "FormCategory.UPDATE_CONFIRMATION_STATUS.confirmButton",
      ),
    };
  }

  public getSwalDeleteOptions(title: string): SweetAlertOptions {
    return {
      title: this.translate.instant("FormCategory.DELETE_CONFIRMATION.title"),
      html: this.translate.instant("FormCategory.DELETE_CONFIRMATION.message", {
        title: title,
      }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#569C5B",
      cancelButtonColor: "#dc3545",
      cancelButtonText: this.translate.instant(
        "FormCategory.DELETE_CONFIRMATION.cancelButton",
      ),
      confirmButtonText: this.translate.instant(
        "FormCategory.DELETE_CONFIRMATION.confirmButton",
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

  public async getUserAction(categoryId): Promise<any> {
    return handleDeleteCatecoryCampaigns(
      () => this.campService.deleteCampaignCategory(categoryId),
      this.notyfService,
    );
  }

  public async handleDelete(data): Promise<void> {
    const swalOptions = this.getSwalDeleteOptions(`${data.title}`);
    const result = await Swal.fire(swalOptions);
    if (result.isConfirmed) {
      
      await this.confirmDeleteUser(data);
      
    }
  }

  public async confirmDeleteUser(data): Promise<void> {
    try {
      this.response = await this.getUserAction(data);
      if (!this.response?.error) {
        // console.log("user deleted successfully");
        
        this.loadAllCampaignCateroy();
      }
    } catch (err) {
      throw err;
    }
  }

  private mapCampaignModeData(): any[] {
    return this.listCampaignCategory.map((element: any) => ({
      [this.translate.instant("FormCategory.COLUMNS.0.header")]:
        element?.title,
      [this.translate.instant("FormCategory.COLUMNS.1.header")]: 
      element?.image,
      [this.translate.instant("FormCategory.COLUMNS.2.header")]:
        element?.status,
      [this.translate.instant("FormCategory.COLUMNS.3.header")]:
        element?.dateCreation,
      [this.translate.instant("FormCategory.COLUMNS.4.header")]:
        element?.dateModification,
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
