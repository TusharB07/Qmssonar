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

import { ClientListComponent } from './client-list/client-list.component';
import { ClientFormComponent } from './client-form/client-form.component';
import { ClientRoutingModule } from './client-routing.module';
import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from 'primeng/calendar';
import { ComponentsModule } from "src/app/components/components.module";
import { TabViewModule } from "primeng/tabview";
import { ClientLocationListComponent } from "../client-location/client-location-list/client-location-list.component";
import { ClientContactListComponent } from "../client-contact/client-contact-list/client-contact-list.component";
import { ClientLocationModule } from "../client-location/client-location.module";
import { ClientContactModule } from "../client-contact/client-contact.module";
import { QuoteModule } from "../quote/quote.module";
import { FileUploadModule } from "primeng/fileupload";


@NgModule({
  declarations: [
    ClientListComponent,
    ClientFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ClientRoutingModule,
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
    CalendarModule,
    ComponentsModule,
    TabViewModule,
    ClientLocationModule,
    ClientContactModule,
    QuoteModule,
    FileUploadModule,
  ],
  exports: [
    ClientListComponent
  ]
})
export class ClientModule { }
