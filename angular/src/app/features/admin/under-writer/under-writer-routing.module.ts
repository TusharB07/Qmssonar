import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UnderWriterListComponent } from './under-writer-list/under-writer-list.component';
import { UnderWriterFormComponent } from './under-writer-form/under-writer-form.component';

const routes: Routes = [
  { path: "", component: UnderWriterListComponent },
  { path: ":id", component: UnderWriterFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnderWriterRoutingModule { }
