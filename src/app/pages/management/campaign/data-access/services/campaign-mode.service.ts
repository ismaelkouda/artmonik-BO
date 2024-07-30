import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CommonApiService } from "@/core/common/common-api.service";
import { CampainsModeEndPointUrl } from "../enums/campaign-mode.enums";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class CampaignService {
  constructor(private http: CommonApiService) {}

  getAllCampaign(page : number = 1): Observable<any> {
    const url: string = CampainsModeEndPointUrl.GET_ALL_CAMPAIGN_MODE.replace(
      "{number}",
      page.toString(),
    );
    return this.http.get(`${url}`);
  }


  checkCampaignStatus(data): Observable<any> {
    const url: string = CampainsModeEndPointUrl.CHECK_CAMPAIGN_STATUS.replace("{id}", data?.id);
    return this.http.get(`${url}`);
  }

  updateCampaignsStatusMode(data): Observable<any> {
    const url: string = CampainsModeEndPointUrl.UPDATE_CAMPAIGN_STATUS_MODE.replace(
      "{id}",
      data?.id,
    ).replace(
      "{status}",
      data?.status,
    );
    return this.http.patch(`${url}`, data);
  }


  /* CATEGORY_CAMPAIGN_SERVICE */

  getAllCampaignCategory(page : number =1): Observable<any> {
    const url: string = CampainsModeEndPointUrl.GET_ALL_CAMPAIGN_CATEGORY_MODE.replace(
      "{number}",
      page.toString(),
    );
    return this.http.get(`${url}`);
  }

  storeCampaignCategoryMode(formdata : any): Observable<any> {
    const url: string = CampainsModeEndPointUrl.STORE_CAMPAIGN_CATEGORY_MODE;

    const headers = new HttpHeaders({
      'enctype': 'multipart/form-data' 
    });
    
    return this.http.post(`${url}`, formdata , {headers});
  }

 
  updateCampaignCategory(formdata : any): Observable<any> {
    
    const url: string = CampainsModeEndPointUrl.UPDATE_CAMPAIGN_CATEGORY_MODE.replace("{id}", formdata.get('id').toString());
    const headers = new HttpHeaders({
      'enctype': 'multipart/form-data' 
    });
    return this.http.post(`${url}`, formdata , {headers});
  }

  deleteCampaignCategory(data): Observable<any> {
    const url: string = CampainsModeEndPointUrl.DELETE_CAMPAIGN_CATEGORY_MODE.replace("{id}", data?.id);
    return this.http.delete(`${url}`, data);
  }


  CampaignCategorieStatus(data): Observable<any> {
    const action = data.status === 'active' ? 'disable' : 'enable';
    const url: string = CampainsModeEndPointUrl.UPDATE_CAMPAIGN_CATEGORY.replace(
      "{id}",
      data?.id,
    ).replace(
      "{status}",
      action
    );
    return this.http.patch(`${url}`, data);
  }

  


}
