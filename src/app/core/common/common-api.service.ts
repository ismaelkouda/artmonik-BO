import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { httpOptions } from "./http-options";
import { EnvService } from "@/shared/services/env.service";

@Injectable({
  providedIn: "root",
})
export class CommonApiService {
  public APP_URL: any;
  constructor(
    private http: HttpClient,
    private envService: EnvService,
  ) {
    this.APP_URL = this.envService.apiUrl;
  }

  get(url: string, options = httpOptions) {
    return this.http.get(`${this.APP_URL}${url}`, options);
  }

  post(url: string, data: {}, options = httpOptions) {
    return this.http.post(`${this.APP_URL}${url}`, data, options);
  }

  put(url: string, data: {}, options = httpOptions) {
    return this.http.put(`${this.APP_URL}${url}`, data, options);
  }

  patch(url: string, data: {}, options = httpOptions) {
    return this.http.patch(`${this.APP_URL}${url}`, data, options);
  }

  delete(url: string, options = httpOptions) {
    return this.http.delete(`${this.APP_URL}${url}`, options);
  }
}
