import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { EndPointUrl } from "../api.enum";
import { CommonApiService } from "src/app/core/common/common-api.service";
import {
  ResetPasswordData,
  SignInData,
} from "src/app/core/entities/user-model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: CommonApiService) {}

  signIn(data: SignInData): Observable<any> {
    const url: string = <string>EndPointUrl.SIGN_IN;
    return this.http.post(`${url}`, data);
  }

  resetPassword(data: ResetPasswordData): Observable<any> {
    const url: string = <string>EndPointUrl.RESET_PASSWORD;
    return this.http.post(`${url}`, data);
  }
}
