import { NgModule } from '@angular/core';
import { ListComponent } from './ui/list/list.component';
import { AccoutingRoutingModule } from './accouting-routing.module';
import { NgxLoadingModule } from 'ngx-loading';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '@/shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';



@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    AccoutingRoutingModule,
    NgxPaginationModule,
    NgxLoadingModule,
  ]
})
export class AccoutingModule { }
