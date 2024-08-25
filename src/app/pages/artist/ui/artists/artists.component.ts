import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { handle } from "src/app/shared/functions/api.function";
import { ArtistService } from "../../data-access/artist.service";
import { NotyfService } from "@/shared/services/notyf.service";
import { Subscription } from "rxjs";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { ExcelService } from "@/shared/services/excel.service";
import { TranslateService } from "@ngx-translate/core";
// import { ArtistModel } from "@/core/entities/artist-model";
import { MatDialog } from "@angular/material/dialog";
import { FormArtistsComponent } from "../../features/artists/form-artists/form-artists.component";
import { Table } from "primeng/table";
import Swal, { SweetAlertOptions } from "sweetalert2";
import { MANAGEMENT, SEARCH } from "@/shared/routes/routes";
import { ArtistStateService } from "../../data-access/artist/artist-state.service";
import { ArtistApiStateService } from "../../data-access/artist/artist-api-state.service";
import { ARTISTS, DETAILS_ARTISTS, FORM } from "../../artists-routing.module";

type TYPEVIEW = "editer" | "détails" | "ajouter";
interface DialogData {
    type: string;
    property: any;
}

@Component({
    selector: 'app-artists',
    templateUrl: "./artists.component.html",
    styleUrls: [`./artists.component.scss`]
})

export class ArtistsComponent implements OnInit, OnDestroy {
    @ViewChild("dt") dt: Table;
    onInputChange(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const value = inputElement.value;
        this.dt.filterGlobal(value, "contains");
    }
    public breadcrumbObject: any = {
        first: "FormArtist.BREADCRUMB.FIRST",
        second: "FormArtist.BREADCRUMB.SECOND",
    };
    public columns = [
        {
            field: "nom",
            header: "FormArtist.COLUMNS.0.header",
            isText: true
        },
        {
            field: "prenoms",
            header: "FormArtist.COLUMNS.1.header",
            isText: true
        },
        {
            field: "email",
            header: "FormArtist.COLUMNS.2.header",
            isText: true
        },
        {
            field: "telephone",
            header: "FormArtist.COLUMNS.3.header",
            isText: true
        },
        {
            field: "categorie",
            header: "FormArtist.COLUMNS.4.header",
            isText: true
        },
        {
            field: "image",
            header: "FormArtist.COLUMNS.5.header",
            isCenter: true,
            isBadge: true,
        },
        {
            field: "created_at",
            header: "FormArtist.COLUMNS.6.header",
            isText: true,
            isCenter: true,
        },
        {
            field: "updated_at",
            header: "FormArtist.COLUMNS.7.header",
            isText: true,
            isCenter: true,
        },
    ];
    public globalFilterFieldsObject: string[] = [
        "nom",
        "prenoms",
        "email",
        "telephone",
        "categorie",
        "image",
        "created_at",
        "updated_at",
    ];
    public dataToSend: string;
    public pargination = null;
    private response: any;
    public spinner: boolean = false;
    public listArtists: Array<Object> = [
        {nomComplet: "kouda soumaila", email: "azerty120@gmail.com", telephone: "0125648985", categorie: "", image: "", created_at: "", updated_at: "", videos_link: ["test1", "test2"]}
    ];
    private subscriptions: Subscription = new Subscription();
    private subscriptionListArtist: Subscription;
    public selectedArtist: Object;

    constructor(private artistService: ArtistService, private notyfService: NotyfService,
        private route: ActivatedRoute, private titleService: Title,
        private translate: TranslateService, private excelService: ExcelService,
        public dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute,
        private artistStateService: ArtistStateService, private artistApiStateService: ArtistApiStateService) {
            this.router.events.subscribe((event) => {
                if (event instanceof NavigationEnd) {
                    console.log('event', event.url)
                    if (!event.url.includes(`/${MANAGEMENT}/${ARTISTS}`)) {
                        this.artistStateService.removeAllDemandeIntegrationState();
                    }
                }
            });
        }


    ngOnInit(): void {
        this.subscribeToRouteData();
        this.subscribeToArtistStorage();
    }

