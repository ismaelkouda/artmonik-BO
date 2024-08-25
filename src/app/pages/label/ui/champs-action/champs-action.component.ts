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
import { FormChampsActionComponent } from "../../features/champs-action/form-champs-action/form-champs-action.component";
import { ExcelService } from "@/shared/services/excel.service";
import { SWALWITHBOOTSTRAPBUTTONSPARAMS } from "@/shared/constants/swalWithBootstrapButtonsParams.constant";
import { LabelService } from "../../data-access/label.service";
interface DialogData {
  type: string;
  property: any;
}
@Component({
  selector: "app-champs-action",
  templateUrl: "./champs-action.component.html",
  styleUrls: ["./champs-action.component.scss"]
})

export class ChampsActionComponent implements OnInit {
  public dataToSend: Object | void;
  @ViewChild("dt") dt: Table;
  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    this.dt.filterGlobal(value, "contains");
  }
  public breadcrumbObject: any = {
    first: "FormChampsAction.BREADCRUMB.FIRST",
    second: "FormChampsAction.BREADCRUMB.SECOND",
  };
  public response: any;
  public columns = [
    {
      field: "title",
      header: "FormChampsAction.COLUMNS.0.header",
      isText: true,
      isCenter: true,
    },
    {
      field: "sub_title",
      header: "FormChampsAction.COLUMNS.1.header",
      isText: true,
      isCenter: true,
    },
    {
      field: "image",
      header: "FormChampsAction.COLUMNS.2.header",
      isText: true,
      isCenter: true,
    },
    {
      field: "image_title",
      header: "FormChampsAction.COLUMNS.3.header",
      isText: true,
      isCenter: true,
    },
    {
      field: "description",
      header: "FormCategoryArtist.COLUMNS.4.header",
      isText: true
    },
    {
      field: "created_at",
      header: "FormChampsAction.COLUMNS.5.header",
      isText: true,
      isCenter: true,
    },
    {
      field: "updated_at",
      header: "FormChampsAction.COLUMNS.6.header",
      isText: true,
      isCenter: true,
    },
  ];
  public globalFilterFieldsObject: string[] = [
    "title",
    "subTitle",
    "image",
    "image_title",
    "description",
    "created_at",
    "updated_at",
  ];

  public listChampsAction: Array<Object> = [
    { title: "kouda", sub_title: "azerty120@gmail.com", description: "soumaila", created_at: "", updated_at: "" }
  ];
  public spinner: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    public dialog: MatDialog,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private titleService: Title,
    private notyfService: NotyfService,
    private labelService: LabelService,
    private excelService: ExcelService,
  ) { }

  async ngOnInit() {
    this.subscribeToRouteData();
    this.subscribeToChampsActionStorage();
  }

  private subscribeToRouteData(): void {
    this.subscriptions.add(
      this.route.data.subscribe((data) => {
        const title = data["title"] || "Default Title";
        this.titleService.setTitle(title);
      }),
    );
  }

  private async subscribeToChampsActionStorage() {
    this.subscriptions.add();
  }

  ngAfterViewInit() {
    // this.getChampsActionAll();
    this.spinner = true;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public async getChampsActionAll(dataToSend: Object = {}): Promise<void> {
    this.response = await handle(() => this.labelService.getChampsActionAll(), this.notyfService);
    this.spinner = false;
    this.listChampsAction = this.response?.data;
  }

  public exportExcel(): void {
    if (this.isEmpty()) {
      this.showNoDataToast();
      return;
    }
    try {
      const data = this.mapChampsActionData();
      this.excelService.exportAsExcelFile(
        data,
        this.translate.instant("champs-action"),
      );
    } catch (error) {
      console.error("Failed to export data", error);
    }
  }

  private isEmpty(): boolean {
    return this.listChampsAction?.length === 0;
  }

  private showNoDataToast(): void {
    this.notyfService.showToast(
      "error",
      this.translate.instant("noDataInTable"),
      "toast-error",
    );
  }

  private mapChampsActionData(): any[] {
    return this.listChampsAction.map((element: any) => ({
      [this.translate.instant("FormChampsAction.COLUMNS.0.header")]: element?.title,
      [this.translate.instant("FormChampsAction.COLUMNS.1.header")]: element?.sub_title,
      [this.translate.instant("FormChampsAction.COLUMNS.2.header")]: element?.image,
      [this.translate.instant("FormChampsAction.COLUMNS.3.header")]: element?.image_title,
      [this.translate.instant("FormChampsAction.COLUMNS.4.header")]: element?.description,
      [this.translate.instant("FormChampsAction.COLUMNS.5.header")]: element?.createdat,
      [this.translate.instant("FormChampsAction.COLUMNS.6.header")]: element?.updatedat,
    }));
  }

  public openDialogChampsAction(type: string, service: any): void {
    let dialogData: DialogData = { type: type, property: {} };
    dialogData.property = type === "edit" ? service : dialogData.property;
    const dialogRef = this.dialog.open(FormChampsActionComponent, {
      width: "600px",
      data: dialogData,
    });

    const instance = dialogRef.componentInstance;
    instance.updateSuccessful.subscribe(() => {
      this.getChampsActionAll();
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

  public async handleDeleteChampsAction(data): Promise<void> {
    const swalOptions = this.getSwalDeleteOptions(`${data.libelle}`);
    const result = await Swal.fire(swalOptions);

    if (result.isConfirmed) {
      await this.confirmDeleteChampsAction(data);
    }
  }

  public getSwalDeleteOptions(title: string): SweetAlertOptions {
    return {
      title: this.translate.instant("FormChampsAction.DELETE_CONFIRMATION.title"),
      html: this.translate.instant("FormChampsAction.DELETE_CONFIRMATION.message", {
        libelle: title,
      }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#569C5B",
      cancelButtonColor: "#dc3545",
      cancelButtonText: this.translate.instant(
        "FormChampsAction.DELETE_CONFIRMATION.cancelButton",
      ),
      confirmButtonText: this.translate.instant(
        "FormChampsAction.DELETE_CONFIRMATION.confirmButton",
      ),
    };
  }

  public async confirmDeleteChampsAction(data): Promise<void> {
    try {
      this.response = await this.getChampsActionAction(data);
      if (!this.response?.error) {
        await this.getChampsActionAll();
      }
    } catch (err) {
      throw err;
    }
  }

  public async getChampsActionAction(data): Promise<any> {
    const response: any = await handle(() => this.labelService.postChampsActionDelete({ id: data.id }), this.notyfService);
    if (response?.code === 200) this.getChampsActionAll();
  }
}