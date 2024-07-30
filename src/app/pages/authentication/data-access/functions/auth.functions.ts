import { Observable } from "rxjs";
import { NotyfService } from "src/app/shared/services/notyf.service";
import { firstValueFrom } from "rxjs";
import { ApiResponse } from "@/core/entities/api-response-model";
import { EncodingDataService } from "@/shared/services/encoding-data.service";

export async function handleSignIn(
  signInFn: () => Observable<any>,
  notyfService: NotyfService,
  storageService: EncodingDataService,
): Promise<void> {
  try {
    const res: ApiResponse = await firstValueFrom(signInFn());
    if (res) {
      storageService.saveData("sessiontoken", res.data.access_token);
      storageService.saveData("userSession", JSON.stringify(res.data.user));
      window.location.href = "/dashboard";
    } else {
      console.error('Erreur dans la réponse API:', res);
    }
  } catch (err) {
    console.error('Erreur lors de l\'appel API:', err);
    throw err;
  }
}

export async function handleResetPassword(
  resetPasswordFn: () => Observable<any>,
  notyfService: NotyfService
): Promise<void> {
  try {
    const res = await firstValueFrom(resetPasswordFn());
    if (!res?.error) {
    } else {
      notyfService.showToast("error", res?.message, "toast-danger");
    }
  } catch (err) {
    notyfService.showToast("error", err, "toast-danger");
    throw err;
  }
}
