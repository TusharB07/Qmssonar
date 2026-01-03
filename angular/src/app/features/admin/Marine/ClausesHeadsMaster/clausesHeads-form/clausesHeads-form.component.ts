import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IClausesHeads } from '../clausesHeads.model';
import { ClausesHeadsService } from '../clausesHeads.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-clausesHeads-form',
  templateUrl: './clausesHeads-form.component.html',
  styleUrls: ['./clausesHeads-form.component.scss']
})
export class ClausesHeadsFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  recordSingularName = "Clause Head";
  recordPluralName = "Clauses Heads";
  modulePath: string = "/backend/admin/clausesHeads";

  constructor(
    private clausesHeadsService: ClausesHeadsService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService

  ) {


  }
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.clausesHeadsService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IClausesHeads>) => {
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

  createForm(item?: IClausesHeads) {

    this.recordForm = this.formBuilder.group({

      headName: [item?.headName ? item.headName : null, [Validators.required]],
      description: [item?.headName ? item.description : null],
      isActive: [item?.isActive]
    });
  }



  saveRecord() {
    this.clausesHeadsService.setFilterValueExist(true);


    if (this.recordForm.valid) {

      const updatePayload = { ...this.recordForm.value };
      if (this.mode === "edit") {

        this.clausesHeadsService.update(this.id, updatePayload).subscribe({
          next: si => {
            this.router.navigateByUrl(`${this.modulePath}`);

          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {

        this.clausesHeadsService.create(updatePayload).subscribe({
          next: si => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
      }
    }

  }

  showMessages(severityInfo, summaryInfo, detailInfo) {
    this.messageService.add({ severity: severityInfo, summary: summaryInfo, detail: detailInfo });
  }
  onCancel() {
    this.clausesHeadsService.setFilterValueExist(true);
    this.router.navigateByUrl(`${this.modulePath}`);
  }

}
