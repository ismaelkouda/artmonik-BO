import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { handle } from "src/app/shared/functions/api.function";
import { EvenementielService } from "../../data-access/evenementiels.service";
import { NotyfService } from "@/shared/services/notyf.service";
import { Subscription } from "rxjs";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { ExcelService } from "@/shared/services/excel.service";
import { TranslateService } from "@ngx-translate/core";
// import { EvenementielsModel } from "@/core/entities/evenementiel-model";
import { MatDialog } from "@angular/material/dialog";
import { FormEvenementielsComponent } from "../../features/evenementiels/form-evenementiels/form-evenementiels.component";
import { Table } from "primeng/table";
import Swal, { SweetAlertOptions } from "sweetalert2";
import { MANAGEMENT, SEARCH } from "@/shared/routes/routes";
import { EvenementielStateService } from "../../data-access/evenementiels/evenementiels-state.service";
import { EvenementielApiStateService } from "../../data-access/evenementiels/evenementiels-api-state.service";
import { EVENEMENTIELS, DETAILS_EVENEMENTIELS, FORM } from "../../evenementiels-routing.module";

type TYPEVIEW = "editer" | "détails" | "ajouter";
interface DialogData {
    type: string;
    property: any;
}

@Component({
    selector: 'app-evenementiels',
    templateUrl: "./evenementiels.component.html",
    styleUrls: [`./evenementiels.component.scss`]
})

export class EvenementielsComponent implements OnInit, OnDestroy {
    @ViewChild("dt") dt: Table;
    onInputChange(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const value = inputElement.value;
        this.dt.filterGlobal(value, "contains");
    }
    public breadcrumbObject: any = {
        first: "FormEvenementiel.BREADCRUMB.FIRST",
        second: "FormEvenementiel.BREADCRUMB.SECOND",
    };
    public columns = [
        {
            field: "Titre",
            header: "FormEvenementiel.COLUMNS.0.header",
            isText: true,
            isBadge: false,
        },
        {
            field: "Tags",
            header: "FormEvenementiel.COLUMNS.1.header",
            isText: true,
            isBadge: false,
        },
        {
            field: "Publié le",
            header: "FormEvenementiel.COLUMNS.2.header",
            isCenter: true,
            isText: true,
            isBadge: false,
        },
        {
            field: "Publié par",
            header: "FormEvenementiel.COLUMNS.3.header",
            isCenter: true,
            isText: true,
            isBadge: false,
        },
        {
            field: "Modifié le",
            header: "FormEvenementiel.COLUMNS.4.header",
            isCenter: true,
            isText: true,
            isBadge: false,
        },
    ];
    public globalFilterFieldsObject: string[] = [
        "title",
        "tags",
        "publie_le",
        "publie_par",
        "updated_at",
    ];
    public dataToSend: string;
    public pargination = null;
    private response: any;
    public spinner: boolean = false;
    public listEvenementiels: Array<Object> = [];
    private subscriptions: Subscription = new Subscription();
    private subscriptionListEvenementiels: Subscription;
    public selectedEvenementiel: Object;

    constructor(private evenementielService: EvenementielService, private notyfService: NotyfService,
        private route: ActivatedRoute, private titleService: Title,
        private translate: TranslateService, private excelService: ExcelService,
        public dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute,
        private evenementielStateService: EvenementielStateService, private evenementielApiStateService: EvenementielApiStateService) {
            this.router.events.subscribe((event) => {
                if (event instanceof NavigationEnd) {
                    console.log('event', event.url)
                    if (!event.url.includes(`/${MANAGEMENT}/${EVENEMENTIELS}`)) {
                        this.evenementielStateService.removeAllEvenementielState();
                    }
                }
            });
        }


    ngOnInit(): void {
        this.subscribeToRouteData();
        this.subscribeToEvenementielsStorage();
    }

