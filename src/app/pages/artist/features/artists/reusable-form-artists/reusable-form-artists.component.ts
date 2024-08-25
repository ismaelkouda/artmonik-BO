import { ArtistService } from "@/pages/artist/data-access/artist.service";
import { ArtistStateService } from "@/pages/artist/data-access/artist/artist-state.service";
import { handle } from "@/shared/functions/api.function";
import { FormatFormData } from "@/shared/functions/formatFormData.function";
import { ARTISTS, MANAGEMENT } from "@/shared/routes/routes";
import { NotyfService } from "@/shared/services/notyf.service";
import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

type TYPEVIEW = "editer" | "détails" | "ajouter";
interface Artist {
    id?: number;
    prenoms?: string;
    email?: string;
    categorie_id?: number;
    image?: string;
    titre?: string;
    biographie?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    videos_link?: string[];
    spotify?: string;
    deezer?: string;
    apple_music?: string;
    napster?: string;
    itunes_store?: string;
}
@Component({
    selector: "app-reusable-form-artists",
    templateUrl: "./reusable-form-artists.component.html",
    styleUrls: [`./reusable-form-artists.component.scss`]
})

export class ReusableFormArtistsComponent implements OnInit {
    @Input() public view: TYPEVIEW;
    @Input() public page: number;
    @Input() public id: number;
    @Input() public filter: Object;
    @Input() public artistSelected: Object;
    public listCategoryArtists: Array<Object>;
    public form: FormGroup;
    private selectedFile: File | null = null;
    private imagePreview: string | ArrayBuffer | null = null;
    public fileName: string;
    public FieldsetInfosIdentificationFormInputs1: any[] = [
        {
            label: "FormArtist.NOM_COMPLET.LIBELLE",
            placeholder: "FormArtist.NOM_COMPLET.PLACEHOLDER",
            name: "nom_complet",
            type: "text",
            column: '',
            required: "FormArtist.NOM_COMPLET.IS_REQUIRED",
        },
        {
            label: "FormArtist.EMAIL.LIBELLE",
            placeholder: "FormArtist.EMAIL.PLACEHOLDER",
            name: "email",
            type: "email",
            column: '',
            required: "FormArtist.EMAIL.IS_REQUIRED",
        },
        {
            label: "FormArtist.CATEGORIE.LIBELLE",
            placeholder: "FormArtist.CATEGORIE.PLACEHOLDER",
            name: "category_id",
            type: "select",
            column: '',
            required: "FormArtist.CATEGORIE.IS_REQUIRED",
            options: "listCategoryArtists",
            optionLabel: "name",
            filterBy: "name",
            optionValue: "id",
        },
        {
            label: "FormArtist.IMAGE.LIBELLE",
            placeholder: "FormArtist.IMAGE.PLACEHOLDER",
            name: "image",
            type: "file",
            column: '',
            required: "FormArtist.IMAGE.IS_REQUIRED",
        }
    ];
    public FieldsetInfosIdentificationFormInputs2: any[] = [
        {
            label: "FormArtist.TITRE.LIBELLE",
            placeholder: "FormArtist.TITRE.PLACEHOLDER",
            name: "titre",
            type: "text",
            column: 12,
            required: "FormArtist.TITRE.IS_REQUIRED",
        },
        {
            label: "FormArtist.BIOGRAPHIE.LIBELLE",
            placeholder: "FormArtist.BIOGRAPHIE.PLACEHOLDER",
            name: "biographie",
            type: "edit",
            column: 12,
            rows: 3,
            required: "FormArtist.BIOGRAPHIE.IS_REQUIRED",
        }
    ];
    public FieldsetInfosReseauxSociauxFormInputs: any[] = [
        {
            label: "FormArtist.FACEBOOK.LIBELLE",
            placeholder: "FormArtist.FACEBOOK.PLACEHOLDER",
            name: "facebook",
            type: "text",
            column: 3,
            required: "FormArtist.FACEBOOK.IS_REQUIRED",
        },
        {
            label: "FormArtist.TWITTER.LIBELLE",
            placeholder: "FormArtist.TWITTER.PLACEHOLDER",
            name: "twitter",
            type: "text",
            column: 3,
            required: "FormArtist.TWITTER.IS_REQUIRED",
        },
        {
            label: "FormArtist.INSTAGRAM.LIBELLE",
            placeholder: "FormArtist.INSTAGRAM.PLACEHOLDER",
            name: "instagram",
            type: "text",
            column: 3,
            required: "FormArtist.INSTAGRAM.IS_REQUIRED",
        },
        {
            label: "FormArtist.YOUTUBE.LIBELLE",
            placeholder: "FormArtist.YOUTUBE.PLACEHOLDER",
            name: "youtube",
            type: "text",
            column: 3,
            required: "FormArtist.YOUTUBE.IS_REQUIRED",
        },
    ];
    public FieldsetInfosLinksVideosFormInputs: any[] = [
        {
            label: "FormArtist.VIDEOS_LINK.LIBELLE",
            placeholder: "FormArtist.VIDEOS_LINK.PLACEHOLDER",
            name: "videos_link",
            type: "textarea",
            column: 12,
            required: "FormArtist.VIDEOS_LINK.IS_REQUIRED",
        }
    ];
    public FieldsetInfosLiensEcouteFormInputs: any[] = [
        {
            label: "FormArtist.SPOTIFY.LIBELLE",
            placeholder: "FormArtist.SPOTIFY.PLACEHOLDER",
            name: "spotify",
            type: "text",
            column: 3,
            required: "FormArtist.SPOTIFY.IS_REQUIRED",
        },
        {
            label: "FormArtist.DEEZER.LIBELLE",
            placeholder: "FormArtist.DEEZER.PLACEHOLDER",
            name: "deezer",
            type: "text",
            column: 3,
            required: "FormArtist.DEEZER.IS_REQUIRED",
        },
        {
            label: "FormArtist.APPLE_MUSIC.LIBELLE",
            placeholder: "FormArtist.APPLE_MUSIC.PLACEHOLDER",
            name: "apple_music",
            type: "text",
            column: 3,
            required: "FormArtist.APPLE_MUSIC.IS_REQUIRED",
        },
        {
            label: "FormArtist.NAPSTER.LIBELLE",
            placeholder: "FormArtist.NAPSTER.PLACEHOLDER",
            name: "napster",
            type: "text",
            column: 3,
            required: "FormArtist.NAPSTER.IS_REQUIRED",
        },
        {
            label: "FormArtist.ITUNES_STORE.LIBELLE",
            placeholder: "FormArtist.ITUNES_STORE.PLACEHOLDER",
            name: "itunes_store",
            type: "text",
            column: 3,
            required: "FormArtist.ITUNES_STORE.IS_REQUIRED",
        },
    ];

