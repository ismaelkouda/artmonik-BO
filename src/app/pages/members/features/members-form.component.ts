import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { NotyfService } from "@/shared/services/notyf.service";
import { ngxLoadingAnimationTypes } from "ngx-loading";
import { handle } from "@/shared/functions/api.function";
import { MembersService } from "../data-access/members.service";

const PrimaryWhite = "#ffffff";
const SecondaryGrey = "#ccc";
@Component({
  selector: "app-members-form",
  templateUrl: "./members-form.component.html",
  styleUrls: ["./members-form.component.scss"],
})
export class MembersFormComponent implements OnInit {
  public loading = false;
  @Output() updateSuccessful = new EventEmitter<void>();

  public form: FormGroup;
  public primaryColour = PrimaryWhite;
  public secondaryColour = SecondaryGrey;
  listProfiles: Array<{ libelle: string }> = [
    { libelle: 'membre' },
    { libelle: 'admin' }
  ];
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public formInputs: any[] = [
    {
      label: "MEMBERS.FULLNAME.LIBELLE",
      placeholder: "MEMBERS.FULLNAME.PLACEHOLDER",
      name: "fullname",
      type: "text",
      column: 6,
      required: "MEMBERS.FULLNAME.IS_REQUIRED",
    },
    {
      label: "MEMBERS.EMAIL.LIBELLE",
      placeholder: "MEMBERS.EMAIL.PLACEHOLDER",
      name: "email",
      type: "email",
      column: 6,
      required: "MEMBERS.EMAIL.IS_REQUIRED",
    },
    {
      label: "MEMBERS.WHATSAPP.LIBELLE",
      placeholder: "MEMBERS.WHATSAPP.PLACEHOLDER",
      name: "whatsapp",
      type: "text",
      column: 6,
      required: "MEMBERS.WHATSAPP.IS_REQUIRED",
    },
    {
      label: "MEMBERS.MOTIVATION.LIBELLE",
      placeholder: "MEMBERS.MOTIVATION.PLACEHOLDER",
      name: "motivation",
      type: "text",
      column: 6,
      required: "MEMBERS.MOTIVATION.IS_REQUIRED",
    },
    
  ];
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MembersFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private membersService: MembersService,
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
      fullname: [null, Validators.required],
      email: [null, Validators.required, Validators.email],
      whatsapp: [null, Validators.required, Validators.pattern("^[0-9]*$")],
      motivation: [null, Validators.required],
    });
    this.form.get("whatsapp").valueChanges.subscribe((value) => {
      if (value && value.length > 10) {
        this.form.get("whatsapp").setValue(value.slice(0, 10), { emitEvent: false });
      }
    });

    if (this.data?.type === "edit" && this.data?.property) {
      this.form.patchValue({
        id: this.data?.property.id,
        fullname: this.data?.property?.fullname,
        email: this.data?.property?.email,
        whatsapp: this.data?.property?.whatsapp,
        motivation: this.data?.property?.motivation
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
      const membreData = this.form.getRawValue();
      switch (this.data?.type) {
        case "add":
          // await handle(() => this.membersService.postMembersAdd(membreData), this.notyfService);
          break;
       
          case "edit":
            // await handle(() => this.membersService.postMembersUpdate({...membreData, id: this.data?.property?.id}), this.notyfService);
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
