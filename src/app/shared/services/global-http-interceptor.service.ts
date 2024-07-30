import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, TimeoutError, of } from "rxjs";
import { catchError, timeout } from "rxjs/operators";
import { Router } from "@angular/router";
import { NotyfService } from "./notyf.service";
import { EncodingDataService } from "@/shared/services/encoding-data.service";

@Injectable()
export class GlobalHttpInterceptorService implements HttpInterceptor {
  public userToken: string;
  constructor(
    public router: Router,
    private storage: EncodingDataService,
    private notyfService: NotyfService,
  ) {
    this.userToken = this.storage.getData("sessiontoken");         
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const token: string = this.userToken;
    const timeoutValue = 10000;
    req = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + token),
    });
    return next.handle(req).pipe(
      timeout(timeoutValue),
      catchError((error) => {
        let handled: boolean = false;
        if (error instanceof HttpErrorResponse) {
          if (error.error instanceof ErrorEvent) {
            console.error("Error Event");
          } else {
            console.log(`error status : ${error.status} ${error.statusText}`);
            switch (error.status) {
              case 400:
                this.notyfService.showToast(
                  "error",
                  `${error.error.message}`,
                  "toast-danger",
                );
                handled = true;
                break;

              case 401:
                this.notyfService.showToast(
                  "error",
                  `Votre session a expirée`,
                  "toast-danger",
                );
                this.router.navigateByUrl("/auth/sign-in");
                handled = true;
                break;

              case 500:
                this.router.navigateByUrl("/error-500");
                handled = true;
                break;
            }
          }
        } else if (error instanceof TimeoutError) {
          this.router.navigateByUrl("/not-network");
          handled = true;
        }
        if (handled) {
          console.log("return back ");
          return of(error);
        } else {
          console.log("throw error back to to the subscriber");
        }
      }),
    );
  }
}
