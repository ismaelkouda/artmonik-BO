import { NotyfService } from '@/shared/services/notyf.service';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ngxLoadingAnimationTypes } from "ngx-loading";
import { CampaignService } from '../../../data-access/services/campaign-mode.service';
import { handleUpdateCampaignsStatusMode } from '../../../data-access/functions/campaign-mode.functions';


const PrimaryWhite = "#ffffff";
const SecondaryGrey = "#ccc";
@Component({
  selector: 'app-status-modal',
  templateUrl: './status-modal.component.html',
  styleUrls: ['./status-modal.component.scss']
})
export class StatusModalComponent implements OnInit  {

  public loading = false;
  @Output() updateSuccessful = new EventEmitter<void>();

  public form: FormGroup;
  public primaryColour = PrimaryWhite;
  public secondaryColour = SecondaryGrey;
  
  liststatus: Array<{ status: string }> = [
    { status: 'submited' },
    { status: 'inprogress' },
    { status: 'suspended' },
    { status: 'canceled' }
  ];
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public formInputs: any[] = [
    {
      label: "STATUT_MODAL.STATUT.LIBELLE",
      placeholder: "STATUT_MODAL.STATUT.PLACEHOLDER",
      name: "status",
      type: "select",
      column: 12,
      required: "STATUT_MODAL.STATUT.IS_REQUIRED",
      options: this.liststatus,
      optionLabel: "status",
      filterBy: "status",
      optionValue: "status",
    },
   
    
  ];
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<StatusModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private campaignsService: CampaignService,
    private translate: TranslateService,
    private notyfService: NotyfService,

    
  ) {

  }

  async ngOnInit() {
    this.loading = true;
    this.initForm();
    this.loading = false;
  }

  private initForm() {
    this.form = this.fb.group({
      id:["",[]],
      status: [null],
    });

    if (this.data?.type === "edit" && this.data?.property) {

      this.form.patchValue({
        id: this.data?.property.id,
        status: this.data?.property.status,
      });

    }
  }

  public isFormValid(): boolean {
    return this.form.valid;
  }

  public closeModal() {
    this.dialogRef.close(true);
  }

  async handleCampaignStatusOperation(operation: () => Promise<any>): Promise<void> {
    try {
      this.loading = true;
      await operation();
    } finally {
      this.loading = false;
    }
  }

  async updateStatusCampaigns(): Promise<void> {
   if (this.isFormValid()) {
      const CampaignStatusData = this.form.getRawValue();
      await this.handleCampaignStatusOperation(() =>
      handleUpdateCampaignsStatusMode(
          () => this.campaignsService.updateCampaignsStatusMode(CampaignStatusData),
          this.notyfService,
        ),
      );
      this.updateSuccessful.emit();
      this.closeModal();
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
