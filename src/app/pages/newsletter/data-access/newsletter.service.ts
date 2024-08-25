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

export class NewsletterService {
    public BASE_URL: any;

    constructor(private http: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }
    //Newsletter
    getNewsletterAll(): Observable<any> {
        const url: string = (<string>(EndPointUrl.NEWSLETTER_ALL));
        return this.http.get(`${this.BASE_URL}${url}`);
    }
    postNewsletterAdd(data): Observable<any> {
        const url: string = <string>(EndPointUrl.NEWSLETTER_ADD);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
    postNewsletterUpdate(data): Observable<any> {
        const url: string = <string>(EndPointUrl.NEWSLETTER_UPDATE);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
    postNewsletterDelete(data): Observable<any> {
        const url: string = <string>(EndPointUrl.NEWSLETTER_DELETE);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
}