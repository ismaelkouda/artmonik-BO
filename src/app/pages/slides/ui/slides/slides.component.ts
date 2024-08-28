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
import { FormSlidesComponent } from "../../feature/form-slides/form-slides.component";
import { SlideService } from "../../data-access/slide.service";
import { ExcelService } from "@/shared/services/excel.service";
import { SWALWITHBOOTSTRAPBUTTONSPARAMS } from "@/shared/constants/swalWithBootstrapButtonsParams.constant";
interface DialogData {
  type: string;
  property: any;
}
@Component({
  selector: "app-slides",
  templateUrl: "./slides.component.html",
  styleUrls: ["./slides.component.scss"]
})

export class SlidesComponent implements OnInit {
  public dataToSend: Object | void;
  @ViewChild("dt") dt: Table;
  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    this.dt.filterGlobal(value, "contains");
  }
  public breadcrumbObject: any = {
    first: "FormSlides.BREADCRUMB.FIRST",
    second: "FormSlides.BREADCRUMB.SECOND",
  };
  public response: any;
  public columns = [
    {
      field: "title",
      header: "FormSlides.COLUMNS.0.header",
      isText: true,
      isCenter: true,
    },
    {
      field: "description",
      header: "FormSlides.COLUMNS.1.header",
      isText: true,
      isCenter: true,
    },
    {
      field: "page_link",
      header: "FormSlides.COLUMNS.2.header",
      isText: true,
      isCenter: true,
    },
    {
      field: "image",
      header: "FormSlides.COLUMNS.3.header",
      isText: true,
      isCenter: true,
    },
    {
      field: "created_at",
      header: "FormSlides.COLUMNS.4.header",
      isText: true,
      isCenter: true,
    },
    {
      field: "updated_at",
      header: "FormSlides.COLUMNS.5.header",
      isText: true,
      isCenter: true,
    },
  ];
  public globalFilterFieldsObject: string[] = [
    "title",
    "description",
    "page_link",
    "image",
    "created_at",
    "updated_at",
  ];

  public listSlides: Array<Object> = [];
  public spinner: boolean = false;
  private subscriptions: Subscription = new Subscription();
  
  constructor(
    public dialog: MatDialog,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private titleService: Title,
    private notyfService: NotyfService,
    private slideService: SlideService,
    private excelService: ExcelService,
  ) { }

  async ngOnInit() {
    this.subscribeToRouteData();
    this.subscribeToSlideStorage();
  }

  private subscribeToRouteData(): void {
    this.subscriptions.add(
      this.route.data.subscribe((data) => {
        const title = data["title"] || "Default Title";
        this.titleService.setTitle(title);
      }),
    );
  }

  private async subscribeToSlideStorage() {
    this.subscriptions.add();
  }

  ngAfterViewInit() {
    // this.getSlidesAll();
    this.spinner = true;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public async getSlidesAll(dataToSend: Object = {}): Promise<void> {
    this.response = await handle(() => this.slideService.getSlidesAll(), this.notyfService);
    this.spinner = false;
    this.listSlides = this.response?.data;
  }

  public exportExcel(): void {
    if (this.isEmpty()) {
      this.showNoDataToast();
      return;
    }
    try {
      const data = this.mapSlideData();
      this.excelService.exportAsExcelFile(
        data,
        this.translate.instant("slides"),
      );
    } catch (error) {
      console.error("Failed to export data", error);
    }
  }

  private isEmpty(): boolean {
    return this.listSlides?.length === 0;
  }

  private showNoDataToast(): void {
    this.notyfService.showToast(
      "error",
      this.translate.instant("noDataInTable"),
      "toast-error",
    );
  }

  private mapSlideData(): any[] {
    return this.listSlides.map((element: any) => ({
      [this.translate.instant("FormSlides.COLUMNS.0.header")]: element?.title,
      [this.translate.instant("FormSlides.COLUMNS.1.header")]: element?.description,
      [this.translate.instant("FormSlides.COLUMNS.2.header")]: element?.page_link,
      [this.translate.instant("FormSlides.COLUMNS.3.header")]: element?.image,
      [this.translate.instant("FormSlides.COLUMNS.4.header")]: element?.createdat,
      [this.translate.instant("FormSlides.COLUMNS.5.header")]: element?.updatedat,
    }));
  }

  public openDialogSlide(type: string, service: any): void {
    let dialogData: DialogData = { type: type, property: {} };
    dialogData.property = type === "edit" ? service : dialogData.property;
    const dialogRef = this.dialog.open(FormSlidesComponent, {
      width: "600px",
      data: dialogData,
    });

    const instance = dialogRef.componentInstance;
    instance.updateSuccessful.subscribe(() => {
      this.getSlidesAll();
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

  public async handleDeleteSlide(data): Promise<void> {
    const swalOptions = this.getSwalDeleteOptions(`${data.libelle}`);
    const result = await Swal.fire(swalOptions);

    if (result.isConfirmed) {
      await this.confirmDeleteSlide(data);
    }
  }

  public getSwalDeleteOptions(libelle: string): SweetAlertOptions {
    return {
      title: this.translate.instant("FormSlides.DELETE_CONFIRMATION.title"),
      html: this.translate.instant("FormSlides.DELETE_CONFIRMATION.message", {
        libelle: libelle,
      }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#569C5B",
      cancelButtonColor: "#dc3545",
      cancelButtonText: this.translate.instant(
        "FormSlides.DELETE_CONFIRMATION.cancelButton",
      ),
      confirmButtonText: this.translate.instant(
        "FormSlides.DELETE_CONFIRMATION.confirmButton",
      ),
    };
  }

  public async confirmDeleteSlide(data): Promise<void> {
    try {
      this.response = await this.getSlideAction(data);
      if (!this.response?.error) {
        await this.getSlidesAll();
      }
    } catch (err) {
      throw err;
    }
  }

  public async getSlideAction(data): Promise<any> {
      const response: any = await handle(() => this.slideService.postSlidesDelete({id: data.id}), this.notyfService);
      if (response?.code === 200) this.getSlidesAll();
  }
}