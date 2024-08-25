import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-authentication",
  templateUrl: "./authentication.component.html",
  styleUrls: ["./authentication.component.scss"],
})
export class AuthenticationComponent {
  public currentRoute: string;
  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
  ) {
    this.route.url.subscribe((url) => {
      this.currentRoute = url[0].path;
    });
    this.route.data.subscribe((data) => {
      this.titleService.setTitle(data?.["title"]);
    });
  }
}
