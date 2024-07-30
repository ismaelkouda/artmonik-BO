import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListHistoricalComponent } from "./ui/list-historical/list-historical.component";


const routes: Routes = [
  
  {
    path: "list",
    component: ListHistoricalComponent,
    data: {
      title: "Liste des accès - Dedicated to the internal management and administration of operations related to our security services.",
    },
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
// @ts-ignore
export class HistoricalRoutingModule {}
