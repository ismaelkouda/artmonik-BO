import { Injectable } from "@angular/core";
import { ApplicationModule } from "./enums/application-module.enum";

@Injectable({
  providedIn: "root",
})
export class ApplicationConstantsService {
  /**
   * Add all the constants required across the application
   */
  public MODULE_ROLE_MAPPING = {};

  public ROLE_MODULE_ACTION_MAPPING = {
    [ApplicationModule.DASHBOARD]: {},
  };
}
