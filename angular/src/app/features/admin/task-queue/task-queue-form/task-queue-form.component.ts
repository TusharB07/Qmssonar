import { Component, OnInit } from '@angular/core';
import { TaskQueueService } from '../task-queue.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormMode, IOneResponseDto } from 'src/app/app.model';
import { ITaskQueue } from '../task-queue.model';

@Component({
  selector: 'app-task-queue-form',
  templateUrl: './task-queue-form.component.html',
  styleUrls: ['./task-queue-form.component.scss']
})
export class TaskQueueFormComponent implements OnInit {
  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  recordSingularName = "Task Queue";
  recordPluralName = "Task Queues";
  modulePath: string = "/backend/admin/task-queue";

  constructor(
    private taskQueueService: TaskQueueService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {

  }
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.taskQueueService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<ITaskQueue>) => {

          this.breadcrumbService.setItems([
            { label: "Pages" },
            {

              label: `${dto.data.entity._id}`,
              routerLink: [`${this.modulePath}`]
            }
          ]);
          this.createForm(dto.data.entity);

        },
        error: e => {
          console.log(e);
        }
      });
    } else {
      this.breadcrumbService.setItems([
        { label: "Pages" },
        {
          label: `Add new ${this.recordSingularName}`,
          routerLink: [`${this.modulePath}/new`]
        }
      ]);
    }

    this.createForm();
  }

  createForm(item?: ITaskQueue) {

    this.recordForm = this.formBuilder.group({
      name: [item?.name, [Validators.required]]
    });
  }

  saveRecord() {
    this.taskQueueService.setFilterValueExist(true);


    if (this.recordForm.valid) {

      const updatePayload = { ...this.recordForm.value };

      if (this.mode === "edit") {
        this.taskQueueService.update(this.id, updatePayload).subscribe({
          next: partner => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        this.taskQueueService.create(updatePayload).subscribe({
          next: partner => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
      }
    }
  }

  onCancel() {
    this.taskQueueService.setFilterValueExist(true);
    this.router.navigateByUrl(`${this.modulePath}`);
  }

}
