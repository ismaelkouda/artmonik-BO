import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ngxLoadingAnimationTypes } from "ngx-loading";
import { Observable } from "rxjs";
import { NotyfService } from "@/shared/services/notyf.service";
import { EncodingDataService } from "@/shared/services/encoding-data.service";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "@/pages/authentication/data-access/services/auth.service";
import { handleSignIn } from "@/pages/authentication/data-access/functions/auth.functions";
import { Router } from "@angular/router";

const PrimaryWhite = "#ffffff";
const SecondaryGrey = "#ccc";
@Component({
  selector: "app-signin-form",
  templateUrl: "./signin-form.component.html",
  styleUrls: ["../authentication.component.scss"],
})
export class SignInFormComponent implements OnInit {
  public form: FormGroup | any;
  public primaryColour = PrimaryWhite;
  public secondaryColour = SecondaryGrey;
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public formInputs: any[] = [
    {
      label: "SIGN_IN.FORM.USERNAME.LIBELLE",
      placeholder: "SIGN_IN.FORM.USERNAME.PLACEHOLDER",
      name: "email",
      type: "text",
      required: "SIGN_IN.FORM.USERNAME.IS_REQUIRED",
    },
    {
      label: "SIGN_IN.FORM.PASSWORD.LIBELLE",
      placeholder: "SIGN_IN.FORM.PASSWORD.PLACEHOLDER",
      name: "password",
      type: "password",
      required: "SIGN_IN.FORM.PASSWORD.IS_REQUIRED",
    },
  ];
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notyfService: NotyfService,
    private translate: TranslateService,
    private storage: EncodingDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.form = this.fb.group({
      email: ["john.doe@example.com", Validators.required],
      password: ["securepassword123", Validators.required],
    });
    this.storage.clearData();
  }

  async signIn(): Promise<void> {
    this.loading = true;

    const email = this.form.value.email;
    const password = this.form.value.password;

    if (!email || !password) {
      this.showErrorNotification();
      this.loading = false;
      return;
    } else {
      const signInFn = (): Observable<any> => {
        return this.authService.signIn({
          email: this.form.value.email,
          password: this.form.value.password,
        });
      };

      handleSignIn(
        signInFn,
        this.notyfService,
        this.storage,
        this.router
      )
        .then(() => {
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    }
  }

  private showErrorNotification() {
    this.translate
      .get("MessageToast.Login.REQUIRED_FIELDS")
      .subscribe((translation: string) => {
        this.notyfService.showToast("error", translation, "toast-danger");
      });
  }
}
