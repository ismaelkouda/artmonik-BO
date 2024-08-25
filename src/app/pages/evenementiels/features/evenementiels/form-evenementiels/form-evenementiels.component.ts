import { Component, EventEmitter, HostBinding, Inject, Input, OnInit, Output } from "@angular/core";
import { handle } from "../../../../../shared/functions/api.function";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ngxLoadingAnimationTypes } from "ngx-loading";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { NotyfService } from "@/shared/services/notyf.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormatFormData } from "@/shared/functions/formatFormData.function";
import { MANAGEMENT } from "@/shared/routes/routes";
import { EVENEMENTIELS } from "@/pages/evenementiels/evenementiels-routing.module";
import { EvenementielStateService } from "@/pages/evenementiels/data-access/evenementiels/evenementiels-state.service";
import { EvenementielService } from "@/pages/evenementiels/data-access/evenementiels.service";

type TYPEVIEW = "editer" | "détails" | "ajouter";

@Component({
    selector: 'app-form-evenementiels',
    templateUrl: './form-evenementiels.component.html',
    styleUrls: [`./form-evenementiels.component.scss`]
})

export class FormEvenementielsComponent {
    public breadcrumbObject: any = {
        first: "FormEvenementiel.BREADCRUMB.FIRST",
        second: "FormEvenementiel.BREADCRUMB.SECOND",
    };
    
    public FormEvenementiel: any[] = [
        {
            label: "FormEvenementiel.TITRE.LIBELLE",
            placeholder: "FormEvenementiel.TITRE.PLACEHOLDER",
            name: "titre",
            type: "text",
            column: 4,
            required: "FormEvenementiel.TITRE.IS_REQUIRED",
        },
        {
            label: "FormEvenementiel.TAGS.LIBELLE",
            placeholder: "FormEvenementiel.TAGS.PLACEHOLDER",
            name: "tag",
            type: "select",
            column: 4,
            required: "FormEvenementiel.TAGS.IS_REQUIRED",
        },
        {
            label: "FormEvenementiel.PUBLIE_PAR.LIBELLE",
            placeholder: "FormEvenementiel.PUBLIE_PAR.PLACEHOLDER",
            name: "publie_par",
            type: "select",
            column: 4,
            required: "FormEvenementiel.PUBLIE_PAR.IS_REQUIRED",
        },
        {
            label: "FormEvenementiel.CATEGORIE.LIBELLE",
            placeholder: "FormEvenementiel.CATEGORIE.PLACEHOLDER",
            name: "category_id",
            type: "select",
            column: 6,
            required: "FormEvenementiel.CATEGORIE.IS_REQUIRED",
            options: "listCategoryEvenementiels",
            optionLabel: "name",
            filterBy: "name",
            optionValue: "id",
        },
        {
            label: "FormEvenementiel.IMAGE.LIBELLE",
            placeholder: "FormEvenementiel.IMAGE.PLACEHOLDER",
            name: "image",
            type: "file",
            column: 6,
            required: "FormEvenementiel.IMAGE.IS_REQUIRED",
        },
        {
            label: "FormEvenementiel.DESCRIPTION.LIBELLE",
            placeholder: "FormEvenementiel.DESCRIPTION.PLACEHOLDER",
            name: "description",
            type: "edit",
            column: 12,
            rows: 3,
            required: "FormEvenementiel.DESCRIPTION.IS_REQUIRED",
        }
    ];
    public view: TYPEVIEW;
    public page: number;
    public id: number;
    public filter: Object;

    private imagePreview: string | ArrayBuffer | null = null;
    public fileName: string;
    public form: FormGroup;
    public listEvenementiels: Array<Object>;
    public listCategoryArtists: Array<Object>;
    public evenementielSelected: Object;

    public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
    constructor(private activatedRoute: ActivatedRoute, private evenementielStateService: EvenementielStateService,
        private evenementielService: EvenementielService, private translate: TranslateService,
        private notyfService: NotyfService, private router: Router, private fb: FormBuilder,) { }

    async ngOnInit() {
        this.initForm();
        this.getParamsInUrl();
    }

