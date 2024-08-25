import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EvenementielsComponent } from "./ui/evenementiels/evenementiels.component";
// import { DetailsEvenementielsComponent } from "./features/evenementiels/details-evenementiels/details-evenementiels.component";
import { FormEvenementielsComponent } from "./features/evenementiels/form-evenementiels/form-evenementiels.component";

export const EVENEMENTIELS = "evenementiels";
export const FORM = "form";
export const DETAILS_EVENEMENTIELS = "details-evenementiels";

const routes: Routes = [
    {
        path: '',
        component: EvenementielsComponent,
    },
    // {
    //     path: `${DETAILS_EVENEMENTIELS}/:id`,
    //     component: DetailsEvenementielsComponent
    // },
    {
        path: `${FORM}/:id`,
        component: FormEvenementielsComponent
    },
    {
      path: '',
      redirectTo: `${EVENEMENTIELS}`,
      pathMatch: 'full'
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)]
})

export class EvenementielRoutingModule {

}
