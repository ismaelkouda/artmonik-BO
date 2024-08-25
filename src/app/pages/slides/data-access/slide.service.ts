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

export class SlideService {
    public BASE_URL: any;

    constructor(private http: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }
    //Slides
    getSlidesAll(): Observable<any> {
        const url: string = (<string>(EndPointUrl.SLIDES_ALL));
        return this.http.get(`${this.BASE_URL}${url}`);
    }
    postSlidesAdd(data): Observable<any> {
        const url: string = <string>(EndPointUrl.SLIDES_ADD);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
    postSlidesUpdate(data): Observable<any> {
        const url: string = <string>(EndPointUrl.SLIDES_UPDATE);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
    postSlidesDelete(data): Observable<any> {
        const url: string = <string>(EndPointUrl.SLIDES_DELETE);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }



    getSlidesRolesAll(): Observable<any> {
      const url: string = <string>(
        EndPointUrl.SLIDES_ROLES_ALL
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
