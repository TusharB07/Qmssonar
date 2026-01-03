import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailConfigurationComponent } from './email-configuration/email-configuration.component';
import { EmailConfigurationFormComponent } from './email-configuration-form/email-configuration-form.component';
import { EmailConfigurationRoutingModule } from './email-configuration-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ChipsModule } from 'primeng/chips';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
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
import {EditorModule} from 'primeng/editor';


@NgModule({
  declarations: [
    EmailConfigurationComponent,
    EmailConfigurationFormComponent
  ],
  imports: [
    CommonModule,
    EmailConfigurationRoutingModule,
    ReactiveFormsModule,
    FormsModule,
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
    CardModule,
    ChipsModule,
    CalendarModule,
    InputNumberModule,
    EditorModule
  ]
})
export class EmailConfigurationModule { }
