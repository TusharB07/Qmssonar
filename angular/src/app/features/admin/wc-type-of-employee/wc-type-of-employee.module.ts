import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WCTypeOfEmployeeListComponent } from './wc-type-of-employee-list/wc-type-of-employee-list.component';
import { WCTypeOfEmployeeFormComponent } from './wc-type-of-employee-form/wc-type-of-employee-form.component';
import { WCTypeOfEmployeeRoutingModule } from './wc-type-of-employee-routing.module';
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
    WCTypeOfEmployeeFormComponent,
    WCTypeOfEmployeeListComponent
  ],
  imports: [
    CommonModule,
    WCTypeOfEmployeeRoutingModule,
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
export class WCTypeOfEmployeeModule { }
