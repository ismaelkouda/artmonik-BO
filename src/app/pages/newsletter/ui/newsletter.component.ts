import { ExcelService } from "@/shared/services/excel.service";
import { NotyfService } from "@/shared/services/notyf.service";
import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Table } from "primeng/table";
import { Subscription } from "rxjs";
import { NewsletterService } from "../data-access/newsletter.service";
import { handle } from "@/shared/functions/api.function";
import Swal, { SweetAlertOptions } from "sweetalert2";
import { FormNewsletterComponent } from "../features/form-newsletter/form-newsletter.component";
import { SWALWITHBOOTSTRAPBUTTONSPARAMS } from "@/shared/constants/swalWithBootstrapButtonsParams.constant";
interface DialogData {
    type: string;
    property: any;
}
@Component({
    selector: "app-newsletter",
    templateUrl: "./newsletter.component.html",
    styleUrls: ["./newsletter.component.scss"]
})

export class NewsletterComponent {
    public dataToSend: Object | void;
    @ViewChild("dt") dt: Table;
    onInputChange(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const value = inputElement.value;
        this.dt.filterGlobal(value, "contains");
    }
    public breadcrumbObject: any = {
        first: "FormNewsletter.BREADCRUMB.FIRST",
        second: "FormNewsletter.BREADCRUMB.SECOND",
    };
    public response: any;
    public columns = [
        {
            field: "email",
            header: "FormNewsletter.COLUMNS.0.header",
            isText: true,
            isCenter: true,
        },
        {
            field: "description",
            header: "FormNewsletter.COLUMNS.1.header",
            isText: true,
            isCenter: true,
        },
        {
            field: "created_at",
            header: "FormNewsletter.COLUMNS.2.header",
            isText: true,
            isCenter: true,
        },
        {
            field: "updated_at",
            header: "FormNewsletter.COLUMNS.3.header",
            isText: true,
            isCenter: true,
        },
    ];
    public globalFilterFieldsObject: string[] = [
        "email",
        "description",
        "created_at",
        "updated_at",
    ];

    public listNewsletter: any = [];
    public spinner: boolean = true;
    private subscriptions: Subscription = new Subscription();

    constructor(
        public dialog: MatDialog,
        private translate: TranslateService,
        private route: ActivatedRoute,
        private titleService: Title,
        private notyfService: NotyfService,
        private newsletterService: NewsletterService,
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
        await this.getNewsletterAll();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public async getNewsletterAll(dataToSend: Object = {}): Promise<void> {
        this.response = await handle(() => this.newsletterService.getNewsletterAll(), this.notyfService);
        this.spinner = false;
        this.listNewsletter = this.response?.data;
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
                this.translate.instant("newsletter"),
            );
        } catch (error) {
            console.error("Failed to export data", error);
        }
    }

    private isListEmpty(): boolean {
        return this.listNewsletter?.length === 0;
    }

    private showNoDataToast(): void {
        this.notyfService.showToast(
            "error",
            this.translate.instant("noDataInTable"),
            "toast-error",
        );
    }

    private mapUserData(): any[] {
        return this.listNewsletter.map((element: any) => ({
            [this.translate.instant("FormNewsletter.COLUMNS.0.header")]: element?.email,
            [this.translate.instant("FormNewsletter.COLUMNS.1.header")]: element?.description,
            [this.translate.instant("FormNewsletter.COLUMNS.2.header")]: element?.createdat,
            [this.translate.instant("FormNewsletter.COLUMNS.3.header")]: element?.updatedat,
        }));
    }

    public openDialogNewsletter(type: string, newsletter: any): void {
        let dialogData: DialogData = { type: type, property: {} };
        dialogData.property = type === "edit" ? newsletter : dialogData.property;
        const dialogRef = this.dialog.open(FormNewsletterComponent, {
            width: "600px",
            data: dialogData,
        });

        const instance = dialogRef.componentInstance;
        instance.updateSuccessful.subscribe(() => {
            this.getNewsletterAll();
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

    public async handleDeleteNewsletter(data): Promise<void> {
        const title: any = this.translate.instant("FormNewsletter.DELETE_CONFIRMATION.title")
        const html: any = this.translate.instant("FormNewsletter.DELETE_CONFIRMATION.message", { name: data.name, status: 'enable' })
        const cancelButtonText: any = this.translate.instant("FormNewsletter.DELETE_CONFIRMATION.cancelButton");
        const confirmButtonText: any = this.translate.instant("FormNewsletter.DELETE_CONFIRMATION.confirmButton")
        const result = await Swal.fire({ ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message, ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message.title = title, ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message.html = html, ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message.cancelButtonText = cancelButtonText, ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message.confirmButtonText = confirmButtonText })
        if (result.isConfirmed) {
            const response: any = await handle(() => this.newsletterService.postNewsletterDelete(data.id), this.notyfService);
            if (response?.error) this.successHandle(response);
        }
    }

    private successHandle(response: any): void {
        this.notyfService.showToast("success", response?.message, "toast-success");
    }
}