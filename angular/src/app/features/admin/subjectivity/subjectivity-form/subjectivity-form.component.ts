import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { ISubjectivity } from '../subjectivity.model';
import { SubjectivityService } from '../subjectivity.service';

@Component({
  selector: 'app-subjectivity-form',
  templateUrl: './subjectivity-form.component.html',
  styleUrls: ['./subjectivity-form.component.scss']
})
export class SubjectivityFormComponent implements OnInit {
  
  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  recordSingularName = "Subjectivity";
  recordPluralName = "Subjectivities";
  modulePath: string = "/backend/admin/subjectivity";

  constructor(
     private subjectivityService: SubjectivityService,
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
      this.subjectivityService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<ISubjectivity>) => {
          
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

  createForm(item?: ISubjectivity) {

    this.recordForm = this.formBuilder.group({
      name: [item?.name,  [Validators.required]]
        });
  }

  saveRecord() {
    

    if (this.recordForm.valid) {

        const updatePayload = { ...this.recordForm.value };

      if (this.mode === "edit") {
        this.subjectivityService.update(this.id , updatePayload).subscribe({
          next: partner => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        this.subjectivityService.create(updatePayload).subscribe({
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
    this.router.navigateByUrl(`${this.modulePath}`);
  }

}
