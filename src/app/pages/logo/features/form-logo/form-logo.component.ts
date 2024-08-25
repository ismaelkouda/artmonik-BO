import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { NotyfService } from "@/shared/services/notyf.service";
import { ngxLoadingAnimationTypes } from "ngx-loading";
import { handle } from "@/shared/functions/api.function";
import { FormatFormData } from "@/shared/functions/formatFormData.function";
import { LogoService } from "../../data-access/logo.service";

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
  selector: "app-form-logo",
  templateUrl: "./form-logo.component.html",
  styleUrls: ["./form-logo.component.scss"],
})

export class FormLogoComponent implements OnInit {
  public loading = false;
  @Output() updateSuccessful = new EventEmitter<void>();
  public form: FormGroup;
  public primaryColour = PrimaryWhite;
  public secondaryColour = SecondaryGrey;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public formInputs = [
    {
      label: "FormLogo.LOGO.LIBELLE",
      placeholder: "FormLogo.LOGO.PLACEHOLDER",
      name: "logo",
      type: "file",
      column: 12,
      required: "FormLogo.LOGO.IS_REQUIRED",
    },
    {
      label: "FormLogo.DESCRIPTION.LIBELLE",
      placeholder: "FormLogo.DESCRIPTION.PLACEHOLDER",
      name: "description",
      type: "text",
      column: 12,
      required: "FormLogo.DESCRIPTION.IS_REQUIRED",
    }

  ];
  constructor(private fb: FormBuilder, private notyfService: NotyfService,
    private logoService: LogoService,
    public dialogRef: MatDialogRef<FormLogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private translate: TranslateService,
  ) { }

  async ngOnInit() {
    this.loading = true;
    this.initForm();
    this.loading = false;
  }

  private initForm() {
    this.form = this.fb.group({
      logo: [, Validators.required],
      description: [],
    });

    if (this.data?.type === "edit" && this.data?.property) {
      this.form.patchValue({
        logo: this.data?.property.logo,
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
          await handle(() => this.logoService.postLogoAdd(FormatFormData(userData)), this.notyfService);
          break;
      
          case "edit":
            await handle(() => this.logoService.postLogoUpdate(FormatFormData({...userData, id: this.data?.property?.id})), this.notyfService);
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
