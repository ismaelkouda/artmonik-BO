import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { NotyfService } from "@/shared/services/notyf.service";
import { ngxLoadingAnimationTypes } from "ngx-loading";
import { handle } from "@/shared/functions/api.function";
import { SlideService } from "../../data-access/slide.service";
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
  selector: "app-form-slides",
  templateUrl: "./form-slides.component.html",
  styleUrls: ["./form-slides.component.scss"],
})

export class FormSlidesComponent implements OnInit {
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
      label: "FormSlides.TITRE.LIBELLE",
      placeholder: "FormSlides.TITRE.PLACEHOLDER",
      name: "title",
      type: "text",
      column: 12,
      required: "FormSlides.TITRE.IS_REQUIRED",
    },
    {
      label: "FormSlides.DESCRIPTION.LIBELLE",
      placeholder: "FormSlides.DESCRIPTION.PLACEHOLDER",
      name: "description",
      type: "textarea",
      column: 12,
      rows: 4,
      required: "FormSlides.DESCRIPTION.IS_REQUIRED",
    },
    {
      label: "FormSlides.LIEN_PAGE.LIBELLE",
      placeholder: "FormSlides.LIEN_PAGE.PLACEHOLDER",
      name: "page_link",
      type: "text",
      column: 12,
      required: "FormSlides.LIEN_PAGE.IS_REQUIRED",
    },
    {
      label: "FormSlides.FILE.LIBELLE",
      placeholder: "FormSlides.FILE.PLACEHOLDER",
      name: "image",
      type: "file",
      column: 12,
      required: "FormSlides.FILE.IS_REQUIRED",
    }

  ];
  constructor(private fb: FormBuilder, private notyfService: NotyfService,
    private slideService: SlideService,
    public dialogRef: MatDialogRef<FormSlidesComponent>,
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
      description: [, Validators.required],
      page_link: [, Validators.required],
      image: [, Validators.required],
    });

    if (this.data?.type === "edit" && this.data?.property) {
      this.form.patchValue({
        title: this.data?.property.title,
        description: this.data?.property.description,
        page_link: this.data?.property.page_link,
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
            const response: any = await handle(() => this.slideService.postSlidesAdd(FormatFormData(userData)), this.notyfService);
            if (response?.error === false) this.handleSuccessfulForm(response);
          }
          break;
      
          case "edit":
            if (this.form.valid) {
              const response: any = await handle(() => this.slideService.postSlidesUpdate(FormatFormData({...userData, id: this.data?.property?.id})), this.notyfService);
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
