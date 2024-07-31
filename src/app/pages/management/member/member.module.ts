import { NgModule } from '@angular/core';
import { ListMemberComponent } from './ui/list-member/list-member.component';
import { MemberRoutingModule } from './member-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@/shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { CampaignRoutingModule } from '../campaign/campaign-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxLoadingModule } from 'ngx-loading';
import { ExcelService } from '@/shared/services/excel.service';



@NgModule({
  declarations: [
    ListMemberComponent

  ],
  providers: [ExcelService],
  imports: [
    MemberRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    CampaignRoutingModule,
    NgxPaginationModule,
    NgxLoadingModule,
  ]
})
export class MemberModule { }
