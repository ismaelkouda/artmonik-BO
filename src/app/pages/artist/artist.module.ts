import { NgModule } from "@angular/core";
import { ArtistRoutingModule } from "src/app/pages/artist/artists-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { NgxLoadingModule } from "ngx-loading";
import { NgxPaginationModule } from "ngx-pagination";
import { ArtistService } from "src/app/pages/artist/data-access/artist.service";
import { ArtistsComponent } from "./ui/artists/artists.component";
import { FormArtistsComponent } from "./features/artists/form-artists/form-artists.component";
import { DetailsArtistsComponent } from "./features/artists/details-artists/details-artists.component";
import { ArtistStateService } from "./data-access/artist/artist-state.service";
import { ArtistApiStateService } from "./data-access/artist/artist-api-state.service";
import { ReusableFormArtistsComponent } from "./features/artists/reusable-form-artists/reusable-form-artists.component";
import { IdentificationArtistsComponent } from "./features/artists/identification-artists/identification-artists.component";
import { TranslateService } from "@ngx-translate/core";


@NgModule({
    declarations: [
        ArtistsComponent, FormArtistsComponent, DetailsArtistsComponent, ReusableFormArtistsComponent, IdentificationArtistsComponent
    ],
    imports: [
        ArtistRoutingModule,
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
    providers: [TranslateService, ArtistService, ArtistStateService, ArtistApiStateService]
})

export class ArtistModule {

}
