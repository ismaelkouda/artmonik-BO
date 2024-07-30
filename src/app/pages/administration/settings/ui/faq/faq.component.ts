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
import { UserModel } from "@/core/entities/user-model";
import Swal, { SweetAlertOptions } from "sweetalert2";
import { FaqFormComponent } from "./feature/faq-form/faq-form.component";
import { handleDeleteFaq, handleGetAllFaq, handleUpdateFaqStatusMode } from "../../data-access/faq/functions/faq.function";
import { FaqService } from "../../data-access/faq/services/faq.services";
import { FaqModel } from "@/core/entities/settings/faq.model";

interface DialogData {
  type: string;
  property: any;
}
@Component({
  selector: "app-faq",
  templateUrl: "./faq.component.html",
  styleUrls: ["./faq.component.scss"],
})
export class FaqComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("dt") dt: Table;
  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    this.dt.filterGlobal(value, "contains");
  }
  public breadcrumbObject: any = {
    first: "FormFaq.BREADCRUMB.FIRST",
    second: "FormFaq.BREADCRUMB.SECOND",
  };
  public response: any;
  public columns = [
    {
      field: "title",
      header: "FormFaq.COLUMNS.0.header",
      isText: true,
      isCenter:true,
    },
    {
      field: "description",
      header: "FormFaq.COLUMNS.1.header",
      isText: true,
      isCenter:true,
    },
    {
      field: "status",
      header: "FormFaq.COLUMNS.2.header",
      isBadge: true,
      isCenter:true
    },
    {
      field: "created_at",
      header: "FormFaq.COLUMNS.3.header",
      isText: true,
      isCenter:true,
    },
    {
      field: "updated_at",
      header: "FormFaq.COLUMNS.4.header",
      isText: true,
      isCenter:true,
    },
    
  ];
  public globalFilterFieldsObject: string[] = [
    "title",
    "description",
    "status",
    "created_at",
    "updated_at",
  ];
  public listFaq: any = [];
  public totalRecords: number;
  public rows: number;
  public currentPage: number = 1;
  public totalPages: number;
  public pageSize: number ;
  public activeTabLabel: string = 'Liste';


  private subscriptions: Subscription = new Subscription();
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router : Router,
    private titleService: Title,
    private faqservice: FaqService,
    private translate: TranslateService,
    private excelService: ExcelService,
    private dateFormatService: DateFormatService,
    private notyfService: NotyfService,
  ) {}

  async ngOnInit() {
    this.subscribeToRouteData();
    this.subscribeToFaqStorage();
  }

  async ngAfterViewInit() {
    await this.loadAllFaq();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onChange(event: number): void {
    if(event === 0) {
      this.router.navigate(['settings/faq', {onglet: 'liste'}]);
    } else if(event === 1) {
      this.router.navigate(['settings/faq', {onglet: 'historique'}]);
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

  

  private async subscribeToFaqStorage() {
    this.subscriptions.add();
  }

  public async loadAllFaq(nb : number = 1): Promise<void> {
    this.response = await handleGetAllFaq(
      () => this.faqservice.getAllFaq(nb),
      this.notyfService,
    );

    this.totalRecords = this.response?.data?.total,
    this.currentPage = this.response?.data?.current_page,
    this.totalPages = this.response?.data?.total_pages,
    this.rows = this.response?.data?.per_page,    
    this.listFaq = this.response?.data?.data.map((faq) => this.mapFaqDates(faq));
  }

  public onPageChange(event: any): void {    
   this.loadAllFaq(event.page +1)
  }

  translateStatus(status: string): string {
    const statusTranslations: { [key: string]: string } = {
      'active': 'actif',
      'inactive': 'inactif',
    };

    return statusTranslations[status] || status;
  }

  private mapFaqDates(faq: any): FaqModel {
    return {
      ...faq,
      created_at: this.dateFormatService.formatIsoDate(faq.created_at),
      updated_at: this.dateFormatService.formatIsoDate(faq.updated_at),
    };
  }

  public showFormFaq(type: string, data: UserModel): void {
    let dialogData: DialogData = { type: type, property: {} };    
    dialogData.property = type === "edit" ? data : dialogData.property;
    const dialogRef = this.dialog.open(FaqFormComponent, {
      width: "600px",
      data: dialogData,
    });

    const instance = dialogRef.componentInstance;
    instance.updateSuccessful.subscribe(() => {
      this.loadAllFaq();
    });

  }

  
  public async handleUpdateStatus(data): Promise<void> {
    const swalOptions = this.getSwalUpdateStatusOptions(`${data.title}`);
    const result = await Swal.fire(swalOptions);
    if (result.isConfirmed) {
      const enable = data.status !== 'active'; 
      const updatedStatus = enable ? 'active' : 'inactive';
      const updatedData = { ...data, status: updatedStatus };
      await this.confirmUpdateStatusPaymentMode(updatedData, enable);
    }

  }

  public async confirmUpdateStatusPaymentMode(data , enable : boolean): Promise<void> {
    await handleUpdateFaqStatusMode(
      () => this.faqservice.FaqStatus(data.id, enable),
      this.notyfService,
    );
    this.loadAllFaq();
  }

  public getSwalUpdateStatusOptions(libelle: string): SweetAlertOptions {
    return {
      title: this.translate.instant(
        "FormFaq.UPDATE_CONFIRMATION_STATUS.title",
      ),
      html: this.translate.instant(
        "FormFaq.UPDATE_CONFIRMATION_STATUS.message",
        {
          libelle: libelle,
        },
      ),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#569C5B",
      cancelButtonColor: "#dc3545",
      cancelButtonText: this.translate.instant(
        "FormFaq.UPDATE_CONFIRMATION_STATUS.cancelButton",
      ),
      confirmButtonText: this.translate.instant(
        "FormFaq.UPDATE_CONFIRMATION_STATUS.confirmButton",
      ),
    };
  }

  public async handleDeleteFaq(data): Promise<void> {
    const swalOptions = this.getSwalDeleteOptions(`${data.title}`);
    const result = await Swal.fire(swalOptions);

    if (result.isConfirmed) {
      await this.confirmDeleteFaq(data);
    }
  }

  public getSwalDeleteOptions(title: string): SweetAlertOptions {
    return {
      title: this.translate.instant("FormFaq.DELETE_CONFIRMATION.title"),
      html: this.translate.instant("FormFaq.DELETE_CONFIRMATION.message", {
        title: title,
      }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#569C5B",
      cancelButtonColor: "#dc3545",
      cancelButtonText: this.translate.instant(
        "FormFaq.DELETE_CONFIRMATION.cancelButton",
      ),
      confirmButtonText: this.translate.instant(
        "FormFaq.DELETE_CONFIRMATION.confirmButton",
      ),
    };
  }

  public async getFaqAction(faqId): Promise<any> {
    return handleDeleteFaq(
      () => this.faqservice.deleteFaq(faqId),
      this.notyfService
      );
  }

  public async confirmDeleteFaq(data): Promise<void> {
    try {
      this.response = await this.getFaqAction(data);
      if (!this.response?.error) {
        await this.loadAllFaq();
      }
    } catch (err) {
      throw err;
    }
  }

  public exportExcel(): void {
    if (this.isListEmpty()) {
      this.showNoDataToast();
      return;
    }

    try {
      const data = this.mapFaqData();
      this.excelService.exportAsExcelFile(
        data,
        this.translate.instant("faqList"),
      );
    } catch (error) {
      console.error("Failed to export data", error);
    }
  }

  private isListEmpty(): boolean {
    return this.listFaq?.length === 0;
  }

  private showNoDataToast(): void {
    this.notyfService.showToast(
      "error",
      this.translate.instant("noDataInTable"),
      "toast-error",
    );
  }

  private mapFaqData(): any[] {
    return this.listFaq.map((element: any) => ({
      [this.translate.instant("FormFaq.COLUMNS.0.header")]: element?.title,
      [this.translate.instant("FormFaq.COLUMNS.1.header")]:
        element?.description,
    }));
  }

  public getCellValue(field: string, module: any): string {
    if (!field) return "";
    const fieldParts = field.split(".");
    let value = module;
    for (const part of fieldParts) {
      value = value ? value[part] : "";
    }
    return value;
  }
}
