import { NgModule } from '@angular/core';
import { ListHistoricalComponent } from './ui/list-historical/list-historical.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@/shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxLoadingModule } from 'ngx-loading';
import { HistoricalRoutingModule } from './historical-routing.module';



@NgModule({
  declarations: [
    ListHistoricalComponent
  ],
  imports: [
    HistoricalRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    NgxPaginationModule,
    NgxLoadingModule,
  ]
})
export class HistoricalModule { }
