import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthenticationComponent } from "./ui/authentication.component";

export const SIGN_IN = "sign-in";
export const FORGOT_PASSWORD = "forgot-password";

export const authentificationRoutes: Routes = [
  {
    path: SIGN_IN,
    component: AuthenticationComponent,
    data: {
      title:
        "Connexion - Dedicated to the internal management and administration of operations related to our security services.",
    },
  },
  // {
  //   path: FORGOT_PASSWORD,
  //   component: AuthenticationComponent,
  //   data: {
  //     title:
  //       "Mot de passe oublié - Dedicated to the internal management and administration of operations related to our security services.",
  //   },
  // },
  {
    path: '**',
    redirectTo: SIGN_IN,
},
];

@NgModule({
  imports: [RouterModule.forChild(authentificationRoutes)],
  exports: [RouterModule],
})
// @ts-ignore
export class AuthenticationRoutingModule {}
