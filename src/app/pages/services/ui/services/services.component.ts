import { handle } from "@/shared/functions/api.function";
import { NotyfService } from "@/shared/services/notyf.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Table } from "primeng/table";
import { Subscription } from "rxjs";
import Swal, { SweetAlertOptions } from "sweetalert2";
import { FormServicesComponent } from "../../feature/form-services/form-services.component";
import { ServiceService } from "../../data-access/service.service";
import { ExcelService } from "@/shared/services/excel.service";
import { SWALWITHBOOTSTRAPBUTTONSPARAMS } from "@/shared/constants/swalWithBootstrapButtonsParams.constant";
interface DialogData {
  type: string;
  property: any;
}
@Component({
  selector: "app-services",
  templateUrl: "./services.component.html",
  styleUrls: ["./services.component.scss"]
})

export class ServicesComponent implements OnInit {
  public dataToSend: Object | void;
  @ViewChild("dt") dt: Table;
  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    this.dt.filterGlobal(value, "contains");
  }
  public breadcrumbObject: any = {
    first: "FormServices.BREADCRUMB.FIRST",
    second: "FormServices.BREADCRUMB.SECOND",
  };
  public response: any;
  public columns = [
    {
      field: "code",
      header: "FormServices.COLUMNS.0.header",
      isText: true,
      isCenter: true,
    },
    {
      field: "title",
      header: "FormServices.COLUMNS.1.header",
      isText: true,
      isCenter: true,
    },
    {
      field: "image",
      header: "FormServices.COLUMNS.2.header",
      isText: true,
      isCenter: true,
    },
    {
      field: "description",
      header: "FormServices.COLUMNS.3.header",
      isText: true,
      isCenter: true,
    },
    {
      field: "created_at",
      header: "FormServices.COLUMNS.4.header",
      isText: true,
      isCenter: true,
    },
    {
      field: "updated_at",
      header: "FormServices.COLUMNS.5.header",
      isText: true,
      isCenter: true,
    },
  ];
  public globalFilterFieldsObject: string[] = [
    "code",
    "title",
    "image",
    "description",
    "created_at",
    "updated_at",
  ];

  public listServices: Array<Object> = [
    {nom: "kouda", prenoms: "soumaila", email: "azerty120@gmail.com", telephone: "0125648985", categorie: "", image: "", created_at: "", updated_at: ""}
];
  public spinner: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    public dialog: MatDialog,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private titleService: Title,
    private notyfService: NotyfService,
    private serviceService: ServiceService,
    private excelService: ExcelService,
  ) { }

  async ngOnInit() {
    this.subscribeToRouteData();
    this.subscribeToServiceStorage();
  }

  private subscribeToRouteData(): void {
    this.subscriptions.add(
      this.route.data.subscribe((data) => {
        const title = data["title"] || "Default Title";
        this.titleService.setTitle(title);
      }),
    );
  }

  private async subscribeToServiceStorage() {
    this.subscriptions.add();
  }

  ngAfterViewInit() {
    // this.getServicesAll();
    this.spinner = true;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public async getServicesAll(dataToSend: Object = {}): Promise<void> {
    this.response = await handle(() => this.serviceService.getServicesAll(), this.notyfService);
    this.spinner = false;
    this.listServices = this.response?.data;
  }

  public exportExcel(): void {
    if (this.isEmpty()) {
      this.showNoDataToast();
      return;
    }
    try {
      const data = this.mapServiceData();
      this.excelService.exportAsExcelFile(
        data,
        this.translate.instant("services"),
      );
    } catch (error) {
      console.error("Failed to export data", error);
    }
  }

  private isEmpty(): boolean {
    return this.listServices?.length === 0;
  }

  private showNoDataToast(): void {
    this.notyfService.showToast(
      "error",
      this.translate.instant("noDataInTable"),
      "toast-error",
    );
  }

  private mapServiceData(): any[] {
    return this.listServices.map((element: any) => ({
      [this.translate.instant("FormServices.COLUMNS.0.header")]: element?.nom,
      [this.translate.instant("FormServices.COLUMNS.1.header")]: element?.prenom,
      [this.translate.instant("FormServices.COLUMNS.2.header")]: element?.email,
      [this.translate.instant("FormServices.COLUMNS.3.header")]: element?.profil,
      [this.translate.instant("FormServices.COLUMNS.4.header")]: element?.createdat,
      [this.translate.instant("FormServices.COLUMNS.5.header")]: element?.updatedat,
    }));
  }

  public openDialogService(type: string, service: any): void {
    let dialogData: DialogData = { type: type, property: {} };
    dialogData.property = type === "edit" ? service : dialogData.property;
    const dialogRef = this.dialog.open(FormServicesComponent, {
      width: "600px",
      data: dialogData,
    });

    const instance = dialogRef.componentInstance;
    instance.updateSuccessful.subscribe(() => {
      this.getServicesAll();
    });
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

  public async handleDeleteService(data): Promise<void> {
    const title: any = this.translate.instant("FormServices.DELETE_CONFIRMATION.title")
    const html: any = this.translate.instant("FormServices.DELETE_CONFIRMATION.message", { name: data.name, status: 'enable' })
    const cancelButtonText: any = this.translate.instant("FormServices.DELETE_CONFIRMATION.cancelButton");
    const confirmButtonText: any = this.translate.instant("FormServices.DELETE_CONFIRMATION.confirmButton")
    const result = await Swal.fire({ ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message, ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message.title = title, ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message.html = html, ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message.cancelButtonText = cancelButtonText, ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message.confirmButtonText = confirmButtonText })
    if (result.isConfirmed) {
      const response: any = await handle(() => this.serviceService.postServicesDelete(data.id), this.notyfService);
      if (response?.error) this.successHandle(response);
    }
  }

  private successHandle(response: any): void {
    this.notyfService.showToast("success", response?.message, "toast-success");
  }
}