import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListDepositComponent } from "./ui/list-deposit/list-deposit.component";


const routes: Routes = [
  {
    path: "list",
    component: ListDepositComponent,
    data: {
      title:
        "Liste - Dedicated to the internal management and administration of operations related to our security services.",
    },
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
// @ts-ignore
export class DepositRoutingModule {}