    constructor(private fb: FormBuilder, private artistService: ArtistService,
        private notyfService: NotyfService, private router: Router, private translate: TranslateService,) { }

    ngOnInit(): void {
        this.initForm();
        if (this.view === "ajouter") {
            this.getCategoryArtistsAll();
        } else if (this.view === "détails" || this.view === "editer") {
            this.patchValueForm(this.artistSelected);
            if (this.view === "editer") {
                this.getCategoryArtistsAll();
            }
            if (this.view === "détails") {
                this.form.disable();
            }
        }
    }

    async getCategoryArtistsAll(dataToSend = {}): Promise<any> {
        const response: any = await handle(() => this.artistService.getArtistsCategoriesAll(), this.notyfService);
        if (response.code === 200) this.handleSuccessfulGetCategoryArtistsAll(response);
    }

    handleSuccessfulGetCategoryArtistsAll(response: any) {
        this.listCategoryArtists = response?.data;
    }

    private initForm(): void {
        this.form = this.fb.group({
            id: this.createFormControl(null),
            nom_complet: this.createFormControl(null, Validators.required),
            email: this.createFormControl(null, Validators.required),
            category_id: this.createFormControl(null, Validators.required),
            image: this.createFormControl(null, Validators.required),
            titre: this.createFormControl(null, Validators.required),
            biographie: this.createFormControl(null, Validators.required),
            facebook: this.createFormControl(null),
            twitter: this.createFormControl(null),
            instagram: this.createFormControl(null),
            youtube: this.createFormControl(null),
            videos_link: this.fb.array([
                this.fb.control(null, Validators.required)
            ]),
            spotify: this.createFormControl(null),
            deezer: this.createFormControl(null),
            apple_music: this.createFormControl(null),
            napster: this.createFormControl(null),
            itunes_store: this.createFormControl(null)
        });
    }

