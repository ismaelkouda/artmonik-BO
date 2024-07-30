import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListHistoricalComponent } from './ui/list-historical/list-historical.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@/shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxLoadingModule } from 'ngx-loading';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TranslateModule } from '@ngx-translate/core';
import { HistoricalRoutingModule } from './historical-routing.module';
import { CalendarModule } from 'primeng/calendar';



@NgModule({
  declarations: [
    ListHistoricalComponent
  ],
  imports: [
    HistoricalRoutingModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    TooltipModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxLoadingModule,
    NgxSkeletonLoaderModule,
    TranslateModule,
    CalendarModule
  ]
})
export class HistoricalModule { }
