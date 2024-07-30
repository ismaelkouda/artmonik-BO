import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-paggination',
  templateUrl: './paggination.component.html',
  styleUrls: ['./paggination.component.scss']
})
export class PagginationComponent implements OnInit {

  @Input() rows: number;
  @Input() currentPage: number = 1;
  @Input() totalPages: number;
  @Input() totalRecords: number ;
  @Input() first: number = 0;
  @Output() pageChange: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void { 
    
  }

  onPageChange(event: any): void {
    this.pageChange.emit(event);
  
  }
}
