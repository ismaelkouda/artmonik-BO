import { Injectable } from "@angular/core";
import { ApplicationConstantsService } from "./application-constants.service";

@Injectable({
  providedIn: "root",
})
export class CheckAccessService {
  /**
   * Provide two functions which
   */
  constructor(private constantUtility: ApplicationConstantsService) {}

  /**
   * This will help to check access of module to the logged in user
   * @param moduleName module name
   */
  checkUserHasAccess(moduleName: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      return resolve(true);
    });
  }
}
