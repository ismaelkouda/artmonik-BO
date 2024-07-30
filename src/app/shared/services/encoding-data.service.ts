import { Injectable } from "@angular/core";
// @ts-ignore
import * as CryptoJS from "crypto-js";
import { LocalStorageService } from "ngx-webstorage";
import { ActivatedRoute } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class EncodingDataService {
  key = "Im@k0";
  constructor(
    private storage: LocalStorageService,
    private router: ActivatedRoute,
  ) {}

  public saveData(key: string, value: string) {
    this.storage.store(key, this.encrypt(value));
  }

  public getData(key: string) {
    let data = this.storage.retrieve(key) || "";
    return this.decrypt(data);
  }

  public removeData(key: string) {
    this.storage.clear(key);
  }

  public clearData() {
    this.storage.clear();
  }

  private encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, this.key).toString();
  }

  private decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(
      CryptoJS.enc.Utf8,
    );
  }
}
