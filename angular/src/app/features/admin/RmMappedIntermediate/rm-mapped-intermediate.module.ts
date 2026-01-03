import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RmMappedIntermediateRoutingModule } from './rm-mapped-intermediate-routing.module';
import { RmMappedIntermediateFormComponent } from './rm-mapped-intermediate-form/rm-mapped-intermediate-form.component';
import { RmMappedIntermediateListComponent } from './rm-mapped-intermediate-list/rm-mapped-intermediate-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
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
import { RiskManagementFeaturesRoutingModule } from '../risk-management-features/risk-management-features-routing.module';
import {FileUploadModule} from "primeng/fileupload";


@NgModule({
  declarations: [
    RmMappedIntermediateFormComponent,
    RmMappedIntermediateListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RmMappedIntermediateRoutingModule,
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
    CardModule,
      FileUploadModule
  ]
})
export class RmMappedIntermediateModule { }
