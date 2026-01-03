import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CountryListComponent } from "./country-list/country-list.component";
import { CountryFormComponent } from "./country-form/country-form.component";

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
import { CountryRoutingModule } from "./country-routing.module";
import { ComponentsModule } from "src/app/components/components.module";

@NgModule({
  declarations: [CountryListComponent, CountryFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CountryRoutingModule,
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
    ComponentsModule,
  ]
})
export class CountryModule { }
