import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LogoComponent } from "./ui/logo/logo.component";
import { LOGO } from "@/shared/routes/routes";

const routes: Routes = [
    {
      path: "",
      component: LogoComponent,
    },
    {
      path: '',
      redirectTo: `${LOGO}`,
      pathMatch: 'full'
    },
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })

export class LogoRoutingModule {}