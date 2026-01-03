import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { TaskService } from '../task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { AllowedTaskStates, ITask } from '../task.model';
import { LazyLoadEvent } from 'primeng/api';
import { TaskQueueService } from '../../task-queue/task-queue.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  optionsParentDocumentId: ILov[] = []
  optionstaskQueueId: ILov[] = []
  optionsTaskStates: any[] = []
  recordSingularName = "Task";
  recordPluralName = "Tasks";
  modulePath: string = "/backend/admin/tasks";

  constructor(
    private recordService: TaskService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
    private taskQueueService :TaskQueueService,
  ) { 
    this.optionsTaskStates = AllowedTaskStates

  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.recordService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<ITask>) => {
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

    // mode: New
    this.createForm();
  }

  createForm(item?: ITask) {

    console.log(item)

    const parent: ITask = item?.parentDocumentId as ITask;

    this.recordForm = this.formBuilder.group({
      _id: [item?._id],
      retryCount: [item?.retryCount],
      retryInterval: [item?.retryInterval],
      state: [item?.state],
      price: [item?.price],
      taskQueueId: [item?.taskQueueId],
      startTime: [item?.startTime ? String(item?.startTime).split('T')[0] : null],
      createdAt: [item?.createdAt ? String(item?.createdAt).split('T')[0] : null],
      endTime: [item?.endTime ? String(item?.endTime).split('T')[0] : null],
      elapsedMillis: [item?.elapsedMillis],
      inputBody: [item?.inputBody],
      outputBody: [item?.outputBody],
      errorBody: [item?.errorBody],
      parentDocumentId: [parent ? { label: `${parent?.state}`, value: parent?._id } : null],
      parentDocumentModel: [item?.parentDocumentModel],
      // sequenceNumber: [item?.sequenceNumber],
      // lovType: [item?.lovType, [Validators.required]],
      // lovKey: [item?.lovKey, [Validators.required]],
      // lovValue: [item?.lovValue, [Validators.min(0), Validators.max(100)]],
      // lovReference: [item?.lovReference, []],
      // lovReferences: [item?.lovReferences, []],
      // parentLovType: [item?.parentLovType],
      // parentLovId: [parent ? { label: `${parent?.lovType} - ${parent?.lovKey}`, value: parent?._id } : null],
      // children: [item?.children]
    });
  }

  saveRecord() {
    this.recordService.setFilterValueExist(true);

    console.log(this.recordForm.value)
    if (this.recordForm.valid) {

      const updatePayload = { ...this.recordForm.value };
      updatePayload['parentDocumentId'] = updatePayload?.parentDocumentId?.value;
      updatePayload['taskQueueId'] = updatePayload?.taskQueueId?.value;


      if (this.mode === "edit") {
        this.recordService.update(this.id, updatePayload).subscribe({
          next: partner => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        this.recordService.create(updatePayload).subscribe({
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

  searchoptionsParentDocumentId(e) {
    let lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 20,
      sortField: null,
      sortOrder: 1,
      filters: {
        // @ts-ignore
        state: [
          {
            value: this.recordForm.controls['parentDocumentId']?.value?.value,
            matchMode: "contains",
            operator: "or"
          },
        ],

      },
      globalFilter: null,
      multiSortMeta: null
    }

    this.recordService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        this.optionsParentDocumentId = data.data.entities.map(entity => ({ label: `${entity.state}`, value: entity._id }));
      },
      error: e => { }
    });
  }
  searchoptionsTaskQueueId(e) {
    let lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 20,
      sortField: null,
      sortOrder: 1,
      filters: {
        // @ts-ignore
        name: [
          {
            value: this.recordForm.controls['taskQueueId']?.value?.value,
            matchMode: "contains",
            operator: "or"
          },
        ],

      },
      globalFilter: null,
      multiSortMeta: null
    }

    this.taskQueueService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        this.optionstaskQueueId = data.data.entities.map(entity => ({ label: `${entity.name}`, value: entity._id }));
      },
      error: e => { }
    });
  }
  onCancel() {
    this.recordService.setFilterValueExist(true);
    this.router.navigateByUrl(`${this.modulePath}`);
  }


}
