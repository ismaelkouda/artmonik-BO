import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListDepositComponent } from './ui/list-deposit/list-deposit.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';  // pour les boutons
import { MatInputModule } from '@angular/material/input';  

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxLoadingModule } from 'ngx-loading';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
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
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    TooltipModule,
    DepositRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxLoadingModule,
    NgxSkeletonLoaderModule,
    TranslateModule,
  ]
})
export class DepositModule { }
