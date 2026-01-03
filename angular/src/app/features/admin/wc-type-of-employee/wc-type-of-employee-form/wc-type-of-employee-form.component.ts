import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IWCTypeOfEmployee } from '../wc-type-of-employee.model';
import { WCTypeOfEmployeeService } from '../wc-type-of-employee.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { ProductService } from '../../product/product.service';
import { IProduct } from '../../product/product.model';
import { AllowedRoles, IRole } from '../../role/role.model';
import { IUser } from '../../user/user.model';
import { AccountService } from 'src/app/features/account/account.service';
import { PartnerService } from '../../partner/partner.service';
import { AllowedPartnerTypes, IPartner } from '../../partner/partner.model';

@Component({
  selector: 'app-wc-type-of-employee-form',
  templateUrl: './wc-type-of-employee-form.component.html',
  styleUrls: ['./wc-type-of-employee-form.component.scss']
})
export class WCTypeOfEmployeeFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  optionsProducts: ILov[]=[];
  recordSingularName = "Type Of Employee";
  recordPluralName = "Type Of Employees";
  modulePath: string = "/backend/admin/wcTypeOfEmployees";
  role: IRole
  AllowedRoles = AllowedRoles
  user: IUser;

  // To Show Options of partners
  optionsPartners: ILov[] = [];
  searchOptionsPartners  : any 

  constructor(
    private wcTypeOfEmployeeService: WCTypeOfEmployeeService,
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
      this.wcTypeOfEmployeeService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IWCTypeOfEmployee>) => {
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

  createForm(item?: IWCTypeOfEmployee) {
    const partner = item?.partnerId as IPartner
    const productId = item?.productId as IProduct;

    this.recordForm = this.formBuilder.group({
      partnerId: [partner ? { label: partner.name, value: partner._id } : null],
      productId: [productId ? { label: productId.type, value: productId._id } : null, [Validators.required]], 
      typeOfEmployee: [item?.typeOfEmployee,  [Validators.required]],
      maxNoOfEmployee: [item?.maxNoOfEmployee,  [Validators.required]],
      maxSalary: [item?.maxSalary,  [Validators.required]],
      active: [item?.active],
      taskStatus : [{value : item?.taskStatus ?? null,disabled : true}] ,
      failedMessage : [{value : item?.failedMessage,disabled : true}]
    });
  }


  saveRecord() {
    this.wcTypeOfEmployeeService.setFilterValueExist(true);
    

    if (this.recordForm.valid) {

        const updatePayload = { ...this.recordForm.value };
        updatePayload["productId"] = this.recordForm.value["productId"].value;
        updatePayload["partnerId"] = this.recordForm.value["partnerId"].value;


      // let payload={};
      // let _typeOfEmployee=this.recordForm.value["typeOfEmployee"];
      // payload["name"] = _typeOfEmployee;
      // payload["productId"] = this.recordForm.value["productId"].value;
      // payload["id"] = this.id;
      // this.wcTypeOfEmployeeService.checkUniqueName(payload).subscribe({
      //   next: (dto: IOneResponseDto<any>) => {
      //       console.log(dto)
      //       if (dto.status == 'already exist') {
      //         this.showMessages('error', 'Error','Type of employee: '+_typeOfEmployee+ ' is already exist');
      //       }
      //       else if(dto.status == 'not exist')
      //       {
              if (this.mode === "edit") {
              this.wcTypeOfEmployeeService.update(this.id , updatePayload).subscribe({
              next: si => {
              this.router.navigateByUrl(`${this.modulePath}`);

              },
              error: error => {
              console.log(error);
              }
              });
              }
              if (this.mode === "new") {


              this.wcTypeOfEmployeeService.create(updatePayload).subscribe({
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
    this.wcTypeOfEmployeeService.setFilterValueExist(true);
    this.router.navigateByUrl(`${this.modulePath}`);
  }

}
