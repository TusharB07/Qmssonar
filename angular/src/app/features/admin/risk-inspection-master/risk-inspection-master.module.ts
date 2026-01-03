import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RiskInspectionMasterRoutingModule } from './risk-inspection-master-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ChipsModule } from 'primeng/chips';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { ComponentsModule } from 'src/app/components/components.module';

import { RiskinspectionmasterformComponent } from './riskinspectionmasterform/riskinspectionmasterform.component';
import { RiskinspectionmasterlistComponent } from './riskinspectionmasterlist/riskinspectionmasterlist.component';


@NgModule({
  declarations: [
    RiskinspectionmasterlistComponent,
    RiskinspectionmasterformComponent
  ],
  imports: [
    CommonModule,
    RiskInspectionMasterRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ToolbarModule,
    ToastModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    MessageModule,
    DropdownModule,
    MessagesModule,
    RadioButtonModule,
    InputTextModule,
    ButtonModule,
    ToggleButtonModule,
    MultiSelectModule,
    ProgressBarModule,
    SliderModule,
    AutoCompleteModule,
    ComponentsModule,
    CardModule,
    ChipsModule,
    CalendarModule,
    InputNumberModule
  ]
})
export class RiskInspectionMasterModule { }
