import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListComponent } from "./ui/list/list.component";
import { CategoryComponent } from "./ui/category/category.component";

const routes: Routes = [
  {
    path: "list",
    component: ListComponent,
    data: {
      title:
        "Liste - Dedicated to the internal management and administration of operations related to our security services.",
    },
  },
  {
    path: "category",
    component: CategoryComponent,
    data: {
      title:
        "Catégories - Dedicated to the internal management and administration of operations related to our security services.",
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
// @ts-ignore
export class CampaignRoutingModule {}
