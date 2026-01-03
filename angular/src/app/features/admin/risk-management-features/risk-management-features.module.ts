import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RiskManagementFeaturesListComponent } from './risk-management-features-list/risk-management-features-list.component';
import { RiskManagementFeaturesFormComponent } from './risk-management-features-form/risk-management-features-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoleRoutingModule } from '../role/role-routing.module';
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
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { CardModule } from 'primeng/card';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ComponentsModule } from 'src/app/components/components.module';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SliderModule } from 'primeng/slider';
import { RiskManagementFeaturesRoutingModule } from './risk-management-features-routing.module';



@NgModule({
  declarations: [
    RiskManagementFeaturesListComponent,
    RiskManagementFeaturesFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RiskManagementFeaturesRoutingModule,
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
    DragDropModule,
    CardModule
    
    
  ]
})
export class RiskManagementFeaturesModule { }
