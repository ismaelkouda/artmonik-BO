import { Injectable } from "@angular/core";
import { DatePipe } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class DateFormatService {
  constructor(private datePipe: DatePipe) {}

  public formatIsoDate(dateString: string): string {
    return this.datePipe.transform(dateString, "yyyy-MM-dd HH:mm:ss") || "";
  }

  public formatIsoDate2(dateString: string): string {
    return this.datePipe.transform(dateString, "yyyy-MM-dd") || "";
  }
}
