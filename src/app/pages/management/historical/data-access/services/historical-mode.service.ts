import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CommonApiService } from "@/core/common/common-api.service";
import { HistoricalModeEndPointUrl } from "../enums/historical-mode.enums";

@Injectable({
  providedIn: "root",
})
export class HistoricalService {
  constructor(private http: CommonApiService) {}

  getAllHistorical(): Observable<any> {
    const url: string = HistoricalModeEndPointUrl.GET_ALL_HISTORICAL_MODE;
    return this.http.get(`${url}`);
  }

  searchHistorical(data): Observable<any> {
    const url: string = HistoricalModeEndPointUrl.SEARCH_HISTORICAL_MODE;
    return this.http.post(`${url}`, data);
  }

}