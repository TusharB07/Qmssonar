import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ListOfValueMasterListComponent } from './list-of-value-master-list/list-of-value-master-list.component';
import { ListOfValueMasterFormComponent } from './list-of-value-master-form/list-of-value-master-form.component';
import { ListOfValueMasterSiSplitListComponent } from './list-of-value-master-si-split-list/list-of-value-master-si-split-list.component';
// import { ListOfValueMasterRiskParamterListComponent } from './list-of-value-master-risk-paramter-list/list-of-value-master-risk-paramter-list.component';
import { ListOfValueMasterRiskParameterListComponent } from './list-of-value-master-risk-parameter-list/list-of-value-master-risk-parameter-list.component';
import { ListOfValueMasterDropdownListComponent } from './list-of-value-master-dropdown-list/list-of-value-master-dropdown-list.component';
import { WCListOfValueMasterDropdownListComponent } from './list-of-value-master-wc-dropdown-list/list-of-value-master-wc-dropdown-list.component';
import { WCListOfValueMasterFormComponent } from './wc-list-of-value-master-form/wc-list-of-value-master-form.component';

const routes: Routes = [
  { path: "", component: ListOfValueMasterListComponent },
  { path: "si-split-list", component: ListOfValueMasterSiSplitListComponent },
  { path: "risk-parameter-list", component: ListOfValueMasterRiskParameterListComponent },
  { path: "dropdown-list", component: ListOfValueMasterDropdownListComponent },
  { path: "wc-dropdown-list", component: WCListOfValueMasterDropdownListComponent },
  { path: ":id", component: ListOfValueMasterFormComponent },
  { path: "wc/:id", component: WCListOfValueMasterFormComponent }
  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListOfValueMasterRoutingModule { }
