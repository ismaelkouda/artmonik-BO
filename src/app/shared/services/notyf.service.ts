import { Injectable } from "@angular/core";
import { Notyf } from "notyf";

@Injectable({
  providedIn: "root",
})
export class NotyfService {
  notyf = new Notyf();
  constructor() {}

  public showToast(type: string, message: string, className: string) {
    this.notyf.open({
      type: type,
      message: message,
      duration: 5000,
      ripple: true,
      dismissible: false,
      position: {
        x: "right",
        y: "top",
      },
      className: className,
    });
  }

  public showWarningToast(type: string, message: string) {
    this.notyf.open({
      type: type,
      message: message,
      duration: 5000,
      ripple: true,
      dismissible: false,
      icon: {
        className: "material-icons",
        tagName: "i",
        text: "warning",
      },
      position: {
        x: "right",
        y: "top",
      },
      className: "toast-warning",
    });
  }
}
