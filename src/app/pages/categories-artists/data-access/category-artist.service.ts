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
export class CategoryArtistService {
    public BASE_URL: any;

    constructor(private http: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }
    //categories
    getArtistsCategoriesAll(): Observable<any> {
        const url: string = <string>(EndPointUrl.ARTISTS_CATEGORIES_ALL);
        return this.http.get(`${this.BASE_URL}${url}`);
    }
    postArtistsCategoriesCreate(data): Observable<any> {
        const url: string = <string>(EndPointUrl.ARTISTS_CATEGORIES_CREATE);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }
    postArtistsCategoriesUpdate(data): Observable<any> {
        const url: string = <string>(EndPointUrl.ARTISTS_CATEGORIES_UPDATE);
        return this.http.post(`${this.BASE_URL}${url}`, data, httpOptions);
    }

    putArtistsCategoriesChangeStatus(data): Observable<any> {
      const url: string = EndPointUrl.ARTISTS_CATEGORIES_CHANGE_STATUS;
      return this.http.put(`${url}`, data, httpOptions);
    }

    deleteArtistsCategoriesChangedelete(data): Observable<any> {
        const url: string = EndPointUrl.ARTISTS_CATEGORIES_DELETE;
        return this.http.delete(`${url}`, data);
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
