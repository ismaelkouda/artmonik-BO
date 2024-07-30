import { Component, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { EnvService } from "src/app/shared/services/env.service";
import { TranslateService } from "@ngx-translate/core";
import { IndexedDbService } from "@/shared/services/indexed-db.service";
import { EncodingDataService } from "@/shared/services/encoding-data.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  public isSticky: boolean = false;
  public data: any = {};
  public isToggled = false;
  public envDeployment: string = "";
  public currentLanguage: string;
  public accountInfo: any;
  constructor(
    private datePipe: DatePipe,
    private db: IndexedDbService,
    private store: EncodingDataService,
    private translate: TranslateService,
    private envService: EnvService,
  ) {
    this.envDeployment = this.envService.environmentDeployment;
    this.currentLanguage = this.translate.getDefaultLang();
  }

  currentDate: Date = new Date();
  formattedDate: string | null = this.currentDate
    ? this.datePipe.transform(this.currentDate, "dd MMMM yyyy", "fr")
    : null;

  public switchLanguage(lang: string): void {
    this.translate.use(lang);
    this.translate.reloadLang(lang);
    this.currentLanguage = lang;
    this.store.saveData("lang", lang);
  }

  public ngOnInit() {
     this.accountInfo =  JSON.parse(this.store.getData('userSession'));
      console.log(this.accountInfo);
  }

  public signOut() {
    Swal.fire({
        title: 'En êtes vous sûr ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#569C5B',
        cancelButtonColor: '#dc3545',
        cancelButtonText: 'Annuler',
        confirmButtonText: 'Oui',
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = '/auth/sign-in';
            localStorage.clear();
        }
    });

}
}
