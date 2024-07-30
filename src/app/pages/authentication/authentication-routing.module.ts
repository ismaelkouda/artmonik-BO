import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthenticationComponent } from "./ui/authentication.component";

const routes: Routes = [
  {
    path: "sign-in",
    component: AuthenticationComponent,
    data: {
      title:
        "Connexion - Dedicated to the internal management and administration of operations related to our security services.",
    },
  },
  {
    path: "forgot-password",
    component: AuthenticationComponent,
    data: {
      title:
        "Mot de passe oublié - Dedicated to the internal management and administration of operations related to our security services.",
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
// @ts-ignore
export class AuthenticationRoutingModule {}
