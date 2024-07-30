import { firstValueFrom, Observable } from "rxjs";
import { NotyfService } from "src/app/shared/services/notyf.service";

export async function handleGetAllInfoDashboard(
  getAllFn: () => Observable<any>,
  notyfService: NotyfService,
): Promise<void> {
  try {
    const res = await firstValueFrom(getAllFn());
    
    if (!res?.error) {
      //notyfService.showToast("success", res?.message, "toast-success");
      return res;
    } else {
      return res;
    }
  } catch (err) {
    notyfService.showToast("error", "An error occurred", "toast-danger");
    throw err;
  }
}
