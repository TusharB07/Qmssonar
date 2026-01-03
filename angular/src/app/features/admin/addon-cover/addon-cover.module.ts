import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AddonCoverListComponent } from "./addon-cover-list/addon-cover-list.component";
import { AddonCoverFormComponent } from "./addon-cover-form/addon-cover-form.component";

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
import { AddonCoverRoutingModule } from "./addon-cover-routing.module";
import { CheckboxModule } from "primeng/checkbox";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ComponentsModule } from "src/app/components/components.module";
import { TabMenuModule } from "primeng/tabmenu";
import { TabViewModule } from "primeng/tabview";
import { AddonCoverSectorModule } from "../addon-cover-sector/addon-cover-sector.module";
import { CalendarModule } from "primeng/calendar";


import {FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [AddonCoverListComponent, AddonCoverFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AddonCoverRoutingModule,
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
    CheckboxModule,
    AutoCompleteModule,
    ComponentsModule,
    TabViewModule,
    AddonCoverSectorModule,
    CalendarModule,
    FileUploadModule,
    HttpClientModule
  ]
})
export class AddonCoverModule { }
