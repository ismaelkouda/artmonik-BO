import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
    selector: "app-filter-slides",
    templateUrl: "./filter-slides.component.html",
    styleUrls: ["./filter-slides.component.scss"]
})

export class FilterSlidesComponent implements OnInit {
    @Output() filter = new EventEmitter<{}>();
    public filterForm: FormGroup;

    public formInputs: any[] = [
        {
          label: "FormSlides.TITRE.LIBELLE",
          placeholder: "FormSlides.TITRE.PLACEHOLDER",
          name: "image",
          type: "text",
          column: 4,
          required: "FormSlides.TITRE.IS_REQUIRED",
        },
        {
          label: "FormSlides.DESCRIPTION.LIBELLE",
          placeholder: "FormSlides.DESCRIPTION.PLACEHOLDER",
          name: "description",
          type: "text",
          column: 4,
          required: "FormSlides.DESCRIPTION.IS_REQUIRED",
        },
        {
          label: "FormSlides.LIEN_PAGE.LIBELLE",
          placeholder: "FormSlides.LIEN_PAGE.PLACEHOLDER",
          name: "page_link",
          type: "text",
          column: 4,
          required: "FormSlides.LIEN_PAGE.IS_REQUIRED",
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