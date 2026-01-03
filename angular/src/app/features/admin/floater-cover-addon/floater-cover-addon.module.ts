import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloaterCoverAddonListComponent } from './floater-cover-addon-list/floater-cover-addon-list.component';
import { FloaterCoverAddonFormComponent } from './floater-cover-addon-form/floater-cover-addon-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeclarationPolicyCoverRoutingModule } from '../declaration-policy-cover/declaration-policy-cover-routing.module';
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
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { SliderModule } from 'primeng/slider';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ComponentsModule } from 'src/app/components/components.module';
import { FloaterCoverAddonRoutingModule } from './floater-cover-addon-routing.module';
import { CardModule } from 'primeng/card';



@NgModule({
  declarations: [

    FloaterCoverAddonFormComponent,
    FloaterCoverAddonListComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FloaterCoverAddonRoutingModule,
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
export class FloaterCoverAddonModule { }
