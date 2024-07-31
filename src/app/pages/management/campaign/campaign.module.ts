import { NgModule } from '@angular/core';
import { ListComponent } from './ui/list/list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';  // pour les boutons
import { MatInputModule } from '@angular/material/input';  

import { NgxPaginationModule } from 'ngx-pagination';
import { NgxLoadingModule } from 'ngx-loading';
import { ExcelService } from '@/shared/services/excel.service';
import { CampaignRoutingModule } from './campaign-routing.module';
import { SharedModule } from '@/shared/shared.module';
import { CategoryFormComponent } from './ui/feature/category-form/category-form.component';
import { CategoryComponent } from './ui/category/category.component';
import { ImageModalComponent } from './ui/feature/image-modal/image-modal.component';
import { StatusModalComponent } from './ui/feature/status-modal/status-modal.component';





@NgModule({
    declarations: [
        ListComponent,
        CategoryComponent,
        CategoryFormComponent,
        ImageModalComponent,
        StatusModalComponent
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
        CampaignRoutingModule,
        NgxPaginationModule,
        NgxLoadingModule,
    ]
})
export class CampaignModule { }
