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

export class MessagingService {
    public BASE_URL: any;

    constructor(private http: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }
    //Messaging
    getMessagingAll(): Observable<any> {
        const url: string = (<string>(EndPointUrl.MESSAGE_ALL));
        return this.http.get(`${this.BASE_URL}${url}`);
    }
    postMessagingAdd(data): Observable<any> {
        const url: string = <string>(EndPointUrl.MESSAGE_ADD);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
    postMessagingUpdate(data): Observable<any> {
        const url: string = <string>(EndPointUrl.MESSAGE_UPDATE);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
    postMessagingDelete(data): Observable<any> {
        const url: string = <string>(EndPointUrl.MESSAGE_DELETE);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
}
