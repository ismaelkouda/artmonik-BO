import { firstValueFrom, Observable } from "rxjs";
import { NotyfService } from "@/shared/services/notyf.service";
import { MatDialogRef } from "@angular/material/dialog";
import { FaqFormComponent } from "../../../ui/faq/feature/faq-form/faq-form.component";

export async function handleGetAllFaq(
  getAllFn: () => Observable<any>,
  notyfService: NotyfService,
): Promise<void> {
  try {
    const res = await firstValueFrom(getAllFn());
    if (!res?.error) {
      return res;
    } else {
      notyfService.showToast("error", res?.message, "toast-danger");
    }
  } catch (err) {
    notyfService.showToast("error", "An error occurred", "toast-danger");
    throw err;
  }
}

export async function handleStoreFaq(
  storeFn: () => Observable<any>,
  dialogService: MatDialogRef<FaqFormComponent>,
  notyfService: NotyfService,
): Promise<void> {
  try {
    const res = await firstValueFrom(storeFn());
    if (!res?.error) {
      notyfService.showToast("success", res?.message, "toast-success");
      dialogService.close();
    } else {
      notyfService.showToast("error", res?.message, "toast-danger");
    }
  } catch (err) {
    notyfService.showToast("error", "An error occurred", "toast-danger");
    throw err;
  }
}

export async function handleUpdateFaq(
  updateFn: () => Observable<any>,
  dialogService: MatDialogRef<FaqFormComponent>,
  notyfService: NotyfService,
): Promise<void> {
  try {
    const res = await firstValueFrom(updateFn());
    if (!res?.error) {
      notyfService.showToast("success", res?.message, "toast-success");
      dialogService.close();
    } else {
      notyfService.showToast("error", res?.message, "toast-danger");
    }
  } catch (err) {
    notyfService.showToast("error", "An error occurred", "toast-danger");
    throw err;
  }
}

export async function handleDeleteFaq(
  deleteFn: () => Observable<any>,
  notyfService: NotyfService,
): Promise<void> {
  try {
    const res = await firstValueFrom(deleteFn());
    if (!res?.error) {
      notyfService.showToast("success", res?.message, "toast-success");
    } else {
      notyfService.showToast("error", res?.message, "toast-danger");
    }
  } catch (err) {
    notyfService.showToast("error", "An error occurred", "toast-danger");
    throw err;
  }
}

export async function handleUpdateFaqStatusMode(
  updateStatusFn: () => Observable<any>,
  notyfService: NotyfService,
): Promise<void> {
  try {
    const res = await firstValueFrom(updateStatusFn());
    if (!res?.error) {
      notyfService.showToast("success", res?.message, "toast-success");
    } else {
      notyfService.showToast("error", res?.message, "toast-danger");
    }
  } catch (err) {
    notyfService.showToast("error", "An error occurred", "toast-danger");
    throw err;
  }
}





