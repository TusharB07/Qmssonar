import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnderWriterListComponent } from './under-writer-list/under-writer-list.component';
import { UnderWriterFormComponent } from './under-writer-form/under-writer-form.component';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { ToastModule } from "primeng/toast";
import { ToolbarModule } from "primeng/toolbar";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { DropdownModule } from "primeng/dropdown";
import { RadioButtonModule } from "primeng/radiobutton";

import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { ToggleButtonModule } from "primeng/togglebutton";
import { ProgressBarModule } from "primeng/progressbar";
import { SliderModule } from "primeng/slider";

import { MultiSelectModule } from "primeng/multiselect";

import { UnderWriterRoutingModule } from "./under-writer-routing.module";
import {  AutoCompleteModule } from "primeng/autocomplete";
import { ComponentsModule } from "src/app/components/components.module";
import {DragDropModule} from '@angular/cdk/drag-drop';
import {CardModule} from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';


@NgModule({
  declarations: [
    UnderWriterListComponent,
    UnderWriterFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    UnderWriterRoutingModule,
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
  ]
})
export class UnderWriterModule { }
