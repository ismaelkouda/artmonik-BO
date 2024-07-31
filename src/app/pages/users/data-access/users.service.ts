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

export class UsersService {
    public BASE_URL: any;

    constructor(private http: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }
    //Users
    getUsersAll(): Observable<any> {
        const url: string = (<string>(EndPointUrl.ADMIN_ALL));
        return this.http.get(`${this.BASE_URL}${url}`);
    }
    postUsersAdd(data): Observable<any> {
        const url: string = <string>(EndPointUrl.ADMIN_ADD);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
    postUsersUpdate(data): Observable<any> {
        const url: string = <string>(EndPointUrl.ADMIN_UPDATE);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
    postUsersDelete(data): Observable<any> {
        const url: string = <string>(EndPointUrl.ADMIN_DELETE);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
}
