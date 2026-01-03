import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WCCoverageForMedicalExpensesListComponent } from './wc-coverage-for-mefical-expenses-list/wc-coverage-for-mefical-expenses-list.component';
import { WCCoverageForMedicalExpensesFormComponent } from './wc-coverage-for-mefical-expenses-form/wc-coverage-for-mefical-expenses-form.component';
import { WCCoverageForMedicalExpensesRoutingModule } from './wc-coverage-for-mefical-expenses-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { SliderModule } from 'primeng/slider';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CardModule } from 'primeng/card';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    WCCoverageForMedicalExpensesFormComponent,
    WCCoverageForMedicalExpensesListComponent
  ],
  imports: [
    CommonModule,
    WCCoverageForMedicalExpensesRoutingModule,
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
    
  ]
})
export class WCCoverageForMedicalExpensesModule { }
