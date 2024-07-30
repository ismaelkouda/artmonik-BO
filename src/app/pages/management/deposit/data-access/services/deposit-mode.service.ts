import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CommonApiService } from "@/core/common/common-api.service";
import { DepositModeEndPointUrl } from "../enums/deposit-mode.enums";

@Injectable({
  providedIn: "root",
})
export class DepositService {
  constructor(private http: CommonApiService) {}

  getAllDeposit(page : number = 1): Observable<any> {
    const url: string = DepositModeEndPointUrl.GET_ALL_DEPOSIT_MODE.replace(
      "{number}",
      page.toString(),
    );
    return this.http.get(`${url}`);
  }


}
