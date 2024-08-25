import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable()

export class EvenementielApiStateService {
    private subjectListEvenementiels = new Subject<void>();
    

  refreshListEvenementiels() {
    this.subjectListEvenementiels.next();
  }

  setListEvenementiels(): Observable<any> {
    return this.subjectListEvenementiels.asObservable();
  }
}