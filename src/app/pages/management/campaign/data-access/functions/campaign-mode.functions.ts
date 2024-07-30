import { firstValueFrom, Observable } from "rxjs";
import { NotyfService } from "@/shared/services/notyf.service";
import { MatDialogRef } from "@angular/material/dialog";
import { CategoryFormComponent } from "../../ui/feature/category-form/category-form.component";

export async function handleGetAllCampaignMode(
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

export async function handleUpdateCampaignsStatusMode(
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

  /*SECTION CATEGORY_CAMPAIGNS */

  export async function handleGetAllCategoryCampaign(
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
  
  export async function handleStoreCategoryCampaign(
    storeFn: () => Observable<any>,
    dialogService: MatDialogRef<CategoryFormComponent>,
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
  
  export async function handleUpdateCategoryCampaign(
    updateFn: () => Observable<any>,
    dialogService: MatDialogRef<CategoryFormComponent>,
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

  export async function handleDeleteCatecoryCampaigns(
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
  
  export async function handleDeleteCategoryCampaign(
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


  export async function handleUpdateCaterogyStatusMode(
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



