import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AproposComponent } from "./ui/apropos/apropos.component";
import { ChampsActionComponent } from "./ui/champs-action/champs-action.component";


const routes: Routes = [
    {
      path: "apropos",
      component: AproposComponent,
    },
    {
      path: "champs-action",
      component: ChampsActionComponent,
    }
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })

export class LabelRoutingModule {}