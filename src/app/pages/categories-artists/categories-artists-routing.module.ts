import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CategoriesArtistsComponent } from "./ui/categories-artists.component";

const routes: Routes = [
    {
        path: "",
        component: CategoriesArtistsComponent
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)]
})

export class CategoryArtistRoutingModule {

}
