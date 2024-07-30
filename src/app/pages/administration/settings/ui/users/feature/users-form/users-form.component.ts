import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { NotyfService } from "@/shared/services/notyf.service";
import { ngxLoadingAnimationTypes } from "ngx-loading";
import { UsersService } from "@/pages/administration/settings/data-access/users/services/users.services";
import {handleStoreUsers} from "@/pages/administration/settings/data-access/users/functions/users.functions";

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
      name: "name",
      type: "text",
      column: 6,
      required: "FormUser.NOM.IS_REQUIRED",
    },
    {
      label: "FormUser.PRENOMS.LIBELLE",
      placeholder: "FormUser.PRENOMS.PLACEHOLDER",
      name: "first_name",
      type: "text",
      column: 6,
      required: "FormUser.PRENOMS.IS_REQUIRED",
    },
    {
      label: "FormUser.EMAIL.LIBELLE",
      placeholder: "FormUser.EMAIL.PLACEHOLDER",
      name: "email",
      type: "email",
      column: 12,
      required: "FormUser.EMAIL.IS_REQUIRED",
    },
    {
      label: "FormUser.PASSWORD.LIBELLE",
      placeholder: "FormUser.PASSWORD.PLACEHOLDER",
      name: "password",
      type: "password",
      column: 6,
      required: "FormUser.PASSWORD.IS_REQUIRED",
    },
    {
      label: "FormUser.CONFIRM_PASSWORD.LIBELLE",
      placeholder: "FormUser.CONFIRM_PASSWORD.PLACEHOLDER",
      name: "confirm_password",
      type: "password",
      column: 6,
      required: "FormUser.CONFIRM_PASSWORD.IS_REQUIRED",
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
      id:["",[]],
      role: ["admin", []],
      name: ["", [Validators.required]],
      first_name: ["", [Validators.required]],
      password: ["", [Validators.required]],
      confirm_password: ["", [Validators.required]],
      email: ["", [Validators.required]],
    });

    if (this.data?.type === "edit" && this.data?.property) {
      this.form.patchValue({
        id: this.data?.property.id,
        name: this.data?.property?.name,
        first_name: this.data?.property?.first_name,
        email: this.data?.property?.email,
        role: this.data?.property?.role,
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

  async storeUser(): Promise<void> {
    if (this.isFormValid()) {
      const userData = this.form.getRawValue();
      const { distributeurUserId, ...userDataWithoutId } = userData;
      await this.handleUserOperation(() =>
        handleStoreUsers(
          () => this.usersService.storeUsers(userDataWithoutId),
          this.dialogRef,
          this.notyfService,
        ),
      );
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
