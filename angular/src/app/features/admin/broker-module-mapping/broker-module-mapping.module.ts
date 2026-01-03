import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrokerModuleMappingFormComponent } from './broker-module-mapping-form/broker-module-mapping-form.component';
import { BrokerModuleMappingListComponent } from './broker-module-mapping-list/broker-module-mapping-list.component';
import { BrokerModuleMappingRoutingModule } from './broker-module-mapping-routing.module';
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
import { ComponentsModule } from 'src/app/components/components.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    BrokerModuleMappingRoutingModule,
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
    FileUploadModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    BrokerModuleMappingFormComponent,
    BrokerModuleMappingListComponent
  ]
})
export class BrokerModuleMappingModule { }