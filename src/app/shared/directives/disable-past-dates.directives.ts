import { Directive, ElementRef, HostListener, Input } from "@angular/core";
import { FormControl } from "@angular/forms";

@Directive({
  selector: "[appDisablePastDates]",
})
export class DisablePastDatesDirective {
  @Input() appDisablePastDates: FormControl;

  constructor(private el: ElementRef) {}

  @HostListener("input") onInput() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const inputValue = this.el.nativeElement.value;
    const inputDate = new Date(inputValue);

    if (inputDate < currentDate) {
      this.appDisablePastDates.setValue(null);
    }
  }
}
