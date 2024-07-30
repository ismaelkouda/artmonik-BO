import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListMemberComponent } from './ui/list-member/list-member.component';
import { MemberRoutingModule } from './member-routing.module';
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
import { CampaignRoutingModule } from '../campaign/campaign-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxLoadingModule } from 'ngx-loading';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TranslateModule } from '@ngx-translate/core';
import { ExcelService } from '@/shared/services/excel.service';



@NgModule({
  declarations: [
    ListMemberComponent

  ],
  providers: [ExcelService],
  imports: [
    CommonModule,
    MemberRoutingModule,
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
    CampaignRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxLoadingModule,
    NgxSkeletonLoaderModule,
    TranslateModule,
  ]
})
export class MemberModule { }
