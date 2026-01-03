import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IWCDescriptionOfEmployee } from '../wc-desc-of-employee.model';
import { WCDescriptionOfEmployeeService } from '../wc-desc-of-employee.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { ProductService } from '../../product/product.service';
import { IProduct } from '../../product/product.model';
import { AllowedRoles, IRole } from '../../role/role.model';
import { IUser } from '../../user/user.model';
import { PartnerService } from '../../partner/partner.service';
import { AccountService } from 'src/app/features/account/account.service';
import { AllowedPartnerTypes, IPartner } from '../../partner/partner.model';

@Component({
  selector: 'app-wc-desc-of-employee-form',
  templateUrl: './wc-desc-of-employee-form.component.html',
  styleUrls: ['./wc-desc-of-employee-form.component.scss']
})
export class WCDescriptionOfEmployeeFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  optionsProducts: ILov[]=[];
  recordSingularName = "Description Of Employee";
  recordPluralName = "Description Of Employees";
  modulePath: string = "/backend/admin/wcdescofemployees";
  role: IRole
  AllowedRoles = AllowedRoles
  user: IUser;

  // To Show Options of partners
  optionsPartners: ILov[] = [];
  searchOptionsPartners  : any 

  constructor(
    private wcDescriptionOfEmployeeService: WCDescriptionOfEmployeeService,
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
      this.wcDescriptionOfEmployeeService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IWCDescriptionOfEmployee>) => {
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

  createForm(item?: IWCDescriptionOfEmployee) {
    const partner = item?.partnerId as IPartner
    const productId = item?.productId as IProduct;

    this.recordForm = this.formBuilder.group({
      partnerId: [partner ? { label: partner.name, value: partner._id } : null],
      productId: [productId ? { label: productId.type, value: productId._id } : null, [Validators.required]], 
      description: [item?.description,  [Validators.required]],
      active: [item?.active],
      taskStatus : [{value : item?.taskStatus ?? null,disabled : true}] ,
      failedMessage : [{value : item?.failedMessage,disabled : true}]
    });
  }


  saveRecord() {
    this.wcDescriptionOfEmployeeService.setFilterValueExist(true);
    

    if (this.recordForm.valid) {

        const updatePayload = { ...this.recordForm.value };
        updatePayload["productId"] = this.recordForm.value["productId"].value;
        updatePayload["partnerId"] = this.recordForm.value["partnerId"].value;

        // let payload={};
        // let _employeeeDesc=this.recordForm.value["description"];
        // payload["name"] = _employeeeDesc;
        // payload["productId"] = this.recordForm.value["productId"].value;
        // payload["id"] = this.id;
        // this.wcDescriptionOfEmployeeService.checkUniqueName(payload).subscribe({
        //   next: (dto: IOneResponseDto<any>) => {
        //       console.log(dto)
        //       if (dto.status == 'already exist') {
        //         this.showMessages('error', 'Error','Desscription Of Employee: '+_employeeeDesc+ ' is already exist');
        //       }
        //       else if(dto.status == 'not exist')
        //       {
      if (this.mode === "edit") {
        this.wcDescriptionOfEmployeeService.update(this.id , updatePayload).subscribe({
          next: si => {
            this.router.navigateByUrl(`${this.modulePath}`);

          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        
                this.wcDescriptionOfEmployeeService.create(updatePayload).subscribe({
                  next: si => {
                    this.router.navigateByUrl(`${this.modulePath}`);
                  },
                  error: error => {
                    console.log(error);
                  }
                });
              }
          }
    //     }
    //     });
    // }
    
  }

  showMessages(severityInfo, summaryInfo, detailInfo) {
    this.messageService.add({ severity: severityInfo, summary: summaryInfo, detail: detailInfo });
  }
  onCancel() {
    this.wcDescriptionOfEmployeeService.setFilterValueExist(true);
    this.router.navigateByUrl(`${this.modulePath}`);
  }

}
