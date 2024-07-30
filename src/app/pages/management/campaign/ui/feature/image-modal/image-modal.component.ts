import { EnvService } from '@/shared/services/env.service';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss']
})
export class ImageModalComponent {

  public BASE_URL: any;

  @Input() imageData: any;
  constructor(
      private activeModal: NgbActiveModal, private envService: EnvService,) {
        this.BASE_URL = this.envService.baseUrl;


  }


  public closeModal() {
    this.activeModal.close();
  }

  //protected readonly GeneralStrings = GeneralStrings;
}
