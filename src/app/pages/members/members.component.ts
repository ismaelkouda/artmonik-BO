import { ExcelService } from '@/shared/services/excel.service';
import { NotyfService } from '@/shared/services/notyf.service';
import { DateFormatService } from '@/shared/utils/date-format.service';
import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { MembersService } from './data-access/members.service';
import { handle } from '@/shared/functions/api.function';
import { MembersFormComponent } from './features/members-form.component';


interface DialogData {
  type: string;
  property: any;
}
@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent {

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
      field: "fullname",
      header: "MEMBERS.COLUMNS.0.header",
      isText: true
    },
    {
      field: "email",
      header: "MEMBERS.COLUMNS.1.header",
      isText: true
    },
    {
      field: "whatsapp",
      header: "MEMBERS.COLUMNS.2.header",
      isText: true
    },
    {
      field: "motivation",
      header: "MEMBERS.COLUMNS.3.header",
      isText: true
    },
    {
      field: "invite_by",
      header: "MEMBERS.COLUMNS.4.header",
      isText: true
    },
    {
      field: "payment_method",
      header: "MEMBERS.COLUMNS.5.header",
      isText: true
    },
    {
      field: "status",
      header: "MEMBERS.COLUMNS.6.header",
      isCenter: true,
      isBadge: true,
    },
    {
      field: "created_at",
      header: "MEMBERS.COLUMNS.7.header",
      isText: true,
      isCenter: true,
    },
    {
      field: "updated_at",
      header: "MEMBERS.COLUMNS.8.header",
      isText: true,
      isCenter: true,
    },
  ];
  public globalFilterFieldsObject: string[] = [
    "fullname",
    "email",
    "whatsapp",
    "motivation",
    "invite_by",
    "payment_method",
    "status",
    "created_at",
    "updated_at",
  ];
  public listMembers: any = [];
  public spinner: boolean = true;

  public totalRecords: number;
  public rows: number;
  public currentPage: number = 1;
  public totalPages: number;
  public pageSize: number;

  private subscriptions: Subscription = new Subscription();
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private membersService: MembersService,
    private translate: TranslateService,
    private excelService: ExcelService,
    private dateFormatService: DateFormatService,
    private notyfService: NotyfService,
  ) { }

  async ngOnInit() {
    this.subscribeToRouteData();
    this.subscribeToPaymentModeStorage();
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

  async ngAfterViewInit() {
    await this.getMembersAll();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public async getMembersAll(dataToSend: Object = {}): Promise<void> {
    this.response = await handle(() => this.membersService.getMembersAll(), this.notyfService);
    this.spinner = false;
    this.listMembers = this.response?.data;
  }

  public exportExcel(): void {
    if (this.isListEmpty()) {
      this.showNoDataToast();
      return;
    }
    try {
      const data = this.mapMembersModeData();
      this.excelService.exportAsExcelFile(
        data,
        this.translate.instant("MembersMode list"),
      );
    } catch (error) {
      console.error("Failed to export data", error);
    }
  }

  private isListEmpty(): boolean {
    return this.listMembers?.length === 0;
  }

  private showNoDataToast(): void {
    this.notyfService.showToast(
      "error",
      this.translate.instant("noDataInTable"),
      "toast-error",
    );
  }

  private mapMembersModeData(): any[] {
    return this.listMembers.map((element: any) => ({
      [this.translate.instant("MEMBERS.COLUMNS.0.header")]: element?.fullname,
      [this.translate.instant("MEMBERS.COLUMNS.1.header")]: element?.email,
      [this.translate.instant("MEMBERS.COLUMNS.2.header")]: element?.whatsapp,
      [this.translate.instant("MEMBERS.COLUMNS.3.header")]: element?.motivation,
      [this.translate.instant("MEMBERS.COLUMNS.4.header")]: element?.invite_by,
      [this.translate.instant("MEMBERS.COLUMNS.5.header")]: element?.payment_method,
      [this.translate.instant("MEMBERS.COLUMNS.6.header")]: element?.status,
      [this.translate.instant("MEMBERS.COLUMNS.7.header")]: element?.createdat,
      [this.translate.instant("MEMBERS.COLUMNS.8.header")]: element?.updatedat,
    }));
  }

    public openDialogMembre(type: string, service: any): void {
        let dialogData: DialogData = { type: type, property: {} };
        dialogData.property = type === "edit" ? service : dialogData.property;
        const dialogRef = this.dialog.open(MembersFormComponent, {
          width: "600px",
          data: dialogData,
        });

        const instance = dialogRef.componentInstance;
        instance.updateSuccessful.subscribe(() => {
          this.getMembersAll();
        });
    }

    public getCellValue(field: string, MembersMode: any): string {
      if (!field) return "";
      const fieldParts = field.split(".");
      let value = MembersMode;
      for (const part of fieldParts) {
        value = value ? value[part] : "";
      }
      return value;
    }




  public activeTabLabel: string = 'Liste';






  private mapMembersModeDates(campaignMode: any): any {
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


  public async handleUpdateStatus(data): Promise<void> {
    const swalOptions = this.getSwalUpdateStatusOptions(`${data.name}`);
    const result = await Swal.fire(swalOptions);
    if (result.isConfirmed) {
      const enable = data.status !== 'active';
      const updatedStatus = enable ? 'active' : 'inactive';
      const updatedData = { ...data, status: updatedStatus };
      await this.confirmUpdateStatusFaqMode(updatedData, enable);
    }

  }

  public async confirmUpdateStatusFaqMode(data, enable: boolean): Promise<void> {
    // await handleUpdateMembersStatusMode(
    //   () => this.membersService.MembersStatus(data.id, enable),
    //   this.notyfService,
    // );
    // this.getMembersAll();
  }





  onChange(event: number): void {
    if (event === 0) {
      this.router.navigate(['members/list', { onglet: 'liste' }]);
    } else if (event === 1) {
      this.router.navigate(['members/list', { onglet: 'historique' }]);
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
