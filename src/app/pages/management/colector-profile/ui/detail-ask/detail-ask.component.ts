import { EnvService } from '@/shared/services/env.service';
import { NotyfService } from '@/shared/services/notyf.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CollectorRequestService } from '../../data-access/services/colector-profile-mode.service';
import { TranslateService } from '@ngx-translate/core';
import { handleStoreRequest } from '../../data-access/functions/colector-profile-mode.functions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-detail-ask',
  templateUrl: './detail-ask.component.html',
  styleUrls: ['./detail-ask.component.scss']
})
export class DetailAskComponent implements OnInit {
  public loading = false;

  collectorData: any;
  form: FormGroup;
  evaluationOptions: any[] = [
    { label: 'OUI', value: 'approved' },
    { label: 'NON', value: 'rejected' }
  ];
  selectedEvaluation: string;
  evaluationComment: string;
  public BASE_URL: any;
  

  displayLargePhoto: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DetailAskComponent>,
    private envService: EnvService,
    private notyfService: NotyfService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private collectorService: CollectorRequestService,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) {
    this.BASE_URL = this.envService.baseUrl;
  }

  async ngOnInit() {
    this.loading = true;
    this.initForm();
    this.loading = false;
  }

  private initForm() {
    this.form = this.fb.group({
      id: [''],
      status: ['', Validators.required],
      validation_details: ['', Validators.required],
      // Ajoutez ici d'autres champs du collectorData si nécessaire
    });

    if (this.data) {
      this.form.patchValue({
        id: this.data.id,
        status: this.data.status || '',
        validation_details: this.data.validation_details || '',
      });
    }
  }

  public isFormValid(): boolean {
    return this.form.valid;
  }

  async onValidate(): Promise<void> {
    if (this.isFormValid()) {
      const updatedData = this.form.getRawValue();
      // console.log("Data sending", updatedData);
      

      await this.handleCollectorOperation(() =>
           handleStoreRequest(
          () => this.collectorService.storeRequestCollector(updatedData),
          this.dialogRef,
          this.notyfService,
        ),
      );
    } else {
      this.showErrorNotification();
    }
  }

  async handleCollectorOperation(operation: () => Promise<any>): Promise<void> {
    try {
      this.loading = true;
      await operation();
    } finally {
      this.loading = false;
    }
  }
  close(): void {
    this.dialogRef.close();
  }

  showLargePhoto() {
    this.displayLargePhoto = true;
  }

  private showErrorNotification() {
    this.translate
      .get("GeneralStrings.MessageToast.FORM.REQUIRED_FIELDS")
      .subscribe((translation: string) => {
        this.notyfService.showToast("error", translation, "toast-danger");
      });
  }
}