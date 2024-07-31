import { NgModule } from '@angular/core';
import { NgxLoadingModule } from 'ngx-loading';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '@/shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ColectorProfileRoutingModule } from './colector-profile-routing.module';
import { ListComponent } from './ui/list/list.component';
import { DetailAskComponent } from './ui/detail-ask/detail-ask.component';



@NgModule({
  declarations: [
    ListComponent,
    DetailAskComponent
  ],
  imports: [
    ColectorProfileRoutingModule,
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
export class ColectorProfileModule { }
