import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Table } from "primeng/table";
import { Subscription } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import { ExcelService } from "@/shared/services/excel.service";
import { NotyfService } from "@/shared/services/notyf.service";
import Swal, { SweetAlertOptions } from "sweetalert2";
import { UsersService } from "@/pages/administration/settings/data-access/users/services/users.services";
import {
  handleDeleteUsers,
  handleGetAllUsers,
  handleUpdateUserStatusMode,
} from "@/pages/administration/settings/data-access/users/functions/users.functions";
import { UsersFormComponent } from "@/pages/administration/settings/ui/users/feature/users-form/users-form.component";
import { UserModel } from "@/core/entities/user-model";

interface DialogData {
  type: string;
  property: any;
}
@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("dt") dt: Table;
  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    this.dt.filterGlobal(value, "contains");
  }
  public breadcrumbObject: any = {
    first: "FormUser.BREADCRUMB.FIRST",
    second: "FormUser.BREADCRUMB.SECOND",
  };
  public response: any;
  public columns = [
    {
      field: "name",
      header: "FormUser.COLUMNS.0.header",
      isText: true
    },
    {
      field: "first_name",
      header: "FormUser.COLUMNS.1.header",
      isText: true
    },
    {
      field: "email",
      header: "FormUser.COLUMNS.2.header",
      isText: true
    },
    {
      field: "status",
      header: "FormUser.COLUMNS.3.header",
      isCenter: true,
      isBadge: true,
    },
    {
      field: "created_at",
      header: "FormUser.COLUMNS.4.header",
      isText: true,
      isCenter:true,
    },
    {
      field: "updated_at",
      header: "FormUser.COLUMNS.5.header",
      isText: true,
      isCenter:true,
    },
  ];
  public globalFilterFieldsObject: string[] = [
    "name",
    "first_name",
    "email",
    "role",
    "status",
    "created_at",
    "updated_at",
  ];
  public listUser: any = [];

  public totalRecords: number;
  public rows: number;


  private subscriptions: Subscription = new Subscription();
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private titleService: Title,
    private usersService: UsersService,
    private translate: TranslateService,
    private excelService: ExcelService,
    private notyfService: NotyfService,
  ) {}

  async ngOnInit() {
    this.subscribeToRouteData();
    this.subscribeToUserStorage();
  }

  async ngAfterViewInit() {
    await this.loadAllUsers();
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

  public async loadAllUsers(): Promise<void> {
    this.response = await handleGetAllUsers(
      () => this.usersService.getAllUsers(),
      this.notyfService,
    );
    this.listUser = this.response?.data;
  }

  public onPageChange(): void {
   this.loadAllUsers()
  }

  translateStatus(status: string): string {
    const statusTranslations: { [key: string]: string } = {
      'active': 'actif',
      'inactive': 'inactif',
    };

    return statusTranslations[status] || status;
  }

  public openDialogUser(type: string, data: UserModel): void {
    let dialogData: DialogData = { type: type, property: {} };
    dialogData.property = type === "edit" ? data : dialogData.property;
    const dialogRef = this.dialog.open(UsersFormComponent, {
      width: "600px",
      data: dialogData,
    });

    const instance = dialogRef.componentInstance;
    instance.updateSuccessful.subscribe(() => {
      this.loadAllUsers();
    });
  }

  public async handleDeleteUser(data): Promise<void> {
    const swalOptions = this.getSwalDeleteOptions(`${data.name}`);
    const result = await Swal.fire(swalOptions);

    if (result.isConfirmed) {
      await this.confirmDeleteUser(data);
    }
  }

  public async handleUpdateStatus(data): Promise<void> {
    const swalOptions = this.getSwalUpdateStatusOptions(`${data.name}`);
    const result = await Swal.fire(swalOptions);
    if (result.isConfirmed) {
      const enable = data.status !== 'active'; 
      const updatedStatus = enable ? 'active' : 'inactive';
      const updatedData = { ...data, status: updatedStatus };
      await this.confirmUpdateStatusUserAccount(enable);
    }
  }

  public async confirmUpdateStatusUserAccount(data): Promise<void> {
    await handleUpdateUserStatusMode(
      () => this.usersService.changeStatus(data),
      this.notyfService,
    );
    this.loadAllUsers();
  }

  public getSwalUpdateStatusOptions(name: string): SweetAlertOptions {
    return {
      title: this.translate.instant(
        "FormUser.UPDATE_CONFIRMATION_STATUS.title",
      ),
      html: this.translate.instant(
        "FormUser.UPDATE_CONFIRMATION_STATUS.message",
        {
          name: name,
          status: 'enable'
        },
      ),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#569C5B",
      cancelButtonColor: "#dc3545",
      cancelButtonText: this.translate.instant(
        "FormUser.UPDATE_CONFIRMATION_STATUS.cancelButton",
      ),
      confirmButtonText: this.translate.instant(
        "FormUser.UPDATE_CONFIRMATION_STATUS.confirmButton",
      ),
    };
  }
  public getSwalDeleteOptions(name: string): SweetAlertOptions {
    return {
      title: this.translate.instant("FormUser.DELETE_CONFIRMATION.title"),
      html: this.translate.instant("FormUser.DELETE_CONFIRMATION.message", {
        name: name,
      }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#569C5B",
      cancelButtonColor: "#dc3545",
      cancelButtonText: this.translate.instant(
        "FormUser.DELETE_CONFIRMATION.cancelButton",
      ),
      confirmButtonText: this.translate.instant(
        "FormUser.DELETE_CONFIRMATION.confirmButton",
      ),
    };
  }

  public async getUserAction(userId): Promise<any> {
    return handleDeleteUsers(
      () => this.usersService.deleteUsers(userId),
      this.notyfService,
    );
  }

  public async confirmDeleteUser(data): Promise<void> {
    try {
      this.response = await this.getUserAction(data);
      if (!this.response?.error) {
        await this.loadAllUsers();
      }
    } catch (err) {
      throw err;
    }
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
        this.translate.instant("userList"),
      );
    } catch (error) {
      console.error("Failed to export data", error);
    }
  }

  private isListEmpty(): boolean {
    return this.listUser?.length === 0;
  }

  private showNoDataToast(): void {
    this.notyfService.showToast(
      "error",
      this.translate.instant("noDataInTable"),
      "toast-error",
    );
  }

  private mapUserData(): any[] {
    return this.listUser.map((element: any) => ({
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