    private createFormControl(initialValue: any, validator: Validators | null = null): any {
        return [{ value: initialValue, disabled: false }, validator].filter(v => v !== null);
    }

    get videosLink(): FormArray {
        return this.form.get('videos_link') as FormArray;
    }

    addVideoLink(url: string = ''): void {
        this.videosLink.push(this.fb.control(url, Validators.required));
    }

    removeVideoLink(index: number): void {
        if (this.videosLink.length > 1) {
            this.videosLink.removeAt(index);
        }
    }

    private patchValueForm(artistSelected: Artist): void {
        this.form.patchValue({
            id: artistSelected?.['id'],
            nom_complet: artistSelected?.['prenoms'],
            email: artistSelected?.['email'],
            category_id: this.view === "editer" ? artistSelected?.['categorie_id'] : artistSelected?.['categorie_id'],
            image: artistSelected?.['image'],
            titre: artistSelected?.['titre'],
            biographie: artistSelected?.['biographie'],
            facebook: artistSelected?.['facebook'],
            twitter: artistSelected?.['twitter'],
            instagram: artistSelected?.['instagram'],
            youtube: artistSelected?.['youtube'],
            spotify: artistSelected?.['spotify'],
            deezer: artistSelected?.['deezer'],
            apple_music: artistSelected?.['apple_music'],
            napster: artistSelected?.['napster'],
            itunes_store: artistSelected?.['itunes_store']
        });
        this.populateVideosLink(artistSelected?.['videos_link'] || []);
    }

    private populateVideosLink(urls: string[]): void {
        this.videosLink.clear();
        urls.forEach(url => this.addVideoLink(url));
    }

    public onChangeFile(event: Event): void {
        const file = (event.target as HTMLInputElement)?.files?.[0];
        if (file) {
            this.updateFormAndPreview(file);
        } else {
            this.resetFileInput();
        }
    }

    
    private updateFormAndPreview(file: File): void {
        this.fileName = this.truncateFileName(file.name);
        this.form.patchValue({ image: file });

        const reader = new FileReader();
        reader.onload = () => this.imagePreview = reader.result;
        reader.readAsDataURL(file);
    }

    private resetFileInput(): void {
        this.form.patchValue({ image: null });
        this.fileName = '';
        this.imagePreview = null;
    }

    private truncateFileName(name: string): string {
        return name.length > 12 ? `${name.slice(0, 12)}...` : name;
    }

    public isFormValid(): boolean {
        return this.form.valid;
    }

    public onSeeImage(): void {

    }

    async onSubmitForm(): Promise<void> {
        if (this.isFormValid()) {
            const artisData = this.form.getRawValue();
            console.log('artisData', artisData)

            switch (this.view) {
                case "ajouter":
                    if (this.form.valid) {
                        const response: any = await handle(() => this.artistService.postArtistsAdd(FormatFormData(artisData)), this.notyfService);
                        if (response?.error === false) this.handleSuccessfulForm(response);
                    }
                    break;

                case "editer":
                    if (this.form.valid) {
                        const response: any = await handle(() => this.artistService.postArtistsUpdate(FormatFormData({ ...artisData, id: this.artistSelected?.['id'] })), this.notyfService);
                        if (response?.error === false) this.handleSuccessfulForm(response);
                    }
                    break;
            }
        } else {
            this.showErrorNotification();
        }
    }

    private handleSuccessfulForm(response): void {
        this.notyfService.showToast("success", response?.message, "toast-success");
        this.closeInterface();
    }

    public closeInterface(): void {
        this.router.navigate([`${MANAGEMENT}/${ARTISTS}/${ARTISTS}`]);
    }

    private showErrorNotification() {
        this.translate.get("GeneralStrings.MessageToast.FORM.REQUIRED_FIELDS")
            .subscribe((translation: string) => {
                this.notyfService.showToast("error", translation, "toast-danger");
            });
    }

}