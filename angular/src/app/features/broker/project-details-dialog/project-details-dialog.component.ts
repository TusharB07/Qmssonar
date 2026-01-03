import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProject } from './project-details-dialog.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProjectDetailsService } from './project-details.service';
import { IOneResponseDto } from 'src/app/app.model';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-project-details-dialog',
  templateUrl: './project-details-dialog.component.html',
  styleUrls: ['./project-details-dialog.component.scss']
})
export class ProjectDetailsDialogComponent implements OnInit {
  projectForm!: FormGroup;
  projectDetailsData:IProject;
  quote: any;
  quoteOptionId: string; 
  projectStartDate;
  public minDate: string = '';
  projectEndDate;
    fields = [
        { label: 'Name & Address of the Principal', split: true, nameControl: 'principalName', addressControl: 'principalAddress' },
        { label: 'Name & Address of the Contractors', split: true, nameControl: 'contractorName', addressControl: 'contractorAddress' },
        { label: 'Name & Address of Sub Contractors', split: true, nameControl: 'subContractorName', addressControl: 'subContractorAddress' },
        { label: 'Name of Project', split: false, controlName: 'nameofProject', maxLength: 100 },
        { label: 'Project Description', split: false, controlName: 'projectDescription', maxLength: 200 },
        { label: 'Project Location', split: false, controlName: 'projectLocation', maxLength: 200 },
        { label: 'Project Period', split: false, controlName: 'projectPeriod' },
        { label: 'Testing Period (if any)', split: false, controlName: 'testingPeriod', maxLength: 50 },
        { label: 'WET risk involved', split: false, controlName: 'wetRiskInvolved' },
        { label: 'Brownfield Project', split: false, controlName: 'isbrownfieldProject' }
      ];
  constructor(private formBuilder: FormBuilder, 
              public config: DynamicDialogConfig,
              private projectDetailsService:ProjectDetailsService,
              private messageService:MessageService,
              public ref: DynamicDialogRef,
              ) {
    this.quote = this.config.data.quote
    this.quoteOptionId = this.config.data.quoteOptionId
  }
  ngOnInit(): void {
   this.createForm(); 
   this.getProjectDetails();
   this.projectForm.get('projectPeriodStart')?.valueChanges.subscribe(() => this.updateDuration());
   this.projectForm.get('projectPeriodEnd')?.valueChanges.subscribe(() => this.updateDuration());

   const today = new Date();
   const oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1));
   this.minDate = oneMonthAgo.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  }

  createForm(item?: IProject) {
    const formattedStartDate = item?.projectPeriodStart
      ? new Date(item.projectPeriodStart).toISOString().split('T')[0] // Convert to YYYY-MM-DD
      : null;
    const formattedEndDate = item?.projectPeriodEnd
      ? new Date(item.projectPeriodEnd).toISOString().split('T')[0] // Convert to YYYY-MM-DD
      : null;
    this.projectForm = this.formBuilder.group({
      principalName: [item?.principalName, [Validators.required, Validators.maxLength(100)]],
      principalAddress: [item?.principalAddress, [Validators.required, Validators.maxLength(100)]],
      contractorName: [item?.contractorName, [Validators.required, Validators.maxLength(100)]],
      contractorAddress: [item?.contractorAddress, [Validators.required, Validators.maxLength(100)]],
      subContractorName: [item?.subContractorName, [Validators.maxLength(100)]], // Optional
      subContractorAddress: [item?.subContractorAddress, [Validators.maxLength(100)]], // Optional
      nameofProject: [item?.nameofProject, [Validators.required, Validators.maxLength(100)]],
      projectLocation: [item?.projectLocation, [Validators.required, Validators.maxLength(200)]],
      projectDescription: [item?.projectDescription, [Validators.required, Validators.maxLength(200)]],
      projectPeriodStart: [formattedStartDate, [Validators.required]],
      projectPeriodEnd: [formattedEndDate, [Validators.required]],
      testingPeriod: [item?.testingPeriod, [Validators.maxLength(50)]], // Optional
      wetRiskInvolved: [item?.wetRiskInvolved],
      isbrownfieldProject: [item?.isbrownfieldProject]
    });
}
  onSubmit(): void {
    if (this.projectForm.valid) {
      if (this.projectDetailsData != undefined) {
          const payload = { ...this.projectForm.value }
          payload["quoteId"] = this.quote?._id;
          payload["quoteOptionId"] = this.quoteOptionId;
          payload["projectTenure"] = this.calculateMonthYearDifference();
          console.log(payload);
          this.projectDetailsService.update(this.projectDetailsData?._id, payload).subscribe({
              next: (response: IOneResponseDto<IProject>) => {
                  this.messageService.add({
                      severity: "success",
                      summary: "Successful",
                      detail: `Saved!`,
                      life: 3000
                  });
                  this.ref.close();
              }, error: error => {
              }
          });
      } else {
          const payload = { ...this.projectForm.value }
          payload["quoteId"] = this.quote?._id;
          payload["quoteOptionId"] = this.quoteOptionId;
          payload["projectTenure"] = this.calculateMonthYearDifference();

          this.projectDetailsService.create(payload).subscribe({
              next: (response: IOneResponseDto<IProject>) => {
                  this.messageService.add({
                      severity: "success",
                      summary: "Successful",
                      detail: `Saved!`,
                      life: 3000
                  });
                  this.ref.close();
              }, error: error => {
              }
          });
      }
  }
}
getProjectDetails(){
  let lazyLoadEvent: LazyLoadEvent = {
    first: 0,
    rows: 20,
    sortField: null,
    sortOrder: 1,
    filters: {
        // @ts-ignore
        quoteOptionId: [
            {
                value: this.quoteOptionId,
                matchMode: "equals",
                operator: "and"
            }
        ]
    },
    globalFilter: null,
    multiSortMeta: null
}
  this.projectDetailsService.getMany(lazyLoadEvent).subscribe({
    next: (dto: IOneResponseDto<IProject>) => {
      if (dto.data?.entities[0]?._id) {
        this.projectDetailsData = dto.data?.entities[0];
      }
      this.createForm(dto.data?.entities[0]);
    },
    error: e => {
      console.log(e);
    }
  });
}
updateDuration(): void {
  const duration = this.calculateMonthYearDifference();
}
calculateMonthYearDifference(): string {
  const startDate = this.projectForm.value.projectPeriodStart;
  const endDate = this.projectForm.value.projectPeriodEnd;

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();

    // Adjust months if negative
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return `${years} years and ${months} months`;
  }

  return ``;
}
}
