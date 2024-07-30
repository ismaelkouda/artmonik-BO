import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListComponent } from "./ui/list/list.component";
import { DetailAskComponent } from "./ui/detail-ask/detail-ask.component";

const routes: Routes = [
  {
    path: "list",
    component: ListComponent,
    data: {
      title:
        "Demande profil collecteur - Dedicated to the internal management and administration of operations related to our security services.",
    },
  },
  {
    path: "detail",
    component: DetailAskComponent,
    data: {
      title:
        "Details profil collecteur - Dedicated to the internal management and administration of operations related to our security services.",
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
// @ts-ignore
export class ColectorProfileRoutingModule {}
