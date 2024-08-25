import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { NotyfService } from "@/shared/services/notyf.service";
import { ngxLoadingAnimationTypes } from "ngx-loading";
import { handle } from "@/shared/functions/api.function";
import { ServiceService } from "../../data-access/service.service";
import { FormatFormData } from "@/shared/functions/formatFormData.function";

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
  selector: "app-form-services",
  templateUrl: "./form-services.component.html",
  styleUrls: ["./form-services.component.scss"],
})

export class FormServicesComponent implements OnInit {
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
      label: "FormServices.CODE.LIBELLE",
      placeholder: "FormServices.CODE.PLACEHOLDER",
      name: "code",
      type: "text",
      column: 6,
      required: "FormServices.CODE.IS_REQUIRED",
    },
    {
      label: "FormServices.TITRE.LIBELLE",
      placeholder: "FormServices.TITRE.PLACEHOLDER",
      name: "title",
      type: "text",
      column: 6,
      required: "FormServices.TITRE.IS_REQUIRED",
    },
    {
      label: "FormServices.DESCRIPTION.LIBELLE",
      placeholder: "FormServices.DESCRIPTION.PLACEHOLDER",
      name: "description",
      type: "text",
      column: 12,
      required: "FormServices.DESCRIPTION.IS_REQUIRED",
    },
    {
      label: "FormServices.FILE.LIBELLE",
      placeholder: "FormServices.FILE.PLACEHOLDER",
      name: "image",
      type: "file",
      column: 12,
      required: "FormServices.FILE.IS_REQUIRED",
    }

  ];
  constructor(private fb: FormBuilder, private notyfService: NotyfService,
    private serviceService: ServiceService,
    public dialogRef: MatDialogRef<FormServicesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private translate: TranslateService,
  ) { }

  async ngOnInit() {
    this.loading = true;
    this.initForm();
    this.loading = false;
  }

  private initForm() {
    this.form = this.fb.group({
      code: [, Validators.required],
      title: [, Validators.required],
      description: [],
      image: [, Validators.required],
    });

    if (this.data?.type === "edit" && this.data?.property) {
      this.form.patchValue({
        code: this.data?.property.code,
        title: this.data?.property.title,
        description: this.data?.property.description,
        image: this.data?.property.file,
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
            const response: any = await handle(() => this.serviceService.postServicesAdd(FormatFormData(userData)), this.notyfService);
            if (response?.error === false) this.handleSuccessfulForm(response);
          }
          break;
      
          case "edit":
            if (this.form.valid) {
              const response: any = await handle(() => this.serviceService.postServicesUpdate(FormatFormData({...userData, id: this.data?.property?.id})), this.notyfService);
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
