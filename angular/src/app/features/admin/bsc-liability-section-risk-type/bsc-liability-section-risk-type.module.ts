import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BscLiabilitySectionRiskTypeListComponent } from './bsc-liability-section-risk-type-list/bsc-liability-section-risk-type-list.component';
import { BscLiabilitySectionRiskTypeFormComponent } from './bsc-liability-section-risk-type-form/bsc-liability-section-risk-type-form.component';



@NgModule({
  declarations: [
    BscLiabilitySectionRiskTypeListComponent,
    BscLiabilitySectionRiskTypeFormComponent
  ],
  imports: [
    CommonModule
  ]
})
export class BscLiabilitySectionRiskTypeModule { }
