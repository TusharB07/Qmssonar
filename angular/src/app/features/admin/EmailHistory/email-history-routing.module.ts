import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EmailHistoryListComponent } from './email-history-list/email-history-list.component';

const routes: Routes = [

  { path: "", component: EmailHistoryListComponent },
  // { path: ":id", component: EmailConfigurationFormComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailHistoryRoutingModule { }
