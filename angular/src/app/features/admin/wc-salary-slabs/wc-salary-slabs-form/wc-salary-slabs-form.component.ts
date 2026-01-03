import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { ISalarySlabs } from '../wc-salary-slabs.model';
import { SalarySlabsService } from '../wc-salary-slabs.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { IProduct } from '../../product/product.model';
import { ProductService } from '../../product/product.service';
import { AllowedRoles, IRole } from '../../role/role.model';
import { IUser } from '../../user/user.model';
import { PartnerService } from '../../partner/partner.service';
import { AccountService } from 'src/app/features/account/account.service';
import { AllowedPartnerTypes, IPartner } from '../../partner/partner.model';

@Component({
  selector: 'app-wc-salary-slabs-form',
  templateUrl: './wc-salary-slabs-form.component.html',
  styleUrls: ['./wc-salary-slabs-form.component.scss']
})
export class SalarySlabsFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  optionsProducts: ILov[]=[];
  recordSingularName = "Salary";
  recordPluralName = "Salaries";
  modulePath: string = "/backend/admin/salaryslabs";
  a_from:number;
  a_To:number;
  role: IRole
  AllowedRoles = AllowedRoles
  user: IUser;

  // To Show Options of partners
  optionsPartners: ILov[] = [];
  searchOptionsPartners  : any 
  constructor(
    private salarySlabsService: SalarySlabsService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private productService: ProductService,
    public partnerService: PartnerService,
    private accountService: AccountService
  ) { 
    this.accountService.currentUser$.subscribe({
      next: (user) => {
          this.role = user.roleId as IRole
          this.user = user
          console.log(this.user)
      }
  })
    
  }
  ngOnInit(): void {
    this.searchOptionsPartners = ($event) => this.partnerService.searchOptionsPartners($event).then((records) => {
      this.optionsPartners = records
      console.log(this.optionsPartners)
      this.optionsPartners = this.optionsPartners.filter(item => item.partnerType == AllowedPartnerTypes.self)
  })
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.salarySlabsService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<ISalarySlabs>) => {
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

  createForm(item?: ISalarySlabs) {
    const partner = item?.partnerId as IPartner
    const productId = item?.productId as IProduct;
    
    this.recordForm = this.formBuilder.group({
      partnerId: [partner ? { label: partner.name, value: partner._id } : null],
      productId: [productId ? { label: productId.type, value: productId._id } : null, [Validators.required]], 
      fromSalary: [item?.fromSalary,  [Validators.required]],
      toSalary: [item?.toSalary,  [Validators.required]],
      salaryStr: [item?.salaryStr?item.salaryStr:null,  [Validators.required]],
      effectiveStartDate: [item?.effectiveStartDate ? String(item?.effectiveStartDate).split('T')[0] : null],
      active: [item?.active],
      taskStatus : [{value : item?.taskStatus ?? null,disabled : true}] ,
      failedMessage : [{value : item?.failedMessage,disabled : true}]
    });
  }


  onFocusOutSalaryEvent()
  {
    const formValue = this.recordForm.value;
    this.a_from=formValue.fromSalary==null?0:formValue.fromSalary;
    this.a_To=formValue.toSalary==null?0:formValue.toSalary;

    //calculate age
    let limitString=this.a_from+ "-"+this.a_To;
    this.recordForm.controls.salaryStr?.setValue(limitString);
  }

  saveRecord() {
    this.salarySlabsService.setFilterValueExist(true);
    

    if (this.recordForm.valid) {

      
       
      
      const updatePayload = { ...this.recordForm.value };
      updatePayload["productId"] = this.recordForm.value["productId"].value;
      updatePayload["partnerId"] = this.recordForm.value["partnerId"].value;

      // let payload={};
      // let _salarySlab=this.recordForm.value["salaryStr"];
      // payload["name"] = _salarySlab;
      // payload["productId"] = this.recordForm.value["productId"].value;
      // payload["id"] = this.id;
      // this.salarySlabsService.checkUniqueName(payload).subscribe({
      //   next: (dto: IOneResponseDto<any>) => {
      //       console.log(dto)
      //       if (dto.status == 'already exist') {
      //         this.showMessages('error', 'Error','Salary slab: '+_salarySlab+ ' is already exist');
      //       }
      //       else if(dto.status == 'not exist')
      //       {
      if (this.mode === "edit") {
        if(this.recordForm.value.fromSalary >= this.recordForm.value.toSalary)
        {
          this.showMessages('error', 'Error','From salary must be smaller than To salary.');
          this.submitted=false;
          return;
        }
        this.salarySlabsService.update(this.id , updatePayload).subscribe({
          next: si => {
            this.router.navigateByUrl(`${this.modulePath}`);

          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        if(this.recordForm.value.fromSalary >= this.recordForm.value.toSalary )
        {
          this.showMessages('error', 'Error','From salary must be smaller than To salary.');
          this.submitted=false;
          return;
        }
        
      
        this.salarySlabsService.create(updatePayload).subscribe({
          next: si => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
            }
        }
    //   }
    //   });
  
    // }
    
  }

  showMessages(severityInfo, summaryInfo, detailInfo) {
    this.messageService.add({ severity: severityInfo, summary: summaryInfo, detail: detailInfo });
  }
  onCancel() {
    this.salarySlabsService.setFilterValueExist(true);
    this.router.navigateByUrl(`${this.modulePath}`);
  }

  searchOptionsProducts(event) {
    let  lazyLoadEvent: LazyLoadEvent = {
        first: 0,
        rows: 200,
        sortField: null,
        sortOrder: 1,
        filters: {
          // @ts-ignore
          type: [
            {
              value: event.query,
              matchMode: "startsWith",
              operator: "or"
            }
          ],
          // @ts-ignore
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
    this.productService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        this.optionsProducts = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));
      },
      error: e => { }
    });
  }

}
