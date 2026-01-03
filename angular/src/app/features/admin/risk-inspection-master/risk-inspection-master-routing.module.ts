import { RiskinspectionmasterformComponent } from './riskinspectionmasterform/riskinspectionmasterform.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RiskinspectionmasterlistComponent } from './riskinspectionmasterlist/riskinspectionmasterlist.component';

const routes: Routes = [
  { path: "", component: RiskinspectionmasterlistComponent },
  { path: ":id", component: RiskinspectionmasterformComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiskInspectionMasterRoutingModule { }
