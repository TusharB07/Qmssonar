import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LossOfRentCoverListComponent } from './loss-of-rent-cover-list/loss-of-rent-cover-list.component';
import { LossOfRentCoverFormComponent } from './loss-of-rent-cover-form/loss-of-rent-cover-form.component';
import { LossOfRentCoverRoutingModule } from './loss-of-rent-cover-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MessagesModule } from 'primeng/messages';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { SliderModule } from 'primeng/slider';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ComponentsModule } from 'src/app/components/components.module';
import { CardModule } from 'primeng/card';



@NgModule({
  declarations: [
    LossOfRentCoverListComponent,
    LossOfRentCoverFormComponent
  ],
  imports: [
    CommonModule,
    LossOfRentCoverRoutingModule,
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
    CardModule
  ]
})
export class LossOfRentCoverModule { }
