// import { EvenementielService } from "@/pages/evenementiels/data-access/evenementiels.service";
// import { EvenementielStateService } from "@/pages/evenementiels/data-access/evenementiels/evenementiels-state.service";
// import { handle } from "@/shared/functions/api.function";
// import { EVENEMENTIEL, MANAGEMENT } from "@/shared/routes/routes";
// import { NotyfService } from "@/shared/services/notyf.service";
// import { Component, OnInit } from "@angular/core";
// import { FormBuilder } from "@angular/forms";
// import { ActivatedRoute, Router } from "@angular/router";
// import { TranslateService } from "@ngx-translate/core";

// type TYPEVIEW = "détails";

// @Component({
//     selector: "app-details-evenementiels",
//     templateUrl: "./details-evenementiels.component.html",
//     styleUrls: [`./details-evenementiels.component.scss`]
// })

// export class DetailsEvenementielsComponent implements OnInit {
//     public view: TYPEVIEW;
//     public page: number;
//     public id: number;
//     public filter: Object;
//     private listEvenementiels: Array<Object>;
//     public evenementielSelected: Object;
//     public breadcrumbObject: any = {
//         first: "FormEvenementiel.BREADCRUMB.FIRST",
//         second: "FormEvenementiel.BREADCRUMB.SECOND",
//     };
//     public indexTabPanelActive: number = 0;

//     constructor(private router: Router, private fb: FormBuilder, private notyfService: NotyfService,
//         private activatedRoute: ActivatedRoute, private evenementielStateService: EvenementielStateService,
//         private evenementielService: EvenementielService, private translate: TranslateService
//     ) {}

//     ngOnInit(): void {
//         this.getParamsInUrl();
//     }


//     private getParamsInUrl(): void {
//         this.activatedRoute.queryParams.subscribe((params: Object) => {
//             this.view = params?.["view"];
//             this.page = params?.["page"];
//             this.id = params?.["id"];
//             this.filter = this.evenementielStateService.parseQueryStringToObject(params?.["filter"]);
//         });
//         this.getEvenementielsAll(this.filter);
//     }

//     async getEvenementielsAll(dataToSend = {}): Promise<any> {
//         const response: any = await handle(() => this.evenementielService.getEvenementielsAll(), this.notyfService);
//         this.handleSuccessfulPageCallback(response);
//     }

//     private handleSuccessfulPageCallback(response: any): void {
//         this.listEvenementiels = response?.data;
//         this.getEvenementielSelected(this.listEvenementiels);
//     }

//     private getEvenementielSelected(listEvenementiels: Array<Object>): void {
//         this.evenementielSelected = listEvenementiels.find((evenementiel) => evenementiel?.["id"] == this.id);
//         if(this.evenementielSelected) this.getTitlePage();
//     }
//     public getTitlePage(): string {
//         const evenementielName = this.evenementielSelected?.["nom_complet"] || "...";
//         return this.translate.instant("FormEvenementiel.BODY_TITLE_DETAILS").replace("{libelle}", `[${evenementielName}]`);
//     }
//     public closeInterface(): void {
//         this.router.navigate([`${MANAGEMENT}/${EVENEMENTIEL}`]);
//     }
// }