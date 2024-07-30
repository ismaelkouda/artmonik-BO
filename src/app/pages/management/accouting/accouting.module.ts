import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './ui/list/list.component';
import { AccoutingRoutingModule } from './accouting-routing.module';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxLoadingModule } from 'ngx-loading';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
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
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    TooltipModule,
    AccoutingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxLoadingModule,
    NgxSkeletonLoaderModule,
    TranslateModule,
  ]
})
export class AccoutingModule { }
