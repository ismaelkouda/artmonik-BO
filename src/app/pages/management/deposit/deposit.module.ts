import { NgModule } from '@angular/core';
import { ListDepositComponent } from './ui/list-deposit/list-deposit.component';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';  // pour les boutons
import { MatInputModule } from '@angular/material/input';  


import { NgxPaginationModule } from 'ngx-pagination';
import { NgxLoadingModule } from 'ngx-loading';
import { ExcelService } from '@/shared/services/excel.service';
import { SharedModule } from '@/shared/shared.module';
import { DepositRoutingModule } from './deposit-routing.module';




@NgModule({
  declarations: [
    ListDepositComponent
  ],
  providers: [ExcelService],
  imports: [
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    DepositRoutingModule,
    NgxPaginationModule,
    NgxLoadingModule,
  ]
})
export class DepositModule { }
