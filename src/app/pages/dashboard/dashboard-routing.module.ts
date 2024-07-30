import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./ui/dashboard.component";

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    data: {
      title:
        "Tableau de bord - Dedicated to the internal management and administration of operations related to our security services.",
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
// @ts-ignore
export class DashboardRoutingModule {}
