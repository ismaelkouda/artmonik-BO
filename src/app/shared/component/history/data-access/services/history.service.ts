import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HistoryEndPointUrl } from '../enums/history.enums';
import { CommonApiService } from '@/core/common/common-api.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(
    private http: CommonApiService
  ) { }

  getAllHistory(submodule: string, page: number, dateDebut?: string, dateFin?: string): Observable<any> {
    const url: string = `${HistoryEndPointUrl.GET_ALL_HISTORY.replace(
      "{number}", 
      page.toString(),
    )}`.replace(
      "{categories}", 
      submodule,
    );
    return this.http.get(url);
  }

 
}
