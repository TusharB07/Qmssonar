import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormMode, IOneResponseDto } from 'src/app/app.model';
import { IProduct } from '../../product/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { EmailConfigurationService } from '../email-configuration.service';
import { AllowedActions, EmailTemplate } from '../emailtemplate.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-email-configuration-form',
  templateUrl: './email-configuration-form.component.html',
  styleUrls: ['./email-configuration-form.component.scss']
})
export class EmailConfigurationFormComponent implements OnInit {

  modulePath: string = "/backend/admin/email-configuration";

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;

  recordSingularName = "Email Configuration";
  recordPluralName = "Email Configurations";

  submitted: boolean = false;

  emailConfiguration: EmailTemplate[]

  allActions: any[]
  optionsAction: any[]

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private messageService: MessageService,
    private emailConfigurationService: EmailConfigurationService
  ) {
    this.optionsAction = Object.values(AllowedActions);
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.emailConfigurationService.getEmailConfiguration(this.id).subscribe({
        next: (dto: IOneResponseDto<any>) => {
          this.breadcrumbService.setItems([
            { label: "Pages" },
            {
              label: `${dto.data.entity.status}`,
              routerLink: [`${this.modulePath}/new`]
            }
          ]);

          this.createForm(dto.data.entity);
        },
        error: e => {
          console.log(e);
        }
      });
    } else {
      this.loadRecords()
    }
    this.createForm();
  }

  createForm(emailConfiguration?: any) {
    this.recordForm = this.formBuilder.group({
      _id: [emailConfiguration?._id],
      name: [emailConfiguration?.name, [Validators.required]],
      subject: [emailConfiguration?.subject, [Validators.required]],
      action: [emailConfiguration?.action, [Validators.required]],
      body: [emailConfiguration?.body.replaceAll("&lt;", "<"), [Validators.required]],
      active: [emailConfiguration?.active ? true : false],
    })
  }

  saveRecord() {
    this.emailConfigurationService.setFilterValueExist(true);
    console.log(this.recordForm)
    if (this.recordForm.valid) {
      if (this.mode === "edit") {
        this.emailConfigurationService.update(this.id, this.recordForm.value).subscribe({
          next: emailtemplateUpdate => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode == "new") {
        if (!this.allActions.includes(this.recordForm.value['action'])) {
          this.emailConfigurationService.create(this.recordForm.value).subscribe({
            next: response => {
              this.router.navigateByUrl(`${this.modulePath}`);
            },
            error: error => {
              console.log(error);
            }

          })
        }
        else {
          this.messageService.add({
            severity: "error",
            summary: "Action Should be Unique",
            detail: 'Action already taken.',
            life: 3000
          });
          // this.messageService.add({
          //   severity: "error",
          //   summary: "Fail",
          //   detail: e.error.message,
          //   life: 3000
          // });
        }
      }

    }
  }

  onCancel() {
    this.emailConfigurationService.setFilterValueExist(true);
    this.router.navigateByUrl(`${this.modulePath}`);
  }


  loadRecords() {
    this.allActions = []
    this.emailConfigurationService.getAllEmailConfiguration().subscribe({
      next: emailTemplates => {
        this.emailConfiguration = emailTemplates.data.entities
        // console.log(this.emailConfiguration)
        this.emailConfiguration.map(emailtemplate => {
          this.allActions.push(emailtemplate.action)
        })
        this.optionsAction = this.optionsAction.filter(item => !this.allActions.includes(item))
        this.breadcrumbService.setItems([
          { label: "Pages" },
          {
            label: `Add new ${this.recordSingularName}`,
            routerLink: [`${this.modulePath}/new`]
          }
        ]);
      },
      error: e => {
        console.log(e);
      }
    })
  }

}
