import { Component } from "@angular/core";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-not-network",
  templateUrl: "./not-network.component.html",
  styleUrls: ["./not-network.component.scss"],
})
export class NotNetworkComponent {
  public title =
    "Problème de réseau - An innovative employee appraisal platform designed to help companies optimize their performance management and foster the professional development of their teams.";

  constructor(private titleService: Title) {}
  public ngOnInit() {
    this.titleService.setTitle(`${this.title}`);
  }
}
