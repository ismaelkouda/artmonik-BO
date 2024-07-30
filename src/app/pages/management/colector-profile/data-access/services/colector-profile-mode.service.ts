import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { CommonApiService } from "@/core/common/common-api.service";
import { ColectorProfileModeEndpoint } from "../enums/colector-profile-mode.enums";

@Injectable({
  providedIn: "root",
})
export class CollectorRequestService {
  constructor(private http: CommonApiService) {}

  getAllCollector(page : number = 1): Observable<any> {
    const url: string = ColectorProfileModeEndpoint.GET_ALL_REQUEST_COLECTOR_MODE.replace(
      "{number}",
      page.toString(),
    );
    return this.http.get(`${url}`);
  }

  storeRequestCollector(data): Observable<any> {

    if (!data || !data.id) {
      console.error('Invalid data object, it must contain an id property:', data);
      return throwError('Invalid data object');
    }
    
    const url: string = ColectorProfileModeEndpoint.STORE_FEEDBACK_REQUEST_COLECTOR_MODE.replace(
      "{id}",
      data.id,
    );

    console.log('Generated URL:', url);
    console.log('Data to be sent:', data);
    
    return this.http.post(`${url}`, data);
  }


}
