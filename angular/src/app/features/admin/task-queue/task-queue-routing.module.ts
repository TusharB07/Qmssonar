import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskQueueListComponent } from './task-queue-list/task-queue-list.component';
import { TaskQueueFormComponent } from './task-queue-form/task-queue-form.component';

const routes: Routes = [
  { path: "", component: TaskQueueListComponent },
  { path: ":id", component: TaskQueueFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskQueueRoutingModule { }
