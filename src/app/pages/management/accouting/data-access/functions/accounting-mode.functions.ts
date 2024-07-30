import { NotyfService } from "@/shared/services/notyf.service";
import { Observable, firstValueFrom } from "rxjs";

export async function handleGetAllRechargeMode(
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