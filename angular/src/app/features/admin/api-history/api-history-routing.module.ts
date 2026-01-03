import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApiHistoryListComponent } from './api-history-list/api-history-list.component';

const routes: Routes = [
  { path: "", component: ApiHistoryListComponent },
  // { path: ":id", component: AddonCoverFormComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApiHistoryRoutingModule { }
