import { firstValueFrom, Observable } from "rxjs";
import { NotyfService } from "@/shared/services/notyf.service";
import { MatDialogRef } from "@angular/material/dialog";
import { DetailAskComponent } from "../../ui/detail-ask/detail-ask.component";

export async function handleGetAllCollectorRequestMode(
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

export async function handleStoreRequest(
  storeFn: () => Observable<any>,
  dialogService: MatDialogRef<DetailAskComponent>,
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