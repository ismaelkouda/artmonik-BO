import { ArtistService } from "@/pages/artist/data-access/artist.service";
import { ArtistStateService } from "@/pages/artist/data-access/artist/artist-state.service";
import { handle } from "@/shared/functions/api.function";
import { ARTISTS, MANAGEMENT } from "@/shared/routes/routes";
import { NotyfService } from "@/shared/services/notyf.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

type TYPEVIEW = "détails";

@Component({
    selector: "app-details-artists",
    templateUrl: "./details-artists.component.html",
    styleUrls: [`./details-artists.component.scss`]
})

export class DetailsArtistsComponent implements OnInit {
    public view: TYPEVIEW;
    public page: number;
    public id: number;
    public filter: Object;
    private listArtists: Array<Object>;
    public artistSelected: Object;
    public breadcrumbObject: any = {
        first: "FormArtist.BREADCRUMB.FIRST",
        second: "FormArtist.BREADCRUMB.SECOND",
    };
    public indexTabPanelActive: number = 0;

    constructor(private router: Router, private fb: FormBuilder, private notyfService: NotyfService,
        private activatedRoute: ActivatedRoute, private artistStateService: ArtistStateService,
        private artistService: ArtistService, private translate: TranslateService
    ) {}

    ngOnInit(): void {
        this.getParamsInUrl();
    }


    private getParamsInUrl(): void {
        this.activatedRoute.queryParams.subscribe((params: Object) => {
            this.view = params?.["view"];
            this.page = params?.["page"];
            this.id = params?.["id"];
            this.filter = this.artistStateService.parseQueryStringToObject(params?.["filter"]);
        });
        this.getArtistsAll(this.filter);
    }

    async getArtistsAll(dataToSend = {}): Promise<any> {
        console.log('dataToSend', dataToSend)
        const response: any = await handle(() => this.artistService.getArtistsAll(), this.notyfService);
        this.handleSuccessfulPageCallback(response);
    }

    private handleSuccessfulPageCallback(response: any): void {
        this.listArtists = response?.data;
        this.getArtistSelected(this.listArtists);
    }

    private getArtistSelected(listArtists: Array<Object>): void {
        this.artistSelected = listArtists.find((artist) => artist?.["id"] == this.id);
        if(this.artistSelected) this.getTitlePage();
    }
    public getTitlePage(): string {
        const artistName = this.artistSelected?.["nom_complet"] || "...";
        return this.translate.instant("FormArtist.BODY_TITLE_DETAILS").replace("{libelle}", `[${artistName}]`);
    }
    public closeInterface(): void {
        this.router.navigate([`${MANAGEMENT}/${ARTISTS}`]);
    }
}