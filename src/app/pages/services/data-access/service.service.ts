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

export class ServiceService {
    public BASE_URL: any;

    constructor(private http: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }
    //categories
    getServicesCategoriesAll(): Observable<any> {
        const url: string = <string>(EndPointUrl.SERVICES_CATEGORIES_ALL);
        return this.http.get(`${this.BASE_URL}${url}`);
    }
    postServicesCategoriesCreate(data): Observable<any> {
        const url: string = <string>(EndPointUrl.SERVICES_CATEGORIES_CREATE);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
    postServicesCategoriesUpdate(data): Observable<any> {
        const url: string = <string>(EndPointUrl.SERVICES_CATEGORIES_UPDATE);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
    postCategoryServicesDelete(data): Observable<any> {
        const url: string = <string>(EndPointUrl.SERVICES_CATEGORIES_DELETE);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
    //Services
    getServicesAll(): Observable<any> {
        const url: string = (<string>(EndPointUrl.SERVICES_ALL));
        return this.http.get(`${this.BASE_URL}${url}`);
    }
    postServicesAdd(data): Observable<any> {
        const url: string = <string>(EndPointUrl.SERVICES_ADD);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
    postServicesUpdate(data): Observable<any> {
        const url: string = <string>(EndPointUrl.SERVICES_UPDATE);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
    postServicesDelete(data): Observable<any> {
        const url: string = <string>(EndPointUrl.SERVICES_DELETE);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }



    getServicesRolesAll(): Observable<any> {
      const url: string = <string>(
        EndPointUrl.SERVICES_ROLES_ALL
      );
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
