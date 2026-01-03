import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BscFidelityGuranteeRiskTypeListComponent } from './bsc-fidelity-gurantee-risk-type-list/bsc-fidelity-gurantee-risk-type-list.component';
import { BscFidelityGuranteeRiskTypeFormComponent } from './bsc-fidelity-gurantee-risk-type-form/bsc-fidelity-gurantee-risk-type-form.component';



@NgModule({
  declarations: [
    BscFidelityGuranteeRiskTypeListComponent,
    BscFidelityGuranteeRiskTypeFormComponent
  ],
  imports: [
    CommonModule
  ]
})
export class BscFidelityGuranteeRiskTypeModule { }
