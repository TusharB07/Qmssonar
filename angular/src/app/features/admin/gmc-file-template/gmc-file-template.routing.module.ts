import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GmcFileTemplateComponent } from './gmc-file-template.component';



const routes: Routes = [

  { path: "", component: GmcFileTemplateComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GmcFileTemplateRoutingModule { }
