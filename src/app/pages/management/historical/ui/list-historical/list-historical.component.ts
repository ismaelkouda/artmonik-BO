import { NotyfService } from '@/shared/services/notyf.service';
import { DateFormatService } from '@/shared/utils/date-format.service';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { handleGetAllHistoricalMode, handleSearchHistorical } from '../../data-access/functions/historical-mode.function';
import { HistoricalService } from '../../data-access/services/historical-mode.service';
import { HistoricalModel } from '@/core/entities/historical/historicalModel';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserProfile } from '@/core/entities/user-model';

@Component({
  selector: 'app-list-historical',
  templateUrl: './list-historical.component.html',
  styleUrls: ['./list-historical.component.scss']
})
export class ListHistoricalComponent {

  @ViewChild("dt") dt: Table;
  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    this.dt.filterGlobal(value, "contains");
  }
  public breadcrumbObject: any = {
    first: "HISTORICAL.BREADCRUMB.FIRST",
    second: "HISTORICAL.BREADCRUMB.SECOND",
  };
  public response: any;
 
  public listUser: Array<UserProfile> = [];
  public listModules;
  filterForm: FormGroup;
  public formInputFilter: any[] = [
    {
      label: "FORMFILTER.DATE_DEBUT.LIBELLE",
      placeholder: "FORMFILTER.DATE_DEBUT.PLACEHOLDER",
      name: "dateDebut",
      type: "date",
      column: 2,
      required: "FORMFILTER.DATE_DEBUT.IS_REQUIRED",
    },
    {
      label: "FORMFILTER.DATE_FIN.LIBELLE",
      name: "dateFin",
      type: "date",
      column: 2,
      required: "FORMFILTER.DATE_FIN.IS_REQUIRED",
    },
    {
      label: "FORMFILTER.UTILISATEUR.LIBELLE",
      placeholder: "FORMFILTER.UTILISATEUR.PLACEHOLDER",
      name: "utilisateur",
      type: "select",
      column: 3,
      required: "FORMFILTER.UTILISATEUR.IS_REQUIRED",
      options: "listUser",
      optionLabel: "libelle",
      filterBy: "libelle",
      optionValue: "libelle",
    },
    {
      label: "FORMFILTER.MODULE.LIBELLE",
      placeholder: "FORMFILTER.MODULE.PLACEHOLDER",
      name: "module",
      type: "select",
      column: 3,
      required: "FORMFILTER.MODULE.IS_REQUIRED",
      options: "listModules",
      optionLabel: "libelle",
      filterBy: "libelle",
      optionValue: "libelle",
    },
  ];

  onSubmit() {
    // Handle form submission
  }

  public columns = [
    {
      field: "Date",
      header: "HISTORICAL.COLUMNS.0.header",
      isText: true,
    },
    {
      field: "event",
      header: "HISTORICAL.COLUMNS.1.header",
      isText: true,
    },
    {
      field: "Action",
      header: "HISTORICAL.COLUMNS.2.header",
      isText: true,
    },
    {
      field: "Source",
      header: "HISTORICAL.COLUMNS.3.header",
      isText: true,
    },
   

  ];
  public globalFilterFieldsObject: string[] = [
    "Date",
    "event",
    "Action",
    "Source",
  ];
  public listHistorical: any = [];
  public listHistoricalFilter: any = [];

  private subscriptions: Subscription = new Subscription();
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private historicalService: HistoricalService,
    private titleService: Title,
    private dateFormatService: DateFormatService,
    private notyfService: NotyfService,
    private fb : FormBuilder
  ) {

    this.filterForm = this.fb.group({
      dateDebut: [''],
      dateFin: [''],
      selectedUser: [null]
    });

    
  }

  async ngOnInit() {
    this.subscribeToRouteData();
    this.subscribeToPaymentModeStorage();
  }

  async ngAfterViewInit() {
    await this.loadAllHistorical();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private subscribeToRouteData(): void {
    this.subscriptions.add(
      this.route.data.subscribe((data) => {
        const title = data["title"] || "Default Title";
        this.titleService.setTitle(title);
      }),
    );
  }

  private async subscribeToPaymentModeStorage() {
    this.subscriptions.add();
  }

  public async loadAllHistorical(): Promise<void> {
    this.response = await handleGetAllHistoricalMode(
      () => this.historicalService.getAllHistorical(),
      this.notyfService,
    );
    this.listHistorical = this.response?.data.map((historicalMode) =>
      this.mapMemberModeDates(historicalMode),
    );
  }

  public async searchHistoricalMode(dataInParam:any):Promise<void> {
    
      this.listHistoricalFilter = await handleSearchHistorical(
        (criteria) => this.historicalService.searchHistorical(criteria),
        dataInParam,
        this.notyfService
      );
      this.listHistorical = this.response?.map((historicalMode) =>
      this.mapMemberModeDates(historicalMode),
    );
    
  }

  private mapMemberModeDates(campaignMode: any): HistoricalModel {
    return {
      ...campaignMode,
      createdat: this.dateFormatService.formatIsoDate(campaignMode.createdon),
      updatedat: this.dateFormatService.formatIsoDate(campaignMode.updatedon),
    };
  } 


  public getCellValue(field: string, MemberMode: any): string {
    if (!field) return "";
    const fieldParts = field.split(".");
    let value = MemberMode;
    for (const part of fieldParts) {
      value = value ? value[part] : "";
    }
    return value;
  }

}
