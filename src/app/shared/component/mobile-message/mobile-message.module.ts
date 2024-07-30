import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { MobileMessageComponent } from "./ui/mobile-message.component";
import { TranslateModule } from "@ngx-translate/core";

const routes: Routes = [
  {
    path: "",
    component: MobileMessageComponent,
  },
];

@NgModule({
  imports: [CommonModule, TranslateModule, RouterModule.forChild(routes)],
  declarations: [MobileMessageComponent],
})
export class MobileMessageModule {}
