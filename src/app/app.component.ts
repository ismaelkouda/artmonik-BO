import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { ToggleService } from "./components/common/header/toggle.service";
import { filter } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  public title =
    "SoleadR - Dedicated to the internal management and administration of operations related to our security services.";

  public isToggled = false;
  public previousUrl: string = null;
  public currentUrl: string = null;
  // @ts-ignore
  constructor(
    public router: Router,
    private toggleService: ToggleService,
    private translate: TranslateService,
  ) {
    this.translate.setDefaultLang("fr"); // langue par défaut
    this.toggleService.isToggled$.subscribe((isToggled) => {
      this.isToggled = isToggled;
    });
  }

  public ngOnInit(): void {
    this.detectNavigator();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      });
  }
  detectNavigator() {
    const ua = navigator.userAgent;
    if (
      /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
        ua,
      )
    )
      this.router.navigate(["/mobile-message"]);
  }
}
