import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { SplitButtonModule } from "primeng/splitbutton";
import { CalendarModule } from "primeng/calendar";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { PaginatorModule } from "primeng/paginator";
import { TabViewModule } from "primeng/tabview";
import { CheckboxModule } from "primeng/checkbox";
import { InputTextareaModule } from "primeng/inputtextarea";
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';

import { NgModule } from '@angular/core';


@NgModule({
  imports: [
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    SplitButtonModule,
    CalendarModule,
    OverlayPanelModule,
    PaginatorModule,
    TabViewModule,
    CheckboxModule,
    InputTextareaModule,
    CardModule,
    FieldsetModule,
    RadioButtonModule,
    DialogModule,
    EditorModule
  ],
  exports: [
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    SplitButtonModule,
    CalendarModule,
    OverlayPanelModule,
    PaginatorModule,
    TabViewModule,
    CheckboxModule,
    InputTextareaModule,
    CardModule,
    FieldsetModule,
    RadioButtonModule,
    DialogModule,
    EditorModule
  ]
})
export class PrimengModule {}