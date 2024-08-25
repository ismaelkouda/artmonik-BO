import { NgModule } from "@angular/core";
import { EvenementielRoutingModule } from "./evenementiels-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { NgxLoadingModule } from "ngx-loading";
import { NgxPaginationModule } from "ngx-pagination";
import { EvenementielService } from "./data-access/evenementiels.service";
import { EvenementielsComponent } from "./ui/evenementiels/evenementiels.component";
import { FormEvenementielsComponent } from "./features/evenementiels/form-evenementiels/form-evenementiels.component";
// import { DetailsEvenementielsComponent } from "./features/evenementiels/details-evenementiels/details-evenementiels.component";
import { EvenementielStateService } from "./data-access/evenementiels/evenementiels-state.service";
import { EvenementielApiStateService } from "./data-access/evenementiels/evenementiels-api-state.service";
import { TranslateService } from "@ngx-translate/core";


@NgModule({
    declarations: [
        EvenementielsComponent, FormEvenementielsComponent, 
        // DetailsEvenementielsComponent
    ],
    imports: [
        EvenementielRoutingModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        SharedModule,
        MatTableModule,
        MatPaginatorModule,
        MatDialogModule,
        NgxPaginationModule,
        NgxLoadingModule,
    ],
    providers: [TranslateService, EvenementielService, EvenementielStateService, EvenementielApiStateService]
})

export class EvenementielModule {

}
