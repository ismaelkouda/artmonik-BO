import { ExcelService } from "@/shared/services/excel.service";
import { NotyfService } from "@/shared/services/notyf.service";
import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Table } from "primeng/table";
import { Subscription } from "rxjs";
import { LogoService } from "../../data-access/logo.service";
import { handle } from "@/shared/functions/api.function";
import Swal, { SweetAlertOptions } from "sweetalert2";
import { FormLogoComponent } from "../../features/form-logo/form-logo.component";
import { SWALWITHBOOTSTRAPBUTTONSPARAMS } from "@/shared/constants/swalWithBootstrapButtonsParams.constant";
interface DialogData {
    type: string;
    property: any;
}
@Component({
    selector: "app-logo",
    templateUrl: "./logo.component.html",
    styleUrls: ["./logo.component.scss"]
})

export class LogoComponent {
    public dataToSend: Object | void;
    @ViewChild("dt") dt: Table;
    onInputChange(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const value = inputElement.value;
        this.dt.filterGlobal(value, "contains");
    }
    public breadcrumbObject: any = {
        first: "FormLogo.BREADCRUMB.FIRST",
        second: "FormLogo.BREADCRUMB.SECOND",
    };
    public response: any;
    public columns = [
        {
            field: "logo",
            header: "FormLogo.COLUMNS.0.header",
            isText: true,
            isCenter: true,
        },
        {
            field: "description",
            header: "FormLogo.COLUMNS.1.header",
            isText: true,
            isCenter: true,
        },
        {
            field: "created_at",
            header: "FormLogo.COLUMNS.2.header",
            isText: true,
            isCenter: true,
        },
        {
            field: "updated_at",
            header: "FormLogo.COLUMNS.3.header",
            isText: true,
            isCenter: true,
        },
    ];
    public globalFilterFieldsObject: string[] = [
        "logo",
        "description",
        "created_at",
        "updated_at",
    ];

    public listLogo: any = [];
    public spinner: boolean = true;
    private subscriptions: Subscription = new Subscription();

    constructor(
        public dialog: MatDialog,
        private translate: TranslateService,
        private route: ActivatedRoute,
        private titleService: Title,
        private notyfService: NotyfService,
        private logoService: LogoService,
        private excelService: ExcelService,
    ) { }

    async ngOnInit() {
        this.subscribeToRouteData();
        this.subscribeToUserStorage();
    }

    private subscribeToRouteData(): void {
        this.subscriptions.add(
            this.route.data.subscribe((data) => {
                const title = data["title"] || "Default Title";
                this.titleService.setTitle(title);
            }),
        );
    }

    private async subscribeToUserStorage() {
        this.subscriptions.add();
    }

    async ngAfterViewInit() {
        await this.getLogoAll();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public async getLogoAll(dataToSend: Object = {}): Promise<void> {
        // this.response = await handle(() => this.logoService.getLogoAll(), this.notyfService);
        // this.spinner = false;
        // this.listLogo = this.response?.data;
    }

    public exportExcel(): void {
        if (this.isListEmpty()) {
            this.showNoDataToast();
            return;
        }
        try {
            const data = this.mapUserData();
            this.excelService.exportAsExcelFile(
                data,
                this.translate.instant("logo"),
            );
        } catch (error) {
            console.error("Failed to export data", error);
        }
    }

    private isListEmpty(): boolean {
        return this.listLogo?.length === 0;
    }

    private showNoDataToast(): void {
        this.notyfService.showToast(
            "error",
            this.translate.instant("noDataInTable"),
            "toast-error",
        );
    }

    private mapUserData(): any[] {
        return this.listLogo.map((element: any) => ({
            [this.translate.instant("FormLogo.COLUMNS.0.header")]: element?.logo,
            [this.translate.instant("FormLogo.COLUMNS.1.header")]: element?.description,
            [this.translate.instant("FormLogo.COLUMNS.2.header")]: element?.createdat,
            [this.translate.instant("FormLogo.COLUMNS.3.header")]: element?.updatedat,
        }));
    }

    public openDialogLogo(type: string, logo: any): void {
        let dialogData: DialogData = { type: type, property: {} };
        dialogData.property = type === "edit" ? logo : dialogData.property;
        const dialogRef = this.dialog.open(FormLogoComponent, {
            width: "600px",
            data: dialogData,
        });

        const instance = dialogRef.componentInstance;
        instance.updateSuccessful.subscribe(() => {
            this.getLogoAll();
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

    public async handleDeleteLogo(data): Promise<void> {
        const title: any = this.translate.instant("FormLogo.DELETE_CONFIRMATION.title")
        const html: any = this.translate.instant("FormLogo.DELETE_CONFIRMATION.message", { name: data.name, status: 'enable' })
        const cancelButtonText: any = this.translate.instant("FormLogo.DELETE_CONFIRMATION.cancelButton");
        const confirmButtonText: any = this.translate.instant("FormLogo.DELETE_CONFIRMATION.confirmButton")
        const result = await Swal.fire({ ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message, ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message.title = title, ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message.html = html, ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message.cancelButtonText = cancelButtonText, ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message.confirmButtonText = confirmButtonText })
        if (result.isConfirmed) {
            const response: any = await handle(() => this.logoService.postLogoDelete(data.id), this.notyfService);
            if (response?.error) this.successHandle(response);
        }
    }

    private successHandle(response: any): void {
        this.notyfService.showToast("success", response?.message, "toast-success");
    }
}