    private initForm(): void {
        this.form = this.fb.group({
            id: this.createFormControl(null),
            titre: this.createFormControl(null, Validators.required),
            tag: this.createFormControl(null, Validators.required),
            publie_par: this.createFormControl(null, Validators.required),
            category_id: this.createFormControl(null, Validators.required),
            image: this.createFormControl(null, Validators.required),
            description: this.createFormControl(null, Validators.required),
        });
    }

    private createFormControl(initialValue: any, validator: Validators | null = null): any {
        return [{ value: initialValue, disabled: false }, validator].filter(v => v !== null);
    }

    private getParamsInUrl(): void {
        this.activatedRoute.queryParams.subscribe((params: Object) => {
            this.view = params?.["view"];
            this.page = params?.["page"];
            this.id = params?.["id"];
            this.filter = this.evenementielStateService.parseQueryStringToObject(params?.["filter"]);
        });
        if(this.view !== "ajouter")  this.getEvenementielsAll(this.filter);
    }

    async getEvenementielsAll(dataToSend = {}): Promise<any> {
        const response: any = await handle(() => this.evenementielService.getEvenementielsAll(), this.notyfService);
        this.handleSuccessfulPageCallback(response);
    }

    private handleSuccessfulPageCallback(response: any): void {
        this.listEvenementiels = response?.data;
        this.getEvenementielSelected(this.listEvenementiels)
    }

    private getEvenementielSelected(listEvenementiels: Array<Object>): void {
        this.evenementielSelected = listEvenementiels.find((evenementiel) => evenementiel?.["id"] == this.id);
        if(this.evenementielSelected) {
            this.getTitleForm();
            if (this.view === "ajouter") {
                this.getCategoryArtistsAll();
            } else if (this.view === "détails" || this.view === "editer") {
                this.patchValueForm(this.evenementielSelected);
                if (this.view === "editer") {
                    this.getCategoryArtistsAll();
                }
                if (this.view === "détails") {
                    this.form.disable();
                }
            }
        };
    }

    public getTitleForm(): string {
        const titles = {
            ajouter: "FormEvenementiel.TITLE_MODAL.STORE",
            editer: "FormEvenementiel.TITLE_MODAL.UPDATE",
            détails: "FormEvenementiel.TITLE_MODAL.DETAILS"
        };
        const evenementielName = this.evenementielSelected?.["titre"] || "...";
        return this.translate.instant(titles[this.view]).replace("{libelle}", `[${evenementielName}]`);
    }

    private patchValueForm(evenementielSelected: Object): void {
        this.form.patchValue({
            id: evenementielSelected?.['id'],
            tag: evenementielSelected?.['tag'],
            publie_par: evenementielSelected?.['publie_par'],
            category_id: this.view === "editer" ? evenementielSelected?.['categorie_id'] : evenementielSelected?.['categorie_id'],
            image: evenementielSelected?.['image'],
            titre: evenementielSelected?.['titre'],
            description: evenementielSelected?.['description']
        });
    }

    async getCategoryArtistsAll(dataToSend = {}): Promise<any> {
        const response: any = await handle(() => this.evenementielService.getArtistsCategoriesAll(), this.notyfService);
        if (response.code === 200) this.handleSuccessfulGetCategoryArtistsAll(response);
    }

    handleSuccessfulGetCategoryArtistsAll(response: any) {
        this.listCategoryArtists = response?.data;
    }

    public closeInterface(): void {
        this.router.navigate([`${MANAGEMENT}/${EVENEMENTIELS}`]);
    }
    public onSeeImage(): void {

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

    async onSubmitForm(): Promise<void> {
        if (this.isFormValid()) {
            const artisData = this.form.getRawValue();
            console.log('artisData', artisData)

            switch (this.view) {
                case "ajouter":
                    if (this.form.valid) {
                        const response: any = await handle(() => this.evenementielService.postEvenementielsAdd(FormatFormData(artisData)), this.notyfService);
                        if (response?.error === false) this.handleSuccessfulForm(response);
                    }
                    break;

                case "editer":
                    if (this.form.valid) {
                        const response: any = await handle(() => this.evenementielService.postEvenementielsUpdate(FormatFormData({ ...artisData, id: this.evenementielSelected?.['id'] })), this.notyfService);
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

    private showErrorNotification() {
        this.translate.get("GeneralStrings.MessageToast.FORM.REQUIRED_FIELDS")
            .subscribe((translation: string) => {
                this.notyfService.showToast("error", translation, "toast-danger");
            });
    }
}
