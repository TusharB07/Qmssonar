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

import { BscPortableEquipmentsListComponent } from './bsc-portable-equipments-list/bsc-portable-equipments-list.component';
import { BscPortableEquipmentsFormComponent } from './bsc-portable-equipments-form/bsc-portable-equipments-form.component';
import { BscPortableEquipmentsRoutingModule } from "./bsc-portable-equipments-routing.module";
import { AutoCompleteModule } from "primeng/autocomplete";



@NgModule({
  declarations: [
    BscPortableEquipmentsListComponent,
    BscPortableEquipmentsFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BscPortableEquipmentsRoutingModule,
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
    AutoCompleteModule
  ],
  exports: [
    BscPortableEquipmentsListComponent,
  ]
})
export class BscPortableEquipmentsModule { }
