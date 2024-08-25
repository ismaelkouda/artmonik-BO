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

export class LabelService {
    public BASE_URL: any;

    constructor(private http: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }
    //Apropos
    getAproposAll(): Observable<any> {
        const url: string = (<string>(EndPointUrl.APROPOS_ALL));
        return this.http.get(`${this.BASE_URL}${url}`);
    }
    postAproposAdd(data): Observable<any> {
        const url: string = <string>(EndPointUrl.APROPOS_ADD);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
    postAproposUpdate(data): Observable<any> {
        const url: string = <string>(EndPointUrl.APROPOS_UPDATE);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
    postAproposDelete(data): Observable<any> {
        const url: string = <string>(EndPointUrl.APROPOS_DELETE);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }



    getAproposRolesAll(): Observable<any> {
      const url: string = <string>(
        EndPointUrl.APROPOS_ROLES_ALL
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

     //Apropos
     getChampsActionAll(): Observable<any> {
        const url: string = (<string>(EndPointUrl.CHAMPS_ACTION_ALL));
        return this.http.get(`${this.BASE_URL}${url}`);
    }
    postChampsActionAdd(data): Observable<any> {
        const url: string = <string>(EndPointUrl.CHAMPS_ACTION_ADD);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
    postChampsActionUpdate(data): Observable<any> {
        const url: string = <string>(EndPointUrl.CHAMPS_ACTION_UPDATE);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
    postChampsActionDelete(data): Observable<any> {
        const url: string = <string>(EndPointUrl.CHAMPS_ACTION_DELETE);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
}
