import { ExcelService } from '@/shared/services/excel.service';
import { NotyfService } from '@/shared/services/notyf.service';
import { DateFormatService } from '@/shared/utils/date-format.service';
import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { MemberService } from '../../data-access/services/member-mode.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { handleGetAllMemberMode, handleUpdateMemberStatusMode } from '../../data-access/functions/member-mode.function';
import { MemberModel } from '@/core/entities/member/memberModel';
import Swal, { SweetAlertOptions } from 'sweetalert2';


interface DialogData {
  type: string;
  property: any;
}
@Component({
  selector: 'app-list-member',
  templateUrl: './list-member.component.html',
  styleUrls: ['./list-member.component.scss']
})
export class ListMemberComponent {

  @ViewChild("dt") dt: Table;
  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    this.dt.filterGlobal(value, "contains");
  }
  public breadcrumbObject: any = {
    first: "MEMBERS.BREADCRUMB.FIRST",
    second: "MEMBERS.BREADCRUMB.SECOND",
  };
  public response: any;
  public columns = [
    {
      field: "name",
      header: "MEMBERS.COLUMNS.0.header",
      isText: true,
      isCenter: true,
    },
    {
      field: "email",
      header: "MEMBERS.COLUMNS.1.header",
      isText: true,
      isCenter: true,
    },
    {
      field: "status",
      header: "MEMBERS.COLUMNS.2.header",
      isBadge: true,
      isCenter: true,
    },
    {
      field: "created_at",
      header: "MEMBERS.COLUMNS.3.header",
      isText: true,
      isCenter: true,
    },
    {
      field: "updated_at",
      header: "MEMBERS.COLUMNS.4.header",
      isText:true,
      isCenter: true,
    },

  ];
  public globalFilterFieldsObject: string[] = [
    "name",
    "email",
    "status",
    "created_at",
    "updated_at",
  ];
  public listMember: any = [];

  public totalRecords: number;
  public rows: number;
  public currentPage: number = 1;
  public totalPages: number;
  public pageSize: number ;

  private subscriptions: Subscription = new Subscription();
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router : Router,
    private titleService: Title,
    private memberService: MemberService,
    private translate: TranslateService,
    private excelService: ExcelService,
    private dateFormatService: DateFormatService,
    private notyfService: NotyfService,
  ) {}

  async ngOnInit() {
    this.subscribeToRouteData();
    this.subscribeToPaymentModeStorage();
  }

  async ngAfterViewInit() {
    await this.loadAllMember();
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

  public activeTabLabel: string = 'Liste';


  private async subscribeToPaymentModeStorage() {
    this.subscriptions.add();
  }

  public async loadAllMember(nb : number=1): Promise<void> {
    this.response = await handleGetAllMemberMode(
      () => this.memberService.getAllMember(nb),
      this.notyfService,
    );
    this.totalRecords = this.response?.data?.total,
    this.currentPage = this.response?.data?.current_page,
    this.totalPages = this.response?.data?.total_pages,
    this.rows = this.response?.data?.per_page,

    this.listMember = this.response?.data?.data
    .filter(member => member.role ==='donor')
    .map((memberMode) =>
      this.mapMemberModeDates(memberMode),
    );
  }

  public onPageChange(event: any): void {    
    this.loadAllMember(event.page +1)
   }

  private mapMemberModeDates(campaignMode: any): MemberModel {
    return {
      ...campaignMode,
      created_at: this.dateFormatService.formatIsoDate(campaignMode.created_at),
      updated_at: this.dateFormatService.formatIsoDate(campaignMode.updated_at),
    };
  }

  translateStatus(status: string): string {
    const statusTranslations: { [key: string]: string } = {
      'active': 'actif',
      'inactive': 'inactif',
    };

    return statusTranslations[status] || status;
  }

 
  public exportExcel(): void {
    if (this.isListEmpty()) {
      this.showNoDataToast();
      return;
    }
    try {
      const data = this.mapMemberModeData();
      this.excelService.exportAsExcelFile(
        data,
        this.translate.instant("MemberMode list"),
      );
    } catch (error) {
      console.error("Failed to export data", error);
    }
  }

  private isListEmpty(): boolean {
    return this.listMember?.length === 0;
  }

  private showNoDataToast(): void {
    this.notyfService.showToast(
      "error",
      this.translate.instant("noDataInTable"),
      "toast-error",
    );
  }

  private mapMemberModeData(): any[] {
    return this.listMember.map((element: any) => ({
      [this.translate.instant("MEMBERS.COLUMNS.0.header")]: element?.fullname,
      [this.translate.instant("MEMBERS.COLUMNS.1.header")]: element?.email,
      [this.translate.instant("MEMBERS.COLUMNS.3.header")]: element?.statut,
      [this.translate.instant("MEMBERS.COLUMNS.4.header")]: element?.dateCreation,
      [this.translate.instant("MEMBERS.COLUMNS.5.header")]: element?.dateModification,
    }));
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


  public async handleUpdateStatus(data): Promise<void> {
    const swalOptions = this.getSwalUpdateStatusOptions(`${data.name}`);
    const result = await Swal.fire(swalOptions);
    if (result.isConfirmed) {
      const enable = data.status !== 'active'; 
      const updatedStatus = enable ? 'active' : 'inactive';
      const updatedData = { ...data, status: updatedStatus };
    await this.confirmUpdateStatusFaqMode(updatedData , enable);
    }

  }

  public async confirmUpdateStatusFaqMode(data , enable : boolean): Promise<void> {
    await handleUpdateMemberStatusMode(
      () => this.memberService.UserStatus(data.id , enable),
      this.notyfService,
    );
    this.loadAllMember();
  }

  

  

  onChange(event: number): void {
    if(event === 0) {
      this.router.navigate(['member/list', {onglet: 'liste'}]);
    } else if(event === 1) {
      this.router.navigate(['member/list', {onglet: 'historique'}]);
    }
  }
  
  public getSwalUpdateStatusOptions(libelle: string): SweetAlertOptions {
    return {
      title: this.translate.instant(
        "MEMBERS.UPDATE_CONFIRMATION_STATUS.title",
      ),
      html: this.translate.instant(
        "MEMBERS.UPDATE_CONFIRMATION_STATUS.message",
        {
          libelle: libelle,
        },
      ),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#569C5B",
      cancelButtonColor: "#dc3545",
      cancelButtonText: this.translate.instant(
        "MEMBERS.UPDATE_CONFIRMATION_STATUS.cancelButton",
      ),
      confirmButtonText: this.translate.instant(
        "MEMBERS.UPDATE_CONFIRMATION_STATUS.confirmButton",
      ),
    };
  }
}
