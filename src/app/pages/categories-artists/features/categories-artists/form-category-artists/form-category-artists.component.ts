import { Component, EventEmitter, HostBinding, Inject, Input, OnInit, Output } from "@angular/core";
import { handle } from "../../../../../shared/functions/api.function";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ngxLoadingAnimationTypes } from "ngx-loading";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { NotyfService } from "@/shared/services/notyf.service";
import { CategoryArtistService } from "../../../data-access/category-artist.service";
const PrimaryWhite = "#ffffff";
const SecondaryGrey = "#ccc";
@Component({
    selector: 'app-form-artists',
    styles: [``],
    template: `
        <ngx-loading [show]="loading" [config]="{
            animationType: ngxLoadingAnimationTypes.circle,
            primaryColour: primaryColour,
            secondaryColour: secondaryColour,
            backdropBorderRadius: '5px',
            }">
        </ngx-loading>

        <div class="create-dialog-box scrollable-dialog">
            <div class="title d-flex align-items-center justify-content-space-between">
            <h4 class="mb-0">{{getTitleForm()}}</h4>
            <button class="close-btn bg-transparent p-0 border-none" (click)="closeModal()">
                <i class="flaticon-close"></i>
            </button>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmitForm()">
            <div class="row">
                <div *ngFor="let input of formInputs" class="col-md-{{ input?.column }}">
                    <div class="form-group">
                        <label for="{{ input?.name }}">
                            <strong>{{ input?.label | translate }}</strong>
                            <span *ngIf="input?.required" class="text-danger">*</span>
                        </label>
                        <br />
                        <ng-container *ngIf="input?.type !== 'select'; else selectTemplate">
                            <input name="{{ input?.name }}" formControlName="{{ input?.name }}"
                                [placeholder]="input?.placeholder | translate" type="{{ input?.type }}" class="input-control" />
                        </ng-container>
                        <ng-template #selectTemplate>
                            <p-dropdown [options]="this[input?.options]" [optionLabel]="input?.optionLabel" [filter]="true"
                                [filterBy]="input?.filterBy" formControlName="{{ input?.name }}" [optionValue]="input?.optionValue"
                                [placeholder]="input?.placeholder | translate">
                                <ng-template let-data pTemplate="item">
                                <div class="profile-item">
                                    <div>{{ data.libelle }}</div>
                                </div>
                                </ng-template>
                            </p-dropdown>
                        </ng-template>
                    </div>
                </div>
            </div>
            <div class="text-end">
                <button type="button" mat-flat-button class="gray" (click)="closeModal()">
                    <i class="ri-close-fill"></i>{{ "GeneralStrings.LABEL_CLOSE" | translate }}
                </button>
                <ng-container *ngIf="data.type === 'ajouter'; else editButton;">
                    <button type="submit" mat-flat-button class="imako ml-2" [disabled]="form.invalid">
                        <i Class="ri-add-fill"></i>{{"GeneralStrings.LABEL_SAVE" | translate}}
                    </button>
                </ng-container>
                <ng-template #editButton>
                    <button type="submit" mat-flat-button class="imako ml-2" [disabled]="form.invalid">
                        <i Class="ri-pencil-line"></i>{{"GeneralStrings.LABEL_EDIT" | translate}}
                    </button>
                </ng-template>
            </div>
        </form>
        </div>
    `
})

export class FormCategoryArtistsComponent {
    public titleForm: string;
    public loading = false;
    @Output() updateSuccessful = new EventEmitter<void>();
    public form: FormGroup;
    public primaryColour = PrimaryWhite;
    public secondaryColour = SecondaryGrey;

    public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
    public formInputs: any[] = [
        {
            label: "FormCategoryArtist.LIBELLE.LIBELLE",
            placeholder: "FormCategoryArtist.LIBELLE.PLACEHOLDER",
            name: "libelle",
            type: "text",
            column: 12,
            required: "FormCategoryArtist.LIBELLE.IS_REQUIRED",
        },
        {
            label: "FormCategoryArtist.DESCRIPTION.LIBELLE",
            placeholder: "FormCategoryArtist.DESCRIPTION.PLACEHOLDER",
            name: "description",
            type: "text",
            column: 12,
            required: "FormCategoryArtist.DESCRIPTION.IS_REQUIRED",
        }
    ];
    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<FormCategoryArtistsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private categoryArtistService: CategoryArtistService,
        private translate: TranslateService,
        private notyfService: NotyfService,
    ) { }

    async ngOnInit() {
        this.getTitleForm()
        // this.loading = true;
        this.initForm();
        // this.loading = false;
    }

    private initForm() {
        this.form = this.fb.group({
            id: [""],
            libelle: ["", Validators.required],
            description: [, Validators.required],
        })
        console.log('this.data', this.data)

        if (this.data?.type === "editer" && this.data?.property) {
            this.form.patchValue({
                id: this.data?.property.id,
                libelle: this.data?.property?.libelle,
                description: this.data?.property?.description
            });
        }
    }

    public getTitleForm(): string {
        const titles = {
            ajouter: "FormCategoryArtist.TITLE_MODAL.STORE",
            editer: "FormCategoryArtist.TITLE_MODAL.UPDATE"
        };
    
        const libelle = this.data?.property?.["libelle"] || "...";
        const titleKey = this.data?.type === "ajouter" ? "ajouter" : "editer";
        return this.translate.instant(titles[titleKey]).replace("{libelle}", `[${libelle}]`);
    }

    public isFormValid(): boolean {
        return this.form.valid;
    }

    public closeModal() {
        this.dialogRef.close(true);
    }

    async onSubmitForm(): Promise<void> {
        if (this.isFormValid()) {
            const categoryArtisData = this.form.getRawValue();
            let response: any;
            switch (this.data?.type) {
                case "ajouter":
                    response = await handle(() => this.categoryArtistService.postArtistsCategoriesCreate(categoryArtisData), this.notyfService);
                    if (response?.code === 200) {this.handleSuccessfulForm(response);console.log('response?.code', response?.code)}
                    break;

                case "edit":
                    response = await handle(() => this.categoryArtistService.postArtistsCategoriesUpdate({...categoryArtisData, id: this.data?.property?.id}), this.notyfService);
                    if (response?.code === 200) this.handleSuccessfulForm(response);
                    break;
            }
        } else {
            this.showErrorNotification();
        }
    }

    private handleSuccessfulForm(response: any): void {
        this.notyfService.showToast("success", response?.message, "toast-success");
        this.closeModal();
        this.updateSuccessful.emit();
    }
    private showErrorNotification() {
        this.translate
            .get("GeneralStrings.MessageToast.FORM.REQUIRED_FIELDS")
            .subscribe((translation: string) => {
                this.notyfService.showToast("error", translation, "toast-danger");
            });
    }
}
