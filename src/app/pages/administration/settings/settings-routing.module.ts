import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UsersComponent } from "@/pages/administration/settings/ui/users/users.component";
import { FaqComponent } from "@/pages/administration/settings/ui/faq/faq.component";

const routes: Routes = [
  {
    path: "users",
    component: UsersComponent,
    data: {
      title:
        "Administrateurs - Dedicated to the internal management and administration of operations related to our security services.",
    },
  },

  {
    path: "faq",
    component: FaqComponent,
    data: {
      title:
        "FAQ - Dedicated to the internal management and administration of operations related to our security services.",
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
// @ts-ignore
export class SettingsRoutingModule {}
