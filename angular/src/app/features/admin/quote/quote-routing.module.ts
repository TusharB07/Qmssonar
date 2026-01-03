import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { QuoteListComponent } from './quote-list/quote-list.component';
import { QuoteFormComponent } from './quote-form/quote-form.component';


const routes: Routes = [
  { path: "", component: QuoteListComponent },
  { path: ":id", component: QuoteFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuoteRoutingModule { }
