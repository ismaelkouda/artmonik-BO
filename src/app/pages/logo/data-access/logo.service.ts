import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { EndPointUrl } from "./api.enum";
import { EnvService } from "src/app/shared/services/env.service";
// const Swal = require("sweetalert2");
const httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
};
@Injectable()

export class LogoService {
    public BASE_URL: any;

    constructor(private http: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }
    //Logo
    getLogoAll(): Observable<any> {
        const url: string = (<string>(EndPointUrl.LOGO_ALL));
        return this.http.get(`${this.BASE_URL}${url}`);
    }
    postLogoAdd(data): Observable<any> {
        const url: string = <string>(EndPointUrl.LOGO_ADD);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
    postLogoUpdate(data): Observable<any> {
        const url: string = <string>(EndPointUrl.LOGO_UPDATE);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
    postLogoDelete(data): Observable<any> {
        const url: string = <string>(EndPointUrl.LOGO_DELETE);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
}
