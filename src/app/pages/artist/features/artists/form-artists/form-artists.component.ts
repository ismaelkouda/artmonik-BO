import { Component, EventEmitter, HostBinding, Inject, Input, OnInit, Output } from "@angular/core";
import { handle } from "../../../../../shared/functions/api.function";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ngxLoadingAnimationTypes } from "ngx-loading";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { NotyfService } from "@/shared/services/notyf.service";
import { ArtistService } from "@/pages/artist/data-access/artist.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ArtistStateService } from "@/pages/artist/data-access/artist/artist-state.service";
import { FormatFormData } from "@/shared/functions/formatFormData.function";
import { ARTISTS } from "@/pages/artist/artists-routing.module";
import { MANAGEMENT } from "@/shared/routes/routes";

type TYPEVIEW = "editer" | "détails" | "ajouter";

@Component({
    selector: 'app-form-artists',
    templateUrl: './form-artists.component.html',
    styleUrls: [`./form-artists.component.scss`]
})

export class FormArtistsComponent {
    public breadcrumbObject: any = {
        first: "FormArtist.BREADCRUMB.FIRST",
        second: "FormArtist.BREADCRUMB.SECOND",
    };
    public view: TYPEVIEW;
    public page: number;
    public id: number;
    public filter: Object;

    public form: FormGroup;
    public listArtists: Array<Object>;
    public artistSelected: Object;

    public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
    constructor(private activatedRoute: ActivatedRoute, private artistStateService: ArtistStateService,
        private artistService: ArtistService, private translate: TranslateService,
        private notyfService: NotyfService, private router: Router) { }

    async ngOnInit() {
        this.getParamsInUrl();
    }


    private getParamsInUrl(): void {
        this.activatedRoute.queryParams.subscribe((params: Object) => {
            this.view = params?.["view"];
            this.page = params?.["page"];
            this.id = params?.["id"];
            this.filter = this.artistStateService.parseQueryStringToObject(params?.["filter"]);
        });
        if(this.view !== "ajouter")  this.getArtistsAll(this.filter);
    }

    async getArtistsAll(dataToSend = {}): Promise<any> {
        const response: any = await handle(() => this.artistService.getArtistsAll(), this.notyfService);
        this.handleSuccessfulPageCallback(response);
    }

    private handleSuccessfulPageCallback(response: any): void {
        this.listArtists = response?.data;
        this.getArtistSelected(this.listArtists)
    }

    private getArtistSelected(listArtists: Array<Object>): void {
        this.artistSelected = listArtists.find((artist) => artist?.["id"] == this.id);
        if(this.artistSelected) this.getTitleForm();
    }

    public getTitleForm(): string {
        const titles = {
            ajouter: "FormArtist.TITLE_MODAL.STORE",
            editer: "FormArtist.TITLE_MODAL.UPDATE"
        };
    
        const artistName = this.artistSelected?.["nom_complet"] || "...";
        const titleKey = this.view === "ajouter" ? "ajouter" : "editer";
    
        return this.translate.instant(titles[titleKey]).replace("{libelle}", `[${artistName}]`);
    }

    public closeInterface(): void {
        this.router.navigate([`${MANAGEMENT}/${ARTISTS}`]);
    }
}
