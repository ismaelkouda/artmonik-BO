import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { NotyfService } from "@/shared/services/notyf.service";
import { ngxLoadingAnimationTypes } from "ngx-loading";
import { handle } from "@/shared/functions/api.function";
import { UsersService } from "../../data-access/users.service";

const PrimaryWhite = "#ffffff";
const SecondaryGrey = "#ccc";
@Component({
  selector: "app-users-form",
  templateUrl: "./users-form.component.html",
  styleUrls: ["./users-form.component.scss"],
})
export class UsersFormComponent implements OnInit {
  public loading = false;
  @Output() updateSuccessful = new EventEmitter<void>();

  public form: FormGroup;
  public primaryColour = PrimaryWhite;
  public secondaryColour = SecondaryGrey;
  listProfiles: Array<{ libelle: string }> = [
    { libelle: 'user' },
    { libelle: 'admin' }
  ];
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public formInputs: any[] = [
    {
      label: "FormUser.NOM.LIBELLE",
      placeholder: "FormUser.NOM.PLACEHOLDER",
      name: "nom",
      type: "text",
      column: 6,
      required: "FormUser.NOM.IS_REQUIRED",
    },
    {
      label: "FormUser.PRENOMS.LIBELLE",
      placeholder: "FormUser.PRENOMS.PLACEHOLDER",
      name: "prenoms",
      type: "text",
      column: 6,
      required: "FormUser.PRENOMS.IS_REQUIRED",
    },
    {
      label: "FormUser.EMAIL.LIBELLE",
      placeholder: "FormUser.EMAIL.PLACEHOLDER",
      name: "email",
      type: "email",
      column: 6,
      required: "FormUser.EMAIL.IS_REQUIRED",
    },
    {
      label: "FormUser.TELEPHONE.LIBELLE",
      placeholder: "FormUser.TELEPHONE.PLACEHOLDER",
      name: "telephone",
      type: "text",
      column: 6,
      required: "FormUser.TELEPHONE.IS_REQUIRED",
    },
    {
      label: "FormUser.MESSAGE.LIBELLE",
      placeholder: "FormUser.MESSAGE.PLACEHOLDER",
      name: "message",
      type: "text",
      column: 12,
      required: "FormUser.MESSAGE.IS_REQUIRED",
    },
    
  ];
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UsersFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private usersService: UsersService,
    private translate: TranslateService,
    private notyfService: NotyfService,
  ) {}

  async ngOnInit() {
    this.loading = true;
    this.initForm();
    this.loading = false;
  }

  private initForm() {
    this.form = this.fb.group({
      id:[""],
      nom: ["", [Validators.required]],
      prenoms: ["", [Validators.required]],
      telephone: [, Validators.required, Validators.pattern("^[0-9]*$")],
      message: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
    });
    this.form.get("telephone").valueChanges.subscribe((value) => {
      if (value && value.length > 10) {
        this.form.get("telephone").setValue(value.slice(0, 10), { emitEvent: false });
      }
    });

    if (this.data?.type === "edit" && this.data?.property) {
      this.form.patchValue({
        id: this.data?.property.id,
        nom: this.data?.property?.nom,
        prenoms: this.data?.property?.prenoms,
        email: this.data?.property?.email,
        telephone: this.data?.property?.telephone,
        message: this.data?.property?.message,
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
          // await handle(() => this.usersService.postUsersAdd(userData), this.notyfService);
          break;
      
          case "edit":
            // await handle(() => this.usersService.postUsersUpdate({...userData, id: this.data?.property?.id}), this.notyfService);
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
