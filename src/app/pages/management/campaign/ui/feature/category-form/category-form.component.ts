import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ngxLoadingAnimationTypes } from "ngx-loading";
import { CampaignService } from "../../../data-access/services/campaign-mode.service";
import { TranslateService } from "@ngx-translate/core";
import { NotyfService } from "@/shared/services/notyf.service";
import {
  handleStoreCategoryCampaign,
  handleUpdateCategoryCampaign,
} from "../../../data-access/functions/campaign-mode.functions";

const PrimaryWhite = "#ffffff";
const SecondaryGrey = "#ccc";
@Component({
  selector: "app-category-form",
  templateUrl: "./category-form.component.html",
  styleUrls: ["./category-form.component.scss"],
})
export class CategoryFormComponent implements OnInit {


  public loading = false;
  public imageFile: File | null = null;

  @Output() updateSuccessful = new EventEmitter<void>();

  public form: FormGroup;
  public primaryColour = PrimaryWhite;
  public secondaryColour = SecondaryGrey;
  selectedFile: File | null = null;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public formInputs: any[] = [
    {
      label: "FormCategory.NOM.LIBELLE",
      placeholder: "FormCategory.NOM.PLACEHOLDER",
      name: "title",
      type: "text",
      column: 12,
      required: "FormCategory.NOM.IS_REQUIRED",
    },
    {
      label: "FormCategory.MINIATURE.LIBELLE",
      name: "image",
      type: "file",
      column: 12,
      required: "FormCategory.MINIATURE.IS_REQUIRED",
    },
  ];
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CategoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private campaignsService: CampaignService,
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
      id: ["", []],
      title: ["", [Validators.required]],
      image: ["",[Validators.required]],
    });

    if (this.data?.type === "edit" && this.data?.property) {
      this.form.patchValue({
        id: this.data?.property?.id,
        title: this.data?.property?.title,
        image: this.data?.property?.image,
      });
    }
  }

  public isFormValid(): boolean {
    return this.form.valid;
  }

  public closeModal() {
    this.dialogRef.close(true);
  }

  async handlePaymentModeOperation(
    operation: () => Promise<any>,
  ): Promise<void> {
    try {
      this.loading = true;
      await operation();
    } finally {
      this.loading = false;
    }
  }

  async storeCampaignsCategoryMode(): Promise<void> {
    if (this.isFormValid()) {
      const formData = new FormData();
      // console.log(this.form.get('title').value);
      // console.log(this.form.get('image').value);
      
      formData.append('title',this.form.get('title').value);
      
      formData.append('image',this.form.get('image').value);
      
  
      await this.handlePaymentModeOperation(() =>
        handleStoreCategoryCampaign(
          () =>
            this.campaignsService.storeCampaignCategoryMode(
              formData,
            ),
          this.dialogRef,
          this.notyfService,
        ),
        
      );
      this.updateSuccessful.emit();
    } else {
      this.showErrorNotification();
    }
  }

  handleFileInput(event: any): void {
    if(event.target.files.length > 0)
    {
      const file = event.target.files[0];
      this.form.get('image').setValue(file);
    }
  }

  async updateCampaignsCategoryMode(): Promise<void> {
    if (this.isFormValid()) {
      const formData = new FormData();
  
      const id = this.form.get('id').value;
      const title = this.form.get('title').value;
      const image = this.form.get('image').value;
      formData.append('id', id);
      formData.append('title', title);
      formData.append('image', image);
  
      try {
        const result = await this.handlePaymentModeOperation(() =>
          handleUpdateCategoryCampaign(
            () => this.campaignsService.updateCampaignCategory(formData),
            this.dialogRef,
            this.notyfService,
          ),
        );
        // console.log('Update result:', result);
        this.updateSuccessful.emit();
      } catch (error) {
        console.error("Error updating campaign category: ", error);
        this.showErrorNotification();
      }
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