    async ngAfterViewInit() {
        if (this.evenementielStateService.getTableItemSelectedState()) {
            this.listEvenementiels = this.evenementielStateService.getTableState();
            this.pargination = this.evenementielStateService.getParginateState();
        } else {
            this.subscriptionListEvenementiels = this.evenementielApiStateService.setListEvenementiels().subscribe(() => {
                this.getEvenementielsAll();
            });
            // this.getEvenementielsAll();
            this.spinner = true;
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        if (this.subscriptionListEvenementiels) this.subscriptionListEvenementiels.unsubscribe();
    }

    private subscribeToRouteData(): void {
        this.subscriptions.add(
            this.route.data.subscribe((data) => {
                const title = data["title"] || "Default Title";
                this.titleService.setTitle(title);
            }),
        );
    }

    private async subscribeToEvenementielsStorage() {
        this.subscriptions.add();
    }

    async getEvenementielsAll(dataToSend = {}): Promise<any> {
        this.response = await handle(() => this.evenementielService.getEvenementielsAll(), this.notyfService);
        this.listEvenementiels = this.response?.data;
        this.spinner = false;
    }

    // public openDialogEvenementiels(type: string, data: any): void {
    //     let dialogData: DialogData = { type: type, property: {} };
    //     dialogData.property = type === "edit" ? data : dialogData.property;
    //     const dialogRef = this.dialog.open(FormEvenementielComponent, {
    //         width: "600px",
    //         data: dialogData,
    //     });

    //     const instance = dialogRef.componentInstance;
    //     instance.updateSuccessful.subscribe(() => {
    //         this.getEvenementielsAll();
    //     });
    // }

    // public onGoToAdd(): void {
    //     this.showModal = true;
    // }

    // public onCloseModalEvenementiels(): void {
    //     this.showModal = false;
    // }

    public exportExcel(): void {
        if (this.isListEmpty()) {
            this.showNoDataToast();
            return;
        }
        try {
            const data = this.mapEvenementielsData();
            this.excelService.exportAsExcelFile(
                data,
                this.translate.instant("evenementielList"),
            );
        } catch (error) {
            console.error("Failed to export data", error);
        }
    }

    private isListEmpty(): boolean {
        return this.listEvenementiels?.length === 0;
    }

    private showNoDataToast(): void {
        this.notyfService.showToast(
            "error",
            this.translate.instant("noDataInTable"),
            "toast-error",
        );
    }

    private mapEvenementielsData(): any[] {
        return this.listEvenementiels.map((element: any) => ({
            [this.translate.instant("FormEvenementiel.COLUMNS.0.header")]: element?.title,
            [this.translate.instant("FormEvenementiel.COLUMNS.1.header")]: element?.tags,
            [this.translate.instant("FormEvenementiel.COLUMNS.2.header")]: element?.publie_le,
            [this.translate.instant("FormEvenementiel.COLUMNS.3.header")]: element?.publie_par,
            [this.translate.instant("FormEvenementiel.COLUMNS.4.header")]: element?.updated_at
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

    // public async getEvenementielsAction(evenementiel: Object): Promise<any> {
    //     return handleDeleteCatecoryCampaigns(
    //       () => this.campService.deleteCampaignCategory(categoryId),
    //       this.notyfService
    //     );
    // }

    public async handleDelete(data: any): Promise<void> {
        const swalOptions = this.getSwalDeleteOptions(`${data.title}`);
        const result = await Swal.fire(swalOptions);
        if (result.isConfirmed) {

            await this.confirmDeleteEvenementiels(data);

        }
    }

    public getSwalDeleteOptions(title: string): SweetAlertOptions {
        return {
            title: this.translate.instant("FormEvenementiel.DELETE_CONFIRMATION.title"),
            html: this.translate.instant("FormEvenementiel.DELETE_CONFIRMATION.message", {
                title: title,
            }),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#569C5B",
            cancelButtonColor: "#dc3545",
            cancelButtonText: this.translate.instant(
                "FormEvenementiel.DELETE_CONFIRMATION.cancelButton",
            ),
            confirmButtonText: this.translate.instant(
                "FormEvenementiel.DELETE_CONFIRMATION.confirmButton",
            ),
        };
    }

    public async confirmDeleteEvenementiels(data): Promise<void> {
        try {
            this.response = await handle(() => this.evenementielService.postEvenementielsDelete({id: data.id}), this.notyfService);
            if (!this.response?.error) {
                // console.log("user deleted successfully");

                this.getEvenementielsAll();
            }
        } catch (err) {
            throw err;
        }
    }

    public async handleUpdateStatus(data): Promise<void> {
        const swalOptions = this.getSwalUpdateStatusOptions(`${data.title}`);
        const result = await Swal.fire(swalOptions);
        if (result.isConfirmed) {

            await this.confirmUpdateStatusEvenementielsMode(data);
        }
    }

    public async confirmUpdateStatusEvenementielsMode(data): Promise<void> {
        // await handleUpdateCaterogyStatusMode(
        //     () => this.campService.CampaignCategorieStatus(data),
        //     this.notyfService,
        // );
        this.getEvenementielsAll();
    }

    public getSwalUpdateStatusOptions(title: string): SweetAlertOptions {
        return {
            title: this.translate.instant(
                "FormEvenementiel.UPDATE_CONFIRMATION_STATUS.title",
            ),
            html: this.translate.instant(
                "FormEvenementiel.UPDATE_CONFIRMATION_STATUS.message",
                {
                    title: title,
                },
            ),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#569C5B",
            cancelButtonColor: "#dc3545",
            cancelButtonText: this.translate.instant(
                "FormEvenementiel.UPDATE_CONFIRMATION_STATUS.cancelButton",
            ),
            confirmButtonText: this.translate.instant(
                "FormEvenementiel.UPDATE_CONFIRMATION_STATUS.confirmButton",
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

    public navigateByUrl(data: { data: null | Object, paramUrl: TYPEVIEW }): any {
        if (data.paramUrl === "ajouter") {
            this.router.navigate([FORM+"/"+SEARCH], { relativeTo: this.activatedRoute, queryParams: { view: data.paramUrl } });
        } else if (data.paramUrl === "editer" || data.paramUrl === "détails") {
            this.router.navigate([FORM+"/"+SEARCH], { relativeTo: this.activatedRoute, queryParams: { view: data.paramUrl, page: this.pargination?.currentPage ?? null, filter: this.dataToSend ?? null, id: data.data["id"] } });
        }
        //  else if (data.paramUrl === "détails") {
        //     this.router.navigate([DETAILS_EVENEMENTIELS+"/"+SEARCH], { relativeTo: this.activatedRoute, queryParams: { view: data.paramUrl, page: this.pargination?.currentPage ?? null, filter: this.dataToSend ?? null, id: data.data["id"] } });
        // }
    }

}
