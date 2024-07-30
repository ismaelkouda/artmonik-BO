import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListMemberComponent } from "./ui/list-member/list-member.component";


const routes: Routes = [
  
  {
    path: "list",
    component: ListMemberComponent,
    data: {
      title: "Liste des membres - Dedicated to the internal management and administration of operations related to our security services.",
    },
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
// @ts-ignore
export class MemberRoutingModule {}
