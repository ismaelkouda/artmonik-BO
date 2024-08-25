import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { NotyfService } from "@/shared/services/notyf.service";
import { ngxLoadingAnimationTypes } from "ngx-loading";
import { handle } from "@/shared/functions/api.function";
import { FormatFormData } from "@/shared/functions/formatFormData.function";
import { MessagingService } from "../../data-access/messaging.service";

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
  selector: "app-form-messaging",
  templateUrl: "./form-messaging.component.html",
  styleUrls: ["./form-messaging.component.scss"],
})

export class FormMessagingComponent implements OnInit {
  public loading = false;
  @Output() updateSuccessful = new EventEmitter<void>();
  public form: FormGroup;
  public primaryColour = PrimaryWhite;
  public secondaryColour = SecondaryGrey;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public formInputs = [
    {
      label: "FormMessaging.NOM.LIBELLE",
      placeholder: "FormMessaging.NOM.PLACEHOLDER",
      name: "nom",
      type: "text",
      column: 12,
      required: "FormMessaging.NOM.IS_REQUIRED",
    },
    {
      label: "FormMessaging.PRENOMS.LIBELLE",
      placeholder: "FormMessaging.PRENOMS.PLACEHOLDER",
      name: "prenoms",
      type: "text",
      column: 12,
      required: "FormMessaging.PRENOMS.IS_REQUIRED",
    },
    {
      label: "FormMessaging.EMAIL.LIBELLE",
      placeholder: "FormMessaging.EMAIL.PLACEHOLDER",
      name: "email",
      type: "text",
      column: 12,
      required: "FormMessaging.EMAIL.IS_REQUIRED",
    },
    {
      label: "FormMessaging.TELEPHONE.LIBELLE",
      placeholder: "FormMessaging.TELEPHONE.PLACEHOLDER",
      name: "telephone",
      type: "text",
      column: 12,
      required: "FormMessaging.TELEPHONE.IS_REQUIRED",
    },
    {
      label: "FormMessaging.MESSAGE.LIBELLE",
      placeholder: "FormMessaging.MESSAGE.PLACEHOLDER",
      name: "message",
      type: "text",
      column: 12,
      required: "FormMessaging.MESSAGE.IS_REQUIRED",
    }

  ];
  constructor(private fb: FormBuilder, private notyfService: NotyfService,
    private messagingService: MessagingService,
    public dialogRef: MatDialogRef<FormMessagingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private translate: TranslateService,
  ) { }

  async ngOnInit() {
    this.loading = true;
    this.initForm();
    this.loading = false;
  }

  private initForm() {
    this.form = this.fb.group({
      nom: [, Validators.required, Validators.email],
      prenoms: [, Validators.required, Validators.email],
      email: [, Validators.required, Validators.email],
      telephone: [, Validators.required, Validators.pattern("^[0-9]*$")],
      message: [],
    });
    this.form.get("telephone").valueChanges.subscribe((value) => {
      if (value && value.length > 10) {
        this.form.get("telephone").setValue(value.slice(0, 10), { emitEvent: false });
      }
    });

    if (this.data?.type === "edit" && this.data?.property) {
      this.form.patchValue({
        nom: this.data?.property.nom,
        prenoms: this.data?.property.prenoms,
        email: this.data?.property.email,
        telephone: this.data?.property.telephone,
        message: this.data?.property.message,
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
      const messagingData = this.form.getRawValue();
      switch (this.data?.type) {
        case "add":
          await handle(() => this.messagingService.postMessagingAdd(messagingData), this.notyfService);
          break;
      
          case "edit":
            await handle(() => this.messagingService.postMessagingUpdate({...messagingData, id: this.data?.property?.id}), this.notyfService);
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
