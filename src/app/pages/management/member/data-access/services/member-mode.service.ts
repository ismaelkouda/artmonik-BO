import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CommonApiService } from "@/core/common/common-api.service";
import { MemberModeEndPointUrl } from "../enums/member-mode.enums";

@Injectable({
  providedIn: "root",
})
export class MemberService {
  constructor(private http: CommonApiService) {}

  getAllMember(page :number =1): Observable<any> {
    const url: string = MemberModeEndPointUrl.GET_ALL_MEMBER_MODE.replace(
      "{number}",
      page.toString(),
    );
    return this.http.get(`${url}`);
  }

 

  UserStatus(id :string , enable : boolean) : Observable<any> {
    const url : string = enable? MemberModeEndPointUrl.UPDATE_MEMBER_STATUS_ENABLE : 
    MemberModeEndPointUrl.UPDATE_MEMBER_STATUS_DISABLE

    const finalUrl : string = url.replace(
      "{id}",
      id,
    )
    
    return this.http.patch(`${finalUrl}`, id);
  }
}
