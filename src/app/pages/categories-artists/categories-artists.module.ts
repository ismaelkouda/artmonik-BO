import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { NgxLoadingModule } from "ngx-loading";
import { NgxPaginationModule } from "ngx-pagination";
import { CategoryArtistRoutingModule } from "./categories-artists-routing.module";
import { FormCategoryArtistsComponent } from "./features/categories-artists/form-category-artists/form-category-artists.component";
import { CategoriesArtistsComponent } from "./ui/categories-artists.component";
import { CategoryArtistService } from "./data-access/category-artist.service";

@NgModule({
    declarations: [
        CategoriesArtistsComponent, FormCategoryArtistsComponent
    ],
    imports: [
        CategoryArtistRoutingModule,
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
    providers: [CategoryArtistService]
})

export class CategoryArtistModule {

}
