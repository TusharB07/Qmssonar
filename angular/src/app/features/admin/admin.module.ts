import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { MyOrganizationComponent } from './my-organization/my-organization.component';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {CardModule} from 'primeng/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PartnerRoutingModule } from './partner/partner-routing.module';
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
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { SliderModule } from 'primeng/slider';
import { ComponentsModule } from 'src/app/components/components.module';
import { ChipsModule } from 'primeng/chips';
import { ValuableContentOnAgreedValueBasisCoverModule } from './valuable-content-on-agreed-value-basis-cover/valuable-content-on-agreed-value-basis-cover.module';
import { RentForAlternativeAccomodationCoverModule } from './rent-for-alternative-accomodation-cover/rent-for-alternative-accomodation-cover.module';
import { PersonalAccidentCoverModule } from './personal-accident-cover/personal-accident-cover.module';
import { LossOfRentCoverModule } from './loss-of-rent-cover/loss-of-rent-cover.module';
import { FloaterCoverAddonModule } from './floater-cover-addon/floater-cover-addon.module';
import { DeclarationPolicyCoverModule } from './declaration-policy-cover/declaration-policy-cover.module';
import { ProductPartnerConfigurationModule } from './product-partner-configuration/product-partner-configuration.module';
import { ProductPartnerIcConfigurationModule } from './product-partner-ic-configuration/product-partner-ic-configuration.module';
import { EmailConfigurationModule } from './EmailConfiguration/email-configuration.module';
import { LoginHistoryModule } from './Login-History/login-history.module';
import { EMPRatesDetailsDialogComponent } from './emp-rates-details-dialog/emp-rates-details-dialog.component';
import { TransactionHistoryModule } from './transaction-history/transaction-history.module';
import { RmMappedIntermediateListComponent } from './RmMappedIntermediate/rm-mapped-intermediate-list/rm-mapped-intermediate-list.component';
//import { GmctabmasterComponent } from './gmctabmaster/gmctabmaster.component';
//import { GmctabmasterFormComponent } from './gmctabmaster/gmctabmaster-form/gmctabmaster-form.component';
// import { ProductPartnerIcConfigurationModule } from './product-partner-ic-configuration/product-partner-ic-configuration.module';


@NgModule({
  declarations: [
    MyOrganizationComponent,
    EMPRatesDetailsDialogComponent,   
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AutoCompleteModule,
    // ToggleButtonModule,
    // CardModule
    CardModule,
    AutoCompleteModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PartnerRoutingModule,
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
    ValuableContentOnAgreedValueBasisCoverModule,
    RentForAlternativeAccomodationCoverModule,
    PersonalAccidentCoverModule,
    LossOfRentCoverModule,
    FloaterCoverAddonModule,
    DeclarationPolicyCoverModule,
    ProductPartnerConfigurationModule,
    ProductPartnerIcConfigurationModule,
    EmailConfigurationModule,
    LoginHistoryModule,
    TransactionHistoryModule,
    ComponentsModule,
    ChipsModule,
    CardModule,

  ]
})
export class AdminModule { }
