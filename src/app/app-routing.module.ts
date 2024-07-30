import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NotFoundComponent } from "./components/common/not-found/ui/not-found.component";
import { ContentComponent } from "./shared/component/layout/content/content.component";
import { content } from "./shared/routes/routes";
import { FullComponent } from "./shared/component/layout/full/full.component";
import { full } from "./shared/routes/full.routes";
import { NotNetworkComponent } from "./components/common/not-network/ui/not-network.component";
import { InternalErrorComponent } from "./components/common/internal-error/ui/internal-error.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "auth/sign-in",
    pathMatch: "full",
  },
  {
    path: "mobile-message",
    loadChildren: () =>
      import(
        "src/app/shared/component/mobile-message/mobile-message.module"
      ).then((m) => m.MobileMessageModule),
  },
  {
    path: "not-network",
    component: NotNetworkComponent,
  },
  {
    path: "error-500",
    component: InternalErrorComponent,
  },
  {
    path: "",
    component: ContentComponent,
    children: content,
  },
  {
    path: "",
    component: FullComponent,
    children: full,
  },
  { path: "**", component: NotFoundComponent }, // This line will remain down from the whole pages component list
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: true,
      scrollPositionRestoration: "enabled",
      anchorScrolling: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
