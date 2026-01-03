import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IndustryTypeListComponent } from "./industry-type-list/industry-type-list.component";
import { IndustryTypeFormComponent } from "./industry-type-form/industry-type-form.component";

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
import { IndustryTypeRoutingModule } from "./industry-type-routing.module";

import { ComponentsModule } from "src/app/components/components.module";

@NgModule({
  declarations: [IndustryTypeListComponent, IndustryTypeFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IndustryTypeRoutingModule,
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
export class IndustryTypeModule { }
