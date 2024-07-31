import { ExcelService } from '@/shared/services/excel.service';
import { NotyfService } from '@/shared/services/notyf.service';
import { Component, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Table } from 'primeng/table';
import { Observable, Subscription } from 'rxjs';
import { HistoryService } from './data-access/services/history.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DateFormatService } from '@/shared/utils/date-format.service';
import { Title } from '@angular/platform-browser';
import { handleGetHistory } from './data-access/functions/history.functions';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {

  @ViewChild("dt") dt: Table;
  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    this.dt.filterGlobal(value, "contains");
  }

  @Input() submodule: string;
  @Input() titlepage: string;
  
  private subscriptions: Subscription = new Subscription();

  public filterForm: FormGroup;
  public userOptions : any =[];
  public formInputFilter: any[] = [
    {
      label: "FORMFILTER.DATE_DEBUT.LIBELLE",
      placeholder: "FORMFILTER.DATE_DEBUT.PLACEHOLDER",
      name: "dateDebut",
      type: "date",
      column: 6,
      required: "FORMFILTER.DATE_DEBUT.IS_REQUIRED",
    },
    {
      label: "FORMFILTER.DATE_FIN.LIBELLE",
      name: "dateFin",
      type: "date",
      column: 6,
      required: "FORMFILTER.DATE_FIN.IS_REQUIRED",
    },
   {
      label: "FORMFILTER.UTILISATEUR.LIBELLE",
      placeholder: "FORMFILTER.UTILISATEUR.PLACEHOLDER",
      name: "utilisateur",
      type: "select",
      column: 4,
      required: "FORMFILTER.UTILISATEUR.IS_REQUIRED",
      options: "listUser",
      optionLabel: "libelle",
      filterBy: "libelle",
      optionValue: "libelle",
    },
   
  ];
  public response: any;
  public columns = [
    {
      field: "user.name",
      header: "HISTORY.COLUMNS.0.header",
      isText: true,
      isCenter:true,
    },
    {
      field: "event",
      header: "HISTORY.COLUMNS.2.header",
      isText: true,
      isCenter:true,   
     },
    {
      field: "action",
      header: "HISTORY.COLUMNS.1.header",
      isText: true,
      isCenter:true,
    },
    {
      field: "created_at",
      header: "HISTORY.COLUMNS.3.header",
      isText: true,
      isCenter:true,
    },
    
  ];
  public globalFilterFieldsObject: string[] = [
    "name",
    "email",
    "role",
    "status",
    "created_at",
    "updated_at",
  ];

  

  
  public listHistory: any = [];

  public totalRecords: number;
  public rows: number;
  public currentPage: number = 1;
  public totalPages: number;
  public pageSize: number ;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private titleService: Title,
    private historyService: HistoryService,    
    private translate: TranslateService,
    private excelService: ExcelService,
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
    this.subscribeToUserStorage();
    this.userOptions = [
      { label: 'User 1', value: 'user1' },
      { label: 'User 2', value: 'user2' },
      // Add more users as needed
    ];
  }

  async ngAfterViewInit() {
    await this.loadAllHistory();
    // console.log(this.loadAllHistory());
    
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

  private async subscribeToUserStorage() {
    this.subscriptions.add();
  }

  public async loadAllHistory(dateDebut?: string, dateFin?: string): Promise<void> {
    this.response = await handleGetHistory(
      () => this.historyService.getAllHistory(this.submodule, this.currentPage, dateDebut, dateFin),
      this.notyfService,
    );

    this.totalRecords = this.response?.data?.total,
    this.currentPage = this.response?.data?.current_page,
    this.totalPages = this.response?.data?.total_pages,
    this.rows = this.response?.data?.per_page,

    this.listHistory = this.response?.data?.data
    .map((history) => this.mapUserDates(history));
    
  }

  public async handleToggleViewDetails(data) : Promise<void> {
  }

  public onPageChange(event: any): void {    
   this.listHistory(event.page +1)
  }

  
  private mapUserDates(history: any): any {
    return {
      ...history,
      created_at: this.dateFormatService.formatIsoDate(history.created_at),
      updated_at: this.dateFormatService.formatIsoDate(history.updated_at),
    };
  }


  
  public exportExcel(): void {
    if (this.isListEmpty()) {
      this.showNoDataToast();
      return;
    }

    try {
      const data = this.mapUserData();
      this.excelService.exportAsExcelFile(
        data,
        this.translate.instant("History list"),
      );
    } catch (error) {
      console.error("Failed to export data", error);
    }
  }

  private isListEmpty(): boolean {
    return this.listHistory?.length === 0;
  }

  private showNoDataToast(): void {
    this.notyfService.showToast(
      "error",
      this.translate.instant("noDataInTable"),
      "toast-error",
    );
  }

  private mapUserData(): any[] {
    return this.listHistory.map((element: any) => ({
      [this.translate.instant("FormUser.COLUMNS.0.header")]: element?.nom,
      [this.translate.instant("FormUser.COLUMNS.1.header")]: element?.prenom,
      [this.translate.instant("FormUser.COLUMNS.2.header")]: element?.email,
      [this.translate.instant("FormUser.COLUMNS.3.header")]: element?.profil,
      [this.translate.instant("FormUser.COLUMNS.4.header")]: element?.createdat,
      [this.translate.instant("FormUser.COLUMNS.5.header")]: element?.updatedat,
    }));
  }

  public getCellValue(field: string, module: any): string {
    if (!field) return "";
    const fieldParts = field.split(".");
    let value = module;
    for (const part of fieldParts) {
      value = value ? value[part] : "";
    }
    return value;
  }

}
