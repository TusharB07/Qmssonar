import { UserService } from 'src/app/features/admin/user/user.service';
import { RmMappedIntermediateService } from './../rm-mapped-intermediate.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { RmMappedIntermediate } from '../rm-mapped-intermediate.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { AccountService } from 'src/app/features/account/account.service';
import { IUser } from '../../user/user.model';
import { AllowedRoles, IRole } from '../../role/role.model';
import { PartnerService } from '../../partner/partner.service';
import { AllowedPartnerTypes, IPartner } from '../../partner/partner.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-rm-mapped-intermediate-form',
  templateUrl: './rm-mapped-intermediate-form.component.html',
  styleUrls: ['./rm-mapped-intermediate-form.component.scss']
})
export class RmMappedIntermediateFormComponent implements OnInit {

  modulePath: string = "/backend/admin/rm-mapped-intermediate";
  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;

  optionsIntermediate: ILov[] = []
  optionsPartners: ILov[] = []
  optionsPartnerBasedUsers: ILov[] = []

  role: IRole;
  user: IUser;

  recordSingularName = "Rm Mapped Intermediate";
  recordPluralName = "Rm Mapped Intermediates";

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private accountService: AccountService,
    private rmMappedIntermediateService: RmMappedIntermediateService,
    private partnerService: PartnerService,
    public messageService: MessageService,
    private userService: UserService,
    private router: Router,
  ) {
    this.accountService.currentUser$.subscribe({
      next: (user) => {
        this.role = user.roleId as IRole
        this.user = user
      }
    })
  }

  ngOnInit(): void {

    console.log(this.id)

    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    if (this.id !== "new") {
      this.mode = "edit";
      this.rmMappedIntermediateService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<RmMappedIntermediate>) => {
          this.breadcrumbService.setItems([
            { label: "Pages" }
            // {
            //     label: `${dto.data.entity.name}`,
            //     routerLink: [`${this.modulePath}/new`],
            // },
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

    // mode: New
    this.createForm();
    this.searchOptionsPartners(event);

  }

  createForm(item?: RmMappedIntermediate) {
      console.log(item)
    const IntermediatePartnerId = item?.intermediatePartnerId as IPartner
    const partnerId = item?.partnerId as IPartner
    const rmUserId = item?.rmUserId as IUser


    this.recordForm = this.formBuilder.group({
      _id: [item?._id],
      intermediatePartnerId: [IntermediatePartnerId ? { label: IntermediatePartnerId?.name, value: IntermediatePartnerId?._id } : null ,[Validators.required]],
      partnerId: [partnerId ? { label: partnerId?.name, value: partnerId?._id} : null],
      rmUserId: [rmUserId ? { label: rmUserId?.name, value: rmUserId?._id ,email:rmUserId?.email} : null,[Validators.required]],
      rmEmail: [item?.rmEmail ?? null ,[Validators.required]],
      active: [item?.active ? item?.active : false]
    })
  }

  searchOptionsIntermediates(event) {
    event = {
      first: 0,
      rows: 20,
      sortField: null,
      sortOrder: 1,
      filters: {
        //@ts-ignore
        name: [
          {
            value: event.query,
            matchMode: "startsWith",
            operator: "and"
          }
        ],
        status: [
          {
              value: true,
              matchMode: "equals",
              operator: "and"
          }
        ]
      },
      globalFilter: null,
      multiSortMeta: null
    }

    this.partnerService.getMany(event).subscribe({
      next: data => {
        this.optionsIntermediate = data.data.entities.map(entity => ({ label: entity.name, value: entity._id, partnerType: entity.partnerType }));
        this.optionsIntermediate = this.optionsIntermediate.filter(item => item.partnerType != AllowedPartnerTypes.self && item.partnerType != AllowedPartnerTypes.insurer)
      },
      error: e => { }
    });
  }

  searchOptionsPartners(event) {
    if (this.user.partnerId['partnerType'] == AllowedPartnerTypes.insurer) {
      console.log("In")
      event = {
        first: 0,
        rows: 20,
        sortField: null,
        sortOrder: 1,
        filters: {
          //@ts-ignore  
          name: [
            {
              value: this.user.partnerId['name'],
              matchMode: "equals",
              operator: "or"
            }
          ],
          status: [
            {
                value: true,
                matchMode: "equals",
                operator: "and"
            }
          ]
        },
        globalFilter: null,
        multiSortMeta: null
      }

      this.partnerService.getMany(event).subscribe({
        next: data => {
          this.optionsPartners = data.data.entities.map(entity => ({ label: entity.name, value: entity._id, partnerType: entity.partnerType }));
          this.optionsPartners = this.optionsPartners.filter(item => item.partnerType == AllowedPartnerTypes.insurer)
        },
        error: e => { }
      });
    } else {
      event = {
        first: 0,
        rows: 20,
        sortField: null,
        sortOrder: 1,
        filters: {
          //@ts-ignore
          name: [
            {
              value: event.query,
              matchMode: "startsWith",
              operator: "and"
            }
          ],
          status: [
            {
                value: true,
                matchMode: "equals",
                operator: "and"
            }
          ]
        },
        globalFilter: null,
        multiSortMeta: null
      }

      this.partnerService.getMany(event).subscribe({
        next: data => {
          this.optionsPartners = data.data.entities.map(entity => ({ label: entity.name, value: entity._id, partnerType: entity.partnerType }));
          this.optionsPartners = this.optionsPartners.filter(item => item.partnerType == AllowedPartnerTypes.insurer)
        },
        error: e => { }
      });
    }
  }

  searchOptionsPartnerBasedUsers(event) {
    console.log(this.recordForm.value['partnerId']?.value)
    // if(!this.recordForm.value['partnerId']?.value){
    //   this.messageService.add({
    //     key: "error",
    //     sticky: false,
    //     severity: "warn",
    //     //   summary: 'Access Denied',
    //     summary: 'Plese Select Partner',
    // });
    // }else{
      event = {
        first: 0,
        rows: 20,
        sortField: null,
        sortOrder: 1,
        filters: {
          //@ts-ignore
          partnerId: [
            {
              value: this.recordForm.value['partnerId']?.value,
              matchMode: "equals",
              operator: "or"
            }
          ],
        },
        globalFilter: null,
        multiSortMeta: null
      }
  
      this.userService.getMany(event).subscribe({
        next: data => {
          this.optionsPartnerBasedUsers = data.data.entities
          .filter(user => user.roleId['name']!=AllowedRoles.INSURER_ADMIN && user.roleId['name']!=AllowedRoles.OPERATIONS && user.roleId['name']!=AllowedRoles.INSURER_UNDERWRITER)
          .map(entity => ({ label: entity.name, value: entity._id, email: entity.email }))
        },
        error: e => { }
      })
    // }
  }


  setRmEmail(e){
    this.recordForm.controls['rmEmail'].setValue(e.email)
  }


  saveRecord() {
    console.log(this.recordForm.value);

    if (this.recordForm.valid) {

      const updatePayload = { ...this.recordForm.value };
      updatePayload["intermediatePartnerId"] = this.recordForm.value["intermediatePartnerId"].value;
      // updatePayload["partnerId"] = this.recordForm.value["partnerId"].value;
      updatePayload["rmUserId"] = this.recordForm.value["rmUserId"].value;
      console.log(updatePayload)

      if (this.mode === "edit") {
        this.rmMappedIntermediateService.update(this.id, updatePayload).subscribe({
          next: partner => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        this.rmMappedIntermediateService.create(updatePayload).subscribe({
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
    this.router.navigateByUrl(this.modulePath);
}

}
