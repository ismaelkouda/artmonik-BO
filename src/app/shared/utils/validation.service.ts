import { Injectable } from "@angular/core";
import { AbstractControl, ValidatorFn } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class ValidationService {
  validateLibelle(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const libellePattern = /^[A-Za-z0-9\s]*$/;
      const isValid = libellePattern.test(control.value);

      return isValid ? null : { invalidLibelle: { value: control.value } };
    };
  }
}
