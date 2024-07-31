import { LoadingBarService } from '@ngx-loading-bar/core';
import { Observable } from "rxjs";
import { NotyfService } from '../services/notyf.service';
export async function handle(allFn: () => Observable<any>, notyfService: NotyfService): Promise<void> {
    try {
        const res = await allFn().toPromise();
        if (res?.error) {
                notyfService.showToast("error", this.response.message, "toast-danger");
        } else {
            return res;
        }
    } catch (err) {
        console.error("error", "An error occurred", "toast-danger");
        notyfService.showToast("error", err.error.message, "toast-danger");
    }
}