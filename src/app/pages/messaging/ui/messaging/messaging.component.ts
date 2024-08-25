import { ExcelService } from "@/shared/services/excel.service";
import { NotyfService } from "@/shared/services/notyf.service";
import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Table } from "primeng/table";
import { Subscription } from "rxjs";
import { MessagingService } from "../../data-access/messaging.service";
import { handle } from "@/shared/functions/api.function";
import Swal, { SweetAlertOptions } from "sweetalert2";
import { FormMessagingComponent } from "../../features/form-messaging/form-messaging.component";
import { SWALWITHBOOTSTRAPBUTTONSPARAMS } from "@/shared/constants/swalWithBootstrapButtonsParams.constant";
interface DialogData {
    type: string;
    property: any;
}
@Component({
    selector: "app-messaging",
    templateUrl: "./messaging.component.html",
    styleUrls: ["./messaging.component.scss"]
})

export class MessagingComponent {
    public dataToSend: Object | void;
    @ViewChild("dt") dt: Table;
    onInputChange(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const value = inputElement.value;
        this.dt.filterGlobal(value, "contains");
    }
    public breadcrumbObject: any = {
        first: "FormMessaging.BREADCRUMB.FIRST",
        second: "FormMessaging.BREADCRUMB.SECOND",
    };
    public response: any;
    public columns = [
        {
            field: "nom",
            header: "FormMessaging.COLUMNS.0.header",
            isText: true,
            isCenter: true,
        },
        {
            field: "prenoms",
            header: "FormMessaging.COLUMNS.1.header",
            isText: true,
            isCenter: true,
        },
        {
            field: "email",
            header: "FormMessaging.COLUMNS.2.header",
            isText: true,
            isCenter: true,
        },
        {
            field: "telephone",
            header: "FormMessaging.COLUMNS.3.header",
            isText: true,
            isCenter: true,
        },
        {
            field: "message",
            header: "FormMessaging.COLUMNS.4.header",
            isText: true,
            isCenter: true,
        },
        {
            field: "created_at",
            header: "FormMessaging.COLUMNS.5.header",
            isText: true,
            isCenter: true,
        },
        {
            field: "updated_at",
            header: "FormMessaging.COLUMNS.6.header",
            isText: true,
            isCenter: true,
        },
    ];
    public globalFilterFieldsObject: string[] = [
        "nom",
        "prenoms",
        "email",
        "telephone",
        "message",
        "created_at",
        "updated_at",
    ];

    public listMessaging: any = [];
    public spinner: boolean = true;
    private subscriptions: Subscription = new Subscription();

    constructor(
        public dialog: MatDialog,
        private translate: TranslateService,
        private route: ActivatedRoute,
        private titleService: Title,
        private notyfService: NotyfService,
        private messagingService: MessagingService,
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
        await this.getMessagingAll();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public async getMessagingAll(dataToSend: Object = {}): Promise<void> {
        this.response = await handle(() => this.messagingService.getMessagingAll(), this.notyfService);
        this.spinner = false;
        this.listMessaging = this.response?.data;
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
                this.translate.instant("messaging"),
            );
        } catch (error) {
            console.error("Failed to export data", error);
        }
    }

    private isListEmpty(): boolean {
        return this.listMessaging?.length === 0;
    }

    private showNoDataToast(): void {
        this.notyfService.showToast(
            "error",
            this.translate.instant("noDataInTable"),
            "toast-error",
        );
    }

    private mapUserData(): any[] {
        return this.listMessaging.map((element: any) => ({
            [this.translate.instant("FormMessaging.COLUMNS.0.header")]: element?.nom,
            [this.translate.instant("FormMessaging.COLUMNS.1.header")]: element?.prenoms,
            [this.translate.instant("FormMessaging.COLUMNS.2.header")]: element?.email,
            [this.translate.instant("FormMessaging.COLUMNS.3.header")]: element?.telephone,
            [this.translate.instant("FormMessaging.COLUMNS.4.header")]: element?.message,
            [this.translate.instant("FormMessaging.COLUMNS.5.header")]: element?.createdat,
            [this.translate.instant("FormMessaging.COLUMNS.6.header")]: element?.updatedat,
        }));
    }

    public openDialogMessaging(type: string, messaging: any): void {
        let dialogData: DialogData = { type: type, property: {} };
        dialogData.property = type === "edit" ? messaging : dialogData.property;
        const dialogRef = this.dialog.open(FormMessagingComponent, {
            width: "600px",
            data: dialogData,
        });

        const instance = dialogRef.componentInstance;
        instance.updateSuccessful.subscribe(() => {
            this.getMessagingAll();
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

    public async handleDeleteMessaging(data): Promise<void> {
        const title: any = this.translate.instant("FormMessaging.DELETE_CONFIRMATION.title")
        const html: any = this.translate.instant("FormMessaging.DELETE_CONFIRMATION.message", { name: data.name, status: 'enable' })
        const cancelButtonText: any = this.translate.instant("FormMessaging.DELETE_CONFIRMATION.cancelButton");
        const confirmButtonText: any = this.translate.instant("FormMessaging.DELETE_CONFIRMATION.confirmButton")
        const result = await Swal.fire({ ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message, ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message.title = title, ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message.html = html, ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message.cancelButtonText = cancelButtonText, ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message.confirmButtonText = confirmButtonText })
        if (result.isConfirmed) {
            const response: any = await handle(() => this.messagingService.postMessagingDelete(data.id), this.notyfService);
            if (response?.error) this.successHandle(response);
        }
    }

    private successHandle(response: any): void {
        this.notyfService.showToast("success", response?.message, "toast-success");
    }
}