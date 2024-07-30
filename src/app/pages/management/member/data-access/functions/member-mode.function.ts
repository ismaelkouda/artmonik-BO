import { firstValueFrom, Observable } from "rxjs";
import { NotyfService } from "@/shared/services/notyf.service";

export async function handleGetAllMemberMode(
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


export async function handleChangeMemberStatus(
  checkStatusFn: () => Observable<any>,
  updateStatusFn: () => Observable<any>,
  notyfService: NotyfService,
): Promise<void> {
  try {
    const statusRes = await firstValueFrom(checkStatusFn());
    if (statusRes?.isActive) {
      const updateRes = await firstValueFrom(updateStatusFn());
      if (updateRes?.status) {
        notyfService.showToast("success", updateRes?.message, "toast-success");
      } else {
        notyfService.showToast("error", updateRes?.message, "toast-danger");
      }
    } else {
      notyfService.showToast("error", "User is not active", "toast-danger");
    }
  } catch (err) {
    notyfService.showToast("error", "An error occurred", "toast-danger");
    throw err;
  }
}

export async function handleUpdateMemberStatusMode(
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