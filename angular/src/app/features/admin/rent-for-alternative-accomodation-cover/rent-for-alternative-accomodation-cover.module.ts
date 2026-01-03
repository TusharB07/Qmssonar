import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RentForAlternativeAccomodationCoverListComponent } from './rent-for-alternative-accomodation-cover-list/rent-for-alternative-accomodation-cover-list.component';
import { RentForAlternativeAccomodationCoverFormComponent } from './rent-for-alternative-accomodation-cover-form/rent-for-alternative-accomodation-cover-form.component';
import { RentForAlternativeAccomodationCoverRoutingModule } from './rent-for-alternative-accomodation-cover-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { RadioButtonModule } from 'primeng/radiobutton';
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
    RentForAlternativeAccomodationCoverListComponent,
    RentForAlternativeAccomodationCoverFormComponent
  ],
  imports: [
    CommonModule,
    RentForAlternativeAccomodationCoverRoutingModule,
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
    
    
  ]
})
export class RentForAlternativeAccomodationCoverModule { }
