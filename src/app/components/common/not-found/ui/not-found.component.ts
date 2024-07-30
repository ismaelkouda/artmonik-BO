import { Component } from "@angular/core";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-not-found",
  templateUrl: "./not-found.component.html",
  styleUrls: ["./not-found.component.scss"],
})
export class NotFoundComponent {
  public title =
    "Erreur 404 - An innovative employee appraisal platform designed to help companies optimize their performance management and foster the professional development of their teams.";

  constructor(private titleService: Title) {}
  public ngOnInit() {
    this.titleService.setTitle(`${this.title}`);
  }
}
