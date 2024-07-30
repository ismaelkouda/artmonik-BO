import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CommonApiService } from "@/core/common/common-api.service";
import { FaqEndPointUrl } from "../enums/faq.enums";

@Injectable({
  providedIn: "root",
})
export class FaqService {
  constructor(private http: CommonApiService) {}

  getAllFaq(page : number): Observable<any> {
    const url: string = FaqEndPointUrl.GET_ALL_FAQ.replace(
      "{number}",
      page.toString(),
    );
    return this.http.get(`${url}`);
  }

  storeFaq(data): Observable<any> {
    const url: string = FaqEndPointUrl.STORE_FAQ;
    return this.http.post(`${url}`, data);
  }

  updateFaq(data): Observable<any> {
    const url: string = FaqEndPointUrl.UPDATE_FAQ.replace("{id}", data?.id);
    return this.http.put(`${url}`, data);
  }

  deleteFaq(data): Observable<any> {
    const url: string = FaqEndPointUrl.DELETE_FAQ.replace("{id}", data?.id);
    return this.http.delete(`${url}`, data);
  }


  FaqStatus(id :string , enable : boolean) : Observable<any> {
    const url : string = enable? FaqEndPointUrl.UPDATE_FAQ_STATUS_ENABLE : 
    FaqEndPointUrl.UPDATE_FAQ_STATUS_DISABLE

    const finalUrl : string = url.replace(
      "{id}",
      id,
    )
    
    return this.http.patch(`${finalUrl}`, id);
  }





}
