import { Component } from "@angular/core";
import { ToggleService } from "@/components/common/header/toggle.service";

@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.scss"],
})
export class ContentComponent {
  public isToggled = false;
  public user: any;
  public active: number = 1;
  constructor(private toggleService: ToggleService) {
    this.toggleService.isToggled$.subscribe((isToggled) => {
      this.isToggled = isToggled;
    });
  }
}
