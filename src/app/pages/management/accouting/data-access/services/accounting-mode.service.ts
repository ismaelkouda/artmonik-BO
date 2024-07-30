import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CommonApiService } from "@/core/common/common-api.service";
import { AccountingModeEndPointUrl } from "../enums/accounting-mode.enums";

@Injectable({
  providedIn: "root",
})
export class AccountingService {
  constructor(private http: CommonApiService) {}

  getAllAccounting(page : number =1): Observable<any> {
    const url: string = AccountingModeEndPointUrl.GET_ALL_ACCOUNTING_MODE.replace(
      "{number}",
      page.toString(),
    );
    return this.http.get(`${url}`);
  }

}