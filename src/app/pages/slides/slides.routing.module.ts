import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SlidesComponent } from "./ui/slides/slides.component";


const routes: Routes = [
    {
      path: "",
      component: SlidesComponent,
    }
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })

export class SlidesRoutingModule {}