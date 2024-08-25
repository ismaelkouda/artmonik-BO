import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
    selector: "app-filter-services",
    templateUrl: "./filter-services.component.html",
    styleUrls: ["./filter-services.component.scss"]
})

export class FilterServicesComponent implements OnInit {
    @Output() filter = new EventEmitter<{}>();
    public filterForm: FormGroup;

    public formInputs: any[] = [
        {
          label: "FormServices.CODE.LIBELLE",
          placeholder: "FormServices.CODE.PLACEHOLDER",
          name: "title",
          type: "text",
          column: 4,
          required: "FormServices.CODE.IS_REQUIRED",
        },
        {
          label: "FormServices.TITRE.LIBELLE",
          placeholder: "FormServices.TITRE.PLACEHOLDER",
          name: "image",
          type: "text",
          column: 4,
          required: "FormServices.TITRE.IS_REQUIRED",
        },
      ];

      constructor(private fb: FormBuilder) {}

      ngOnInit(): void {
          this.initFilterForm();
      }

      private initFilterForm(): void {
        this.filterForm = this.fb.group({

        })
      }

      public onSubmitFilterForm(): void {
        this.filter.emit(JSON.stringify(this.filterForm.value));
      }

}