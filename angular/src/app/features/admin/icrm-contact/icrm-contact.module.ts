import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IcrmContactListComponent } from './icrm-contact-list/icrm-contact-list.component';
import { IcrmContactFormComponent } from './icrm-contact-form/icrm-contact-form.component';
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

import { ComponentsModule } from "src/app/components/components.module";
import { IcrmContactRoutingModule } from './icrm-contact-routing.module';
import { CardModule } from 'primeng/card';
import { AutoCompleteModule } from 'primeng/autocomplete';



@NgModule({
  declarations: [
    IcrmContactListComponent,
    IcrmContactFormComponent
  ],
  imports:[
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToolbarModule,
    ToastModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    IcrmContactRoutingModule,
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
    ComponentsModule,
    CardModule,
    AutoCompleteModule,
  ]
})
export class IcrmContactModule { }
