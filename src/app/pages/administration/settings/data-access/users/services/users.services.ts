import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CommonApiService } from "@/core/common/common-api.service";
import { UsersEndPointUrl } from "@/pages/administration/settings/data-access/users/enums/users.enums";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  constructor(private http: CommonApiService) {}

  getAllUsers(): Observable<any> {
    const url: string = UsersEndPointUrl.GET_ALL_USER;
    return this.http.get(`${url}`);
  }

  storeUsers(data): Observable<any> {
    const url: string = UsersEndPointUrl.STORE_USER;
    return this.http.post(`${url}`, data);
  }

  deleteUsers(data): Observable<any> {
    const url: string = UsersEndPointUrl.DELETE_USER;
    return this.http.delete(`${url}`, data);
  }

  changeStatus(data) : Observable<any> {
    const url : string = UsersEndPointUrl.CHANGE_STATUS;
    return this.http.put(`${url}`, {'status' : data});
  }

}
