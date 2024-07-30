import { firstValueFrom, Observable } from "rxjs";
import { NotyfService } from "@/shared/services/notyf.service";

export async function handleGetAllHistoricalMode(
  getAllFn: () => Observable<any>,
  notyfService: NotyfService,
): Promise<void> {
  try {
    const res = await firstValueFrom(getAllFn());
    if (res?.status) {
      return res;
    } else {
      notyfService.showToast("error", res?.message, "toast-danger");
    }
  } catch (err) {
    notyfService.showToast("error", "An error occurred", "toast-danger");
    throw err;
  }
}

export async function handleSearchHistorical(
  searchFn: (criteria : any) => Observable<any>,
  criteria:any,
  notyfService: NotyfService,
) : Promise<any> {
  try {
    const res = await firstValueFrom(searchFn(criteria));
    if (res?.status) {
      return res.data;
    } else {
      notyfService.showToast('error', res?.message, 'toast-danger');
    }
  } catch (err) {
    notyfService.showToast('error', 'An error occurred', 'toast-danger');
    throw err;
  }
}