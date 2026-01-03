import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ValuableContentOnAgreedValueBasisCoverFormComponent } from './valuable-content-on-agreed-value-basis-cover-form/valuable-content-on-agreed-value-basis-cover-form.component';
import { ValuableContentOnAgreedValueBasisCoverListComponent } from './valuable-content-on-agreed-value-basis-cover-list/valuable-content-on-agreed-value-basis-cover-list.component';

const routes: Routes = [

  { path: "", component: ValuableContentOnAgreedValueBasisCoverListComponent },
  { path: ":id", component: ValuableContentOnAgreedValueBasisCoverFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValuableContentOnAgreedValueBasisCoverRoutingModule { }
