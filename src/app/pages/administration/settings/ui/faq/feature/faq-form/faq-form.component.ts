import {
  handleDeleteFaq,
  handleStoreFaq,
  handleUpdateFaq,
} from "@/pages/administration/settings/data-access/faq/functions/faq.function";
import { FaqService } from "@/pages/administration/settings/data-access/faq/services/faq.services";
import { NotyfService } from "@/shared/services/notyf.service";
import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { ngxLoadingAnimationTypes } from "ngx-loading";

const PrimaryWhite = "#ffffff";
const SecondaryGrey = "#ccc";
@Component({
  selector: "app-faq-form",
  templateUrl: "./faq-form.component.html",
  styleUrls: ["./faq-form.component.scss"],
})
export class FaqFormComponent implements OnInit {
  public loading = false;

  @Output() updateSuccessful = new EventEmitter<void>();

  public form: FormGroup;
  public primaryColour = PrimaryWhite;
  public secondaryColour = SecondaryGrey;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public formInputs: any[] = [
    {
      label: "FormFaq.NOM.LIBELLE",
      placeholder: "FormFaq.NOM.PLACEHOLDER",
      name: "title",
      type: "text",
      column: 12,
      required: "FormFaq.NOM.IS_REQUIRED",
    },
    {
      label: "FormFaq.DESCRIPTION.LIBELLE",
      placeholder: "FormFaq.DESCRIPTION.PLACEHOLDER",
      name: "description",
      type: "textarea",
      rows:5,
      cols:300,
      column: 12,
      required: "FormFaq.DESCRIPTION.IS_REQUIRED",
    },
  ];
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FaqFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private faqservice: FaqService,
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
      id:["",],
      title: ["", [Validators.required]],
      description: ["", [Validators.required]],
    });

    if (this.data?.type === "edit" && this.data?.property) {
      this.form.patchValue({
        id: this.data?.property?.id,
        title: this.data?.property?.title,
        description: this.data?.property?.description,
      });
    }
  }

  public isFormValid(): boolean {
    return this.form.valid;
  }

  public closeModal() {
    this.dialogRef.close(true);
  }

  async handleFaqOperation(operation: () => Promise<any>): Promise<void> {
    try {
      this.loading = true;
      await operation();
    } finally {
      this.loading = false;
    }
  }

  async storeFaq(): Promise<void> {
    if (this.isFormValid()) {
      const faqData = this.form.getRawValue();
      await this.handleFaqOperation(() =>
        handleStoreFaq(
          () => this.faqservice.storeFaq(faqData),
          this.dialogRef,
          this.notyfService,
        ),
      );
      this.updateSuccessful.emit();
    } else {
      this.showErrorNotification();
    }
  }

  async updateFaq(): Promise<void> {
    if (this.isFormValid()) {
      const faqData = this.form.getRawValue();
      await this.handleFaqOperation(() =>
        handleUpdateFaq(
          () => this.faqservice.updateFaq(faqData),
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
