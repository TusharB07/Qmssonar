import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AnnualTurnoverListComponent } from './annual-turnover-list/annual-turnover-list.component';
import { AnnualTurnoverFormComponent } from './annual-turnover-form/annual-turnover--form.component';



const routes: Routes = [

  { path: "", component: AnnualTurnoverListComponent },
  { path: ":id", component: AnnualTurnoverFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnualTurnoverRoutingModule { }
