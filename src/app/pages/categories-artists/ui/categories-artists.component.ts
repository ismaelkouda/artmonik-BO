import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { handle } from "src/app/shared/functions/api.function";
import { CategoryArtistService } from "../data-access/category-artist.service";
import { NotyfService } from "@/shared/services/notyf.service";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { ExcelService } from "@/shared/services/excel.service";
import { TranslateService } from "@ngx-translate/core";
// import { CategoryArtistModel } from "@/core/entities/artist-model";
import { MatDialog } from "@angular/material/dialog";
import { FormCategoryArtistsComponent } from "../features/categories-artists/form-category-artists/form-category-artists.component";
import { Table } from "primeng/table";
import Swal, { SweetAlertOptions } from "sweetalert2";

interface DialogData {
    type: string;
    property: any;
}

@Component({
    selector: 'app-categories-artists',
    templateUrl: './categories-artists.component.html',
    styleUrls: ['./categories-artists.component.scss']
})

export class CategoriesArtistsComponent implements OnInit, OnDestroy {
    @ViewChild("dt") dt: Table;
    onInputChange(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const value = inputElement.value;
        this.dt.filterGlobal(value, "contains");
    }
    public breadcrumbObject: any = {
        first: "FormCategoryArtist.BREADCRUMB.FIRST",
        second: "FormCategoryArtist.BREADCRUMB.SECOND",
    };
    public columns = [
        {
            field: "libelle",
            header: "FormCategoryArtist.COLUMNS.0.header",
            isText: true
        },
        {
            field: "description",
            header: "FormCategoryArtist.COLUMNS.1.header",
            isText: true
        },
        {
            field: "status",
            header: "FormCategoryArtist.COLUMNS.2.header",
            isCenter: true,
            isBadge: true,
        },
        {
            field: "created_at",
            header: "FormCategoryArtist.COLUMNS.3.header",
            isText: true,
            isCenter: true,
        },
        {
            field: "updated_at",
            header: "FormCategoryArtist.COLUMNS.4.header",
            isText: true,
            isCenter: true,
        },
    ];
    public globalFilterFieldsObject: string[] = [
        "libelle",
        "description",
        "status",
        "created_at",
        "updated_at",
    ];
    private response: any;
    public spinner: boolean = true;
    public listCategoryArtists: Array<Object>;
    private subscriptions: Subscription = new Subscription();

    constructor(private artistService: CategoryArtistService, private notyfService: NotyfService,
        private route: ActivatedRoute, private titleService: Title,
        private translate: TranslateService, private excelService: ExcelService,
        public dialog: MatDialog) { }


    ngOnInit(): void {
        this.subscribeToRouteData();
        this.subscribeToCategoryArtistStorage();
    }

    async ngAfterViewInit() {
        await this.getCategoryArtistsAll();
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

    private async subscribeToCategoryArtistStorage() {
        this.subscriptions.add();
    }

    async getCategoryArtistsAll(dataToSend = {}): Promise<any> {
        this.response = await handle(() => this.artistService.getArtistsCategoriesAll(), this.notyfService);
        this.listCategoryArtists = this.response?.data;
        this.spinner = false;
    }

    public openDialogCategoryArtist(type: string, data: any): void {
        let dialogData: DialogData = { type: type, property: {} };
        dialogData.property = type === "editer" ? data : dialogData.property;
        const dialogRef = this.dialog.open(FormCategoryArtistsComponent, {
            width: "600px",
            data: dialogData,
        });

        const instance = dialogRef.componentInstance;
        instance.updateSuccessful.subscribe(() => {
            this.getCategoryArtistsAll();
        });
    }

    public exportExcel(): void {
        if (this.isListEmpty()) {
            this.showNoDataToast();
            return;
        }
        try {
            const data = this.mapCategoryArtistData();
            this.excelService.exportAsExcelFile(
                data,
                this.translate.instant("artistList"),
            );
        } catch (error) {
            console.error("Failed to export data", error);
        }
    }

    private isListEmpty(): boolean {
        return this.listCategoryArtists?.length === 0;
    }

    private showNoDataToast(): void {
        this.notyfService.showToast(
            "error",
            this.translate.instant("noDataInTable"),
            "toast-error",
        );
    }

    private mapCategoryArtistData(): any[] {
        return this.listCategoryArtists.map((element: any) => ({
            [this.translate.instant("FormCategoryArtist.COLUMNS.0.header")]: element?.libelle,
            [this.translate.instant("FormCategoryArtist.COLUMNS.1.header")]: element?.description,
            [this.translate.instant("FormCategoryArtist.COLUMNS.2.header")]: element?.status,
            [this.translate.instant("FormCategoryArtist.COLUMNS.3.header")]: element?.createdat,
            [this.translate.instant("FormCategoryArtist.COLUMNS.4.header")]: element?.updatedat,
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

    translateStatus(status: string): string {
        const statusTranslations: { [key: string]: string } = {
            'active': 'actif',
            'inactive': 'inactif',
        };

        return statusTranslations[status] || status;
    }

    public showFormCategoryArtist(type: string, category: any): void {
        let dialogData: DialogData = { type: type, property: {} };
        dialogData.property = type === "editer" ? category : dialogData.property;
        const dialogRef = this.dialog.open(FormCategoryArtistsComponent, {
            width: "600px",
            data: dialogData,
        });

        const instance = dialogRef.componentInstance;
        instance.updateSuccessful.subscribe(() => {
            this.getCategoryArtistsAll();
        });
    }

    public async handleUpdateStatus(data): Promise<void> {
        const swalOptions = this.getSwalUpdateStatusOptions(`${data.libelle}`);
        const result = await Swal.fire(swalOptions);
        if (result.isConfirmed) {
            const enable = data.status !== 'active';
            const updatedStatus = enable ? 'active' : 'inactive';
            const updatedData = { ...data, status: updatedStatus };
            await this.confirmUpdateStatusChange(updatedData, enable);
        }
    }

    public getSwalUpdateStatusOptions(libelle: string): SweetAlertOptions {
        return {
            title: this.translate.instant(
                "FormCategoryArtist.UPDATE_CONFIRMATION_STATUS.title",
            ),
            html: this.translate.instant(
                "FormCategoryArtist.UPDATE_CONFIRMATION_STATUS.message",
                {
                    libelle: libelle,
                },
            ),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#569C5B",
            cancelButtonColor: "#dc3545",
            cancelButtonText: this.translate.instant(
                "FormCategoryArtist.UPDATE_CONFIRMATION_STATUS.cancelButton",
            ),
            confirmButtonText: this.translate.instant(
                "FormCategoryArtist.UPDATE_CONFIRMATION_STATUS.confirmButton",
            ),
        };
    }

    public async confirmUpdateStatusChange(data, enable: boolean): Promise<void> {
        console.log('{ id: data.id, status: enable }', { id: data.id, status: enable })
        const response: any = await handle(() => this.artistService.putArtistsCategoriesChangeStatus({ id: data.id, status: enable }), this.notyfService);
        if (response?.code === 200) this.getCategoryArtistsAll();
    }

    public async handleDeleteCategoryArtist(data): Promise<void> {
      const swalOptions = this.getSwalDeleteOptions(`${data.libelle}`);
      const result = await Swal.fire(swalOptions);
  
      if (result.isConfirmed) {
        await this.confirmDeleteCategoryArtist(data);
      }
    }

    public getSwalDeleteOptions(libelle: string): SweetAlertOptions {
      return {
        title: this.translate.instant("FormCategoryArtist.DELETE_CONFIRMATION.title"),
        html: this.translate.instant("FormCategoryArtist.DELETE_CONFIRMATION.message", {
          libelle: libelle,
        }),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#569C5B",
        cancelButtonColor: "#dc3545",
        cancelButtonText: this.translate.instant(
          "FormCategoryArtist.DELETE_CONFIRMATION.cancelButton",
        ),
        confirmButtonText: this.translate.instant(
          "FormCategoryArtist.DELETE_CONFIRMATION.confirmButton",
        ),
      };
    }

    public async confirmDeleteCategoryArtist(data): Promise<void> {
      try {
        this.response = await this.getCategoryArtistAction(data);
        if (!this.response?.error) {
          await this.getCategoryArtistsAll();
        }
      } catch (err) {
        throw err;
      }
    }

    public async getCategoryArtistAction(data): Promise<any> {
        const response: any = await handle(() => this.artistService.deleteArtistsCategoriesChangedelete({id: data.id}), this.notyfService);
        if (response?.code === 200) this.getCategoryArtistsAll();
    }

}
