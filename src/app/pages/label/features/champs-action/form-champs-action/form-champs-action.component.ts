import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { NotyfService } from "@/shared/services/notyf.service";
import { ngxLoadingAnimationTypes } from "ngx-loading";
import { handle } from "@/shared/functions/api.function";
import { FormatFormData } from "@/shared/functions/formatFormData.function";
import { LabelService } from "@/pages/label/data-access/label.service";

const PrimaryWhite = "#ffffff";
const SecondaryGrey = "#ccc";

type TFormInputs = {
  label: string,
  placeholder: string,
  name: string,
  type: string,
  column: number,
  required: string,
}

@Component({
  selector: "app-form-champs-action",
  templateUrl: "./form-champs-action.component.html",
  styleUrls: ["./form-champs-action.component.scss"],
})

export class FormChampsActionComponent implements OnInit {
  public loading = false;
  @Output() updateSuccessful = new EventEmitter<void>();
  public form: FormGroup;
  public primaryColour = PrimaryWhite;
  public secondaryColour = SecondaryGrey;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public fileName: string;
  private selectedFile: File | null = null;
  private imagePreview: string | ArrayBuffer | null = null;
  public formInputs = [
    {
      label: "FormChampsAction.TITRE.LIBELLE",
      placeholder: "FormChampsAction.TITRE.PLACEHOLDER",
      name: "title",
      type: "text",
      column: 12,
      required: "FormChampsAction.TITRE.IS_REQUIRED",
    },
    {
      label: "FormChampsAction.SOUS_TITRE.LIBELLE",
      placeholder: "FormChampsAction.SOUS_TITRE.PLACEHOLDER",
      name: "sub_title",
      type: "text",
      column: 12,
      required: "FormChampsAction.SOUS_TITRE.IS_REQUIRED",
    },
    {
      label: "FormServices.FILE.LIBELLE",
      placeholder: "FormServices.FILE.PLACEHOLDER",
      name: "image",
      type: "file",
      column: 12,
      required: "FormServices.FILE.IS_REQUIRED",
    },
    {
      label: "FormChampsAction.TITRE_IMAGE.LIBELLE",
      placeholder: "FormChampsAction.TITRE_IMAGE.PLACEHOLDER",
      name: "image_title",
      type: "text",
      column: 12,
      required: "FormChampsAction.TITRE_IMAGE.IS_REQUIRED",
    },
    {
      label: "FormServices.DESCRIPTION.LIBELLE",
      placeholder: "FormServices.DESCRIPTION.PLACEHOLDER",
      name: "description",
      type: "textarea",
      column: 12,
      rows: 4,
      required: "FormServices.DESCRIPTION.IS_REQUIRED",
    },

  ];
  constructor(private fb: FormBuilder, private notyfService: NotyfService,
    private labelService: LabelService,
    public dialogRef: MatDialogRef<FormChampsActionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private translate: TranslateService,
  ) { }

  async ngOnInit() {
    this.loading = true;
    this.initForm();
    this.loading = false;
  }

  private initForm() {
    this.form = this.fb.group({
      title: [, Validators.required],
      sub_title: [, Validators.required],
      image: [, Validators.required],
      image_title: [, Validators.required],
      description: [],
    });

    if (this.data?.type === "edit" && this.data?.property) {
      this.form.patchValue({
        title: this.data?.property.title,
        sub_title: this.data?.property.sub_title,
        image: this.data?.property.image,
        image_title: this.data?.property.image_title,
        description: this.data?.property.description,
      });
    }
  }

  public isFormValid(): boolean {
    return this.form.valid;
  }

  public closeModal() {
    this.dialogRef.close(true);
  }

  async handleUserOperation(operation: () => Promise<any>): Promise<void> {
    try {
      this.loading = true;
      await operation();
    } finally {
      this.loading = false;
    }
  }

  async onSubmitForm(): Promise<void> {
    if (this.isFormValid()) {
      const userData = this.form.getRawValue();
      switch (this.data?.type) {
        case "add":
          if (this.form.valid) {
            const response: any = await handle(() => this.labelService.postChampsActionAdd(FormatFormData(userData)), this.notyfService);
            if (response?.error === false) this.handleSuccessfulForm(response);
          }
          break;
      
          case "edit":
            if (this.form.valid) {
              const response: any = await handle(() => this.labelService.postChampsActionUpdate(FormatFormData({...userData, id: this.data?.property?.id})), this.notyfService);
              if (response?.error === false) this.handleSuccessfulForm(response);
            }
          break;
      }
      this.updateSuccessful.emit();
    } else {
      this.showErrorNotification();
    }
  }

  private handleSuccessfulForm(response): void {
      this.notyfService.showToast("success", response?.message, "toast-success");
      this.closeModal();
  }

  private showErrorNotification() {
    this.translate
      .get("GeneralStrings.MessageToast.FORM.REQUIRED_FIELDS")
      .subscribe((translation: string) => {
        this.notyfService.showToast("error", translation, "toast-danger");
      });
  }

  public onExcelFileChange(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
          this.selectedFile = input.files[0]
          const reader = new FileReader();
          reader.onload = () => {
              this.imagePreview = reader.result;
          };
          reader.readAsDataURL(this.selectedFile);
          this.fileName = this.selectedFile?.name.slice(0, 15).padEnd(18, '.');
          this.form.get("image").patchValue(this.selectedFile);
      }
  }
  public onSeeImage(): void {

  }
}
