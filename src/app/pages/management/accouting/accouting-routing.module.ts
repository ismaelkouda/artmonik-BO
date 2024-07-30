import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListComponent } from "./ui/list/list.component";

const routes: Routes = [
  {
    path: "load",
    component: ListComponent,
    data: {
      title:
        "Rechargements - Dedicated to the internal management and administration of operations related to our security services.",
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
// @ts-ignore
export class AccoutingRoutingModule {}
