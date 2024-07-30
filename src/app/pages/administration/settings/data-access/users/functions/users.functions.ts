import { firstValueFrom, Observable } from "rxjs";
import { NotyfService } from "@/shared/services/notyf.service";
import { MatDialogRef } from "@angular/material/dialog";
import { UsersFormComponent } from "@/pages/administration/settings/ui/users/feature/users-form/users-form.component";

export async function handleGetAllUsers(
  getAllFn: () => Observable<any>,
  notyfService: NotyfService,
): Promise<void> {
  try {
    const res = await firstValueFrom(getAllFn());
    if (res) {
      return res;
    }
  } catch (err) {
    console.error("error", "An error occurred", "toast-danger");
    throw err;
  }
}

export async function handleStoreUsers(
  storeFn: () => Observable<any>,
  dialogService: MatDialogRef<UsersFormComponent>,
  notyfService: NotyfService,
): Promise<void> {
  try {
    const res = await firstValueFrom(storeFn());
    if (res) {
      notyfService.showToast("success", res?.message, "toast-success");
    }
  } catch (err) {
    console.error("error", "An error occurred", "toast-danger");
    throw err;
  }
}

export async function handleDeleteUsers(
  deleteFn: () => Observable<any>,
  notyfService: NotyfService,
): Promise<void> {
  try {
    const res = await firstValueFrom(deleteFn());
    if (res) {
      notyfService.showToast("success", res?.message, "toast-success");
    }
  } catch (err) {
    console.error("error", "An error occurred", "toast-danger");
    throw err;
  }
}

export async function handleUpdateUserStatusMode(
  updateStatusFn: () => Observable<any>,
  notyfService: NotyfService,
): Promise<void> {
  try {
    const res = await firstValueFrom(updateStatusFn());
    if (res) {
      notyfService.showToast("success", res?.message, "toast-success");
    }
  } catch (err) {
    console.error("error", "An error occurred", "toast-danger");
    throw err;
  }
}



