import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { EndPointUrl } from "./api.enum";
import { EnvService } from "src/app/shared/services/env.service";

const httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
};
@Injectable()

export class MembersService {
    public BASE_URL: any;

    constructor(private http: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }
    //Members
    getMembersAll(): Observable<any> {
        const url: string = (<string>(EndPointUrl.MEMBER_ALL));
        return this.http.get(`${this.BASE_URL}${url}`);
    }
    postMembersAdd(data): Observable<any> {
        const url: string = <string>(EndPointUrl.MEMBER_ADD);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
    postMembersUpdate(data): Observable<any> {
        const url: string = <string>(EndPointUrl.MEMBER_UPDATE);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
    postMembersDelete(data): Observable<any> {
        const url: string = <string>(EndPointUrl.MEMBER_DELETE);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
}
