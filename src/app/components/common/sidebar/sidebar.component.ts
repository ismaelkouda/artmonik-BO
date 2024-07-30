import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ToggleService } from "@/components/common/header/toggle.service";
import { sidebarMenuAdmin } from "./menu-data";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  @ViewChild("externalTemplate", { read: TemplateRef })
  externalTemplate: TemplateRef<any>;
  panelOpenState = false;
  isToggled = false;
  public menuItems: any = [];
  public sidebarMenuAdmin = sidebarMenuAdmin;
  public active: any;
  constructor(private toggleService: ToggleService) {
    this.toggleService.isToggled$.subscribe((isToggled) => {
      this.isToggled = isToggled;
    });
  }

  public handleKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.key === " ") {
      this.toggle();
    }
  }

  public toggle() {
    this.toggleService.toggle();
  }

  public ngOnInit() {
    this.menuItems = this.sidebarMenuAdmin;
  }
}
