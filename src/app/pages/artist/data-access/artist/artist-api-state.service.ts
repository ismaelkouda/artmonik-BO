import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable()

export class ArtistApiStateService {
    private subjectListArtist = new Subject<void>();
    

  refreshListArtist() {
    this.subjectListArtist.next();
  }

  setListArtist(): Observable<any> {
    return this.subjectListArtist.asObservable();
  }
}