    async ngAfterViewInit() {
        if (this.artistStateService.getTableItemSelectedState()) {
            this.listArtists = this.artistStateService.getTableState();
            this.pargination = this.artistStateService.getParginateState();
        } else {
            this.subscriptionListArtist = this.artistApiStateService.setListArtist().subscribe(() => {
                this.getArtistsAll();
            });
            // this.getArtistsAll();
            this.spinner = true;
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        if (this.subscriptionListArtist) this.subscriptionListArtist.unsubscribe();
    }

    private subscribeToRouteData(): void {
        this.subscriptions.add(
            this.route.data.subscribe((data) => {
                const title = data["title"] || "Default Title";
                this.titleService.setTitle(title);
            }),
        );
    }

    private async subscribeToArtistStorage() {
        this.subscriptions.add();
    }

    async getArtistsAll(dataToSend = {}): Promise<any> {
        this.response = await handle(() => this.artistService.getArtistsAll(), this.notyfService);
        this.listArtists = this.response?.data;
        this.spinner = false;
    }

    // public openDialogArtist(type: string, data: any): void {
    //     let dialogData: DialogData = { type: type, property: {} };
    //     dialogData.property = type === "edit" ? data : dialogData.property;
    //     const dialogRef = this.dialog.open(FormArtistsComponent, {
    //         width: "600px",
    //         data: dialogData,
    //     });

    //     const instance = dialogRef.componentInstance;
    //     instance.updateSuccessful.subscribe(() => {
    //         this.getArtistsAll();
    //     });
    // }

    // public onGoToAdd(): void {
    //     this.showModal = true;
    // }

    // public onCloseModalArtist(): void {
    //     this.showModal = false;
    // }

    public exportExcel(): void {
        if (this.isListEmpty()) {
            this.showNoDataToast();
            return;
        }
        try {
            const data = this.mapArtistData();
            this.excelService.exportAsExcelFile(
                data,
                this.translate.instant("artistList"),
            );
        } catch (error) {
            console.error("Failed to export data", error);
        }
    }

    private isListEmpty(): boolean {
        return this.listArtists?.length === 0;
    }

    private showNoDataToast(): void {
        this.notyfService.showToast(
            "error",
            this.translate.instant("noDataInTable"),
            "toast-error",
        );
    }

    private mapArtistData(): any[] {
        return this.listArtists.map((element: any) => ({
            [this.translate.instant("FormArtist.COLUMNS.0.header")]: element?.nom,
            [this.translate.instant("FormArtist.COLUMNS.1.header")]: element?.prenom,
            [this.translate.instant("FormArtist.COLUMNS.2.header")]: element?.email,
            [this.translate.instant("FormArtist.COLUMNS.3.header")]: element?.telephone,
            [this.translate.instant("FormArtist.COLUMNS.4.header")]: element?.categorie,
            [this.translate.instant("FormArtist.COLUMNS.5.header")]: element?.image,
            [this.translate.instant("FormArtist.COLUMNS.6.header")]: element?.createdat,
            [this.translate.instant("FormArtist.COLUMNS.7.header")]: element?.updatedat,
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

    // public async getArtistAction(artist: Object): Promise<any> {
    //     return handleDeleteCatecoryCampaigns(
    //       () => this.campService.deleteCampaignCategory(categoryId),
    //       this.notyfService
    //     );
    // }

    public async handleDelete(data: any): Promise<void> {
        const swalOptions = this.getSwalDeleteOptions(`${data.nom} ${data.prenoms}`);
        const result = await Swal.fire(swalOptions);
        if (result.isConfirmed) {

            await this.confirmDeleteArtist(data);

        }
    }

    public getSwalDeleteOptions(title: string): SweetAlertOptions {
        return {
            title: this.translate.instant("FormArtist.DELETE_CONFIRMATION.title"),
            html: this.translate.instant("FormArtist.DELETE_CONFIRMATION.message", {
                title: title,
            }),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#569C5B",
            cancelButtonColor: "#dc3545",
            cancelButtonText: this.translate.instant(
                "FormArtist.DELETE_CONFIRMATION.cancelButton",
            ),
            confirmButtonText: this.translate.instant(
                "FormArtist.DELETE_CONFIRMATION.confirmButton",
            ),
        };
    }

    public async confirmDeleteArtist(data): Promise<void> {
        try {
            this.response = await handle(() => this.artistService.postArtistsDelete({id: data.id}), this.notyfService);
            if (!this.response?.error) {
                // console.log("user deleted successfully");

                this.getArtistsAll();
            }
        } catch (err) {
            throw err;
        }
    }

    public async handleUpdateStatus(data): Promise<void> {
        const swalOptions = this.getSwalUpdateStatusOptions(`${data.title}`);
        const result = await Swal.fire(swalOptions);
        if (result.isConfirmed) {

            await this.confirmUpdateStatusArtistMode(data);
        }
    }

    public async confirmUpdateStatusArtistMode(data): Promise<void> {
        // await handleUpdateCaterogyStatusMode(
        //     () => this.campService.CampaignCategorieStatus(data),
        //     this.notyfService,
        // );
        this.getArtistsAll();
    }

    public getSwalUpdateStatusOptions(title: string): SweetAlertOptions {
        return {
            title: this.translate.instant(
                "FormArtist.UPDATE_CONFIRMATION_STATUS.title",
            ),
            html: this.translate.instant(
                "FormArtist.UPDATE_CONFIRMATION_STATUS.message",
                {
                    title: title,
                },
            ),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#569C5B",
            cancelButtonColor: "#dc3545",
            cancelButtonText: this.translate.instant(
                "FormArtist.UPDATE_CONFIRMATION_STATUS.cancelButton",
            ),
            confirmButtonText: this.translate.instant(
                "FormArtist.UPDATE_CONFIRMATION_STATUS.confirmButton",
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
        } else if (data.paramUrl === "editer") {
            this.router.navigate([FORM+"/"+SEARCH], { relativeTo: this.activatedRoute, queryParams: { view: data.paramUrl, page: this.pargination?.currentPage ?? null, filter: this.dataToSend ?? null, id: data.data["id"] } });
        } else if (data.paramUrl === "détails") {
            this.router.navigate([DETAILS_ARTISTS+"/"+SEARCH], { relativeTo: this.activatedRoute, queryParams: { view: data.paramUrl, page: this.pargination?.currentPage ?? null, filter: this.dataToSend ?? null, id: data.data["id"] } });
        }
    }

}
