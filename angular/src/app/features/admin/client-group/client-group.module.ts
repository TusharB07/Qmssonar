import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

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
import { ClientGroupListComponent } from './client-group-list/client-group-list.component';
import { ClientGroupFormComponent } from './client-group-form/client-group-form.component';
import { ClientGroupRoutingModule } from "./client-group-routing.module";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ComponentsModule } from "src/app/components/components.module";
import { ClientModule } from "../client/client.module";
import { TabViewModule } from "primeng/tabview";
import { FileUploadModule } from "primeng/fileupload";



@NgModule({
  declarations: [
    ClientGroupListComponent,
    ClientGroupFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ClientGroupRoutingModule,
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
    AutoCompleteModule,
    SliderModule,
    ComponentsModule,
    TabViewModule,
    ClientModule,
    FileUploadModule,
  ]
})
export class ClientGroupModule { }
