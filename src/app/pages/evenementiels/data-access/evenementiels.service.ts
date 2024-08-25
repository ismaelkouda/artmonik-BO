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

export class EvenementielService {
    public BASE_URL: any;

    constructor(private http: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }
    //categories
    getEvenementielsCategoriesAll(): Observable<any> {
        const url: string = <string>(EndPointUrl.EVENEMENTIELS_CATEGORIES_ALL);
        return this.http.get(`${this.BASE_URL}${url}`);
    }
    postEvenementielsCategoriesCreate(data): Observable<any> {
        const url: string = <string>(EndPointUrl.EVENEMENTIELS_CATEGORIES_CREATE);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
    postEvenementielsCategoriesUpdate(data): Observable<any> {
        const url: string = <string>(EndPointUrl.EVENEMENTIELS_CATEGORIES_UPDATE);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
    //Evenementiels
    getEvenementielsAll(): Observable<any> {
        const url: string = (<string>(EndPointUrl.EVENEMENTIELS_ALL));
        return this.http.get(`${this.BASE_URL}${url}`);
    }
    postEvenementielsAdd(data): Observable<any> {
        const url: string = <string>(EndPointUrl.EVENEMENTIELS_ADD);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
    postEvenementielsUpdate(data): Observable<any> {
        const url: string = <string>(EndPointUrl.EVENEMENTIELS_UPDATE);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
    postEvenementielsDelete(data): Observable<any> {
        const url: string = <string>(EndPointUrl.EVENEMENTIELS_DELETE);
        return this.http.delete(`${this.BASE_URL}${url}`, data);
    }
    getEvenementielsRolesAll(): Observable<any> {
      const url: string = <string>(
        EndPointUrl.EVENEMENTIELS_ROLES_ALL
      );
      return this.http.get(`${this.BASE_URL}${url}`);
    }
    getArtistsCategoriesAll(): Observable<any> {
        const url: string = <string>(EndPointUrl.ARTISTS_CATEGORIES_ALL);
        return this.http.get(`${this.BASE_URL}${url}`);
    }

    // async showPassword(data: Object): Promise<any> {
    //     await Swal.mixin({
    //         customClass: {
    //             confirmButton: "btn btn-success",
    //             cancelButton: "btn btn-danger",
    //         },
    //         buttonsStyling: false,
    //     }).fire({
    //         icon: "warning",
    //         html: `${data}`,
    //         confirmButtonColor: "#F07427",
    //         confirmButtonText: "ok",
    //     })
    //         .then((result) => {
    //             if (result.isConfirmed) {
    //                 return result.isConfirmed;
    //             }
    //         });
    // }
}
