import { NgModule } from "@angular/core";
import { AuthenticationComponent } from "./ui/authentication.component";
import { AuthenticationRoutingModule } from "./authentication-routing.module";
import { NgxLoadingModule } from "ngx-loading";
import { FooterAuthComponent } from "./ui/footer-auth/footer-auth.component";
import { SignInFormComponent } from "./ui/signin-form/signin-form.component";
import { ForgotPasswordFormComponent } from "./ui/forgot-password-form/forgot-password-form.component";
import { SharedModule } from "@/shared/shared.module";

@NgModule({
  imports: [
    SharedModule,
    AuthenticationRoutingModule,
    NgxLoadingModule,
  ],
  declarations: [
    AuthenticationComponent,
    ForgotPasswordFormComponent,
    FooterAuthComponent,
    SignInFormComponent,
  ],
  providers: [],
})
// @ts-ignore
export class AuthenticationModule {}
