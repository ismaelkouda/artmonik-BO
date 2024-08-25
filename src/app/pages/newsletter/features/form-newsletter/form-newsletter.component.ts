import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { NotyfService } from "@/shared/services/notyf.service";
import { ngxLoadingAnimationTypes } from "ngx-loading";
import { handle } from "@/shared/functions/api.function";
import { FormatFormData } from "@/shared/functions/formatFormData.function";
import { NewsletterService } from "../../data-access/newsletter.service";

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
  selector: "app-form-newsletter",
  templateUrl: "./form-newsletter.component.html",
  styleUrls: ["./form-newsletter.component.scss"],
})

export class FormNewsletterComponent implements OnInit {
  public loading = false;
  @Output() updateSuccessful = new EventEmitter<void>();
  public form: FormGroup;
  public primaryColour = PrimaryWhite;
  public secondaryColour = SecondaryGrey;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public formInputs = [
    {
      label: "FormNewsletter.EMAIL.LIBELLE",
      placeholder: "FormNewsletter.EMAIL.PLACEHOLDER",
      name: "email",
      type: "text",
      column: 12,
      required: "FormNewsletter.EMAIL.IS_REQUIRED",
    },
    {
      label: "FormNewsletter.DESCRIPTION.LIBELLE",
      placeholder: "FormNewsletter.DESCRIPTION.PLACEHOLDER",
      name: "description",
      type: "text",
      column: 12,
      required: "FormNewsletter.DESCRIPTION.IS_REQUIRED",
    }

  ];
  constructor(private fb: FormBuilder, private notyfService: NotyfService,
    private newsletterService: NewsletterService,
    public dialogRef: MatDialogRef<FormNewsletterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private translate: TranslateService,
  ) { }

  async ngOnInit() {
    this.loading = true;
    this.initForm();
    this.loading = false;
  }

  private initForm() {
    this.form = this.fb.group({
      email: [, Validators.required, Validators.email],
      description: [],
    });

    if (this.data?.type === "edit" && this.data?.property) {
      this.form.patchValue({
        email: this.data?.property.email,
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

  async onSubmitForm(): Promise<void> {
    if (this.isFormValid()) {
      const userData = this.form.getRawValue();
      switch (this.data?.type) {
        case "add":
          await handle(() => this.newsletterService.postNewsletterAdd(userData), this.notyfService);
          break;
      
          case "edit":
            await handle(() => this.newsletterService.postNewsletterUpdate({...userData, id: this.data?.property?.id}), this.notyfService);
          break;
      }
      this.updateSuccessful.emit();
    } else {
      this.showErrorNotification();
    }
  }

  private showErrorNotification() {
    this.translate
      .get("GeneralStrings.MessageToast.FORM.REQUIRED_FIELDS")
      .subscribe((translation: string) => {
        this.notyfService.showToast("error", translation, "toast-danger");
      });
  }
}
