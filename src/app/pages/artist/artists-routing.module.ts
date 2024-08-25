import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ArtistsComponent } from "./ui/artists/artists.component";
import { DetailsArtistsComponent } from "./features/artists/details-artists/details-artists.component";
import { FormArtistsComponent } from "./features/artists/form-artists/form-artists.component";

export const ARTISTS = "artists";
export const FORM = "form";
export const DETAILS_ARTISTS = "details-artists";

const routes: Routes = [
    {
        path: '',
        component: ArtistsComponent,
    },
    {
        path: `${DETAILS_ARTISTS}/:id`,
        component: DetailsArtistsComponent
    },
    {
        path: `${FORM}/:id`,
        component: FormArtistsComponent
    },
    {
      path: '',
      redirectTo: `${ARTISTS}`,
      pathMatch: 'full'
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)]
})

export class ArtistRoutingModule {

}
