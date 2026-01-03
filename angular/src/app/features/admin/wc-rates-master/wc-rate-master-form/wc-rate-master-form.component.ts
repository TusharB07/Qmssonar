import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IWCRates } from '../wc-rate-master.model';
import { WCRatesService } from '../wc-rate-master.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { IProduct } from '../../product/product.model';
import { ProductService } from '../../product/product.service';
import { IBusinessType } from '../../wc-business-type/wc-business-type.model';
import { ISalarySlabs } from '../../wc-salary-slabs/wc-salary-slabs.model';
import { BusinessTypeService } from '../../wc-business-type/wc-business-type.service';
import { SalarySlabsService } from '../../wc-salary-slabs/wc-salary-slabs.service';
import { AllowedPartnerTypes, IPartner } from '../../partner/partner.model';
import { AllowedRoles, IRole } from '../../role/role.model';
import { IUser } from '../../user/user.model';
import { PartnerService } from '../../partner/partner.service';
import { AccountService } from 'src/app/features/account/account.service';

@Component({
  selector: 'app-wc-rate-master-form',
  templateUrl: './wc-rate-master-form.component.html',
  styleUrls: ['./wc-rate-master-form.component.scss']
})
export class WCRatesFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  optionsProducts: ILov[]=[];
  optionsBusinessTypes: ILov[]=[];
  optionsSalaries: ILov[]=[];
  recordSingularName = "Workmen's Compensation Rate";
  recordPluralName = "Workmen's Compensation Rates";
  modulePath: string = "/backend/admin/wcRates";

  role: IRole
  AllowedRoles = AllowedRoles
  user: IUser;

  // To Show Options of partners
  optionsPartners: ILov[] = [];
  searchOptionsPartners  : any 
  constructor(
    private wcRatesService: WCRatesService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private productService: ProductService,
    private businessTypeService: BusinessTypeService,
    private salarySlabsService: SalarySlabsService,
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
      this.wcRatesService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IWCRates>) => {
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

  createForm(item?: IWCRates) {
   
    const productId = item?.productId as IProduct;
    const partner = item?.partnerId as IPartner
    const businessId = item?.businessTypeId as IBusinessType;
    const wcSalaryId=item?.salaryId as ISalarySlabs;
    this.recordForm = this.formBuilder.group({
      partnerId: [partner ? { label: partner.name, value: partner._id } : null],
      productId: [productId ? { label: productId.type, value: productId._id } : null, [Validators.required]],
      businessTypeId: [businessId ? { label: businessId.businessType, value: businessId._id } : null, [Validators.required]], 
      salaryId: [wcSalaryId ? { label: wcSalaryId.salaryStr, value: wcSalaryId._id } : null, [Validators.required]], 
      rate: [item?.rate,  [Validators.required]],
      rateAbove: [item?.rateAbove,  [Validators.required]],
      endorsementNo: [item?.endorsementNo,  [Validators.required]],
      classificationNo: [item?.classificationNo,  [Validators.required]],
      effectiveStartDate: [item?.effectiveStartDate ? String(item?.effectiveStartDate).split('T')[0] : null],
      active: [item?.active],
      taskStatus : [{value : item?.taskStatus ?? null,disabled : true}] ,
      failedMessage : [{value : item?.failedMessage,disabled : true}]
    });
  }

  saveRecord() {
    this.wcRatesService.setFilterValueExist(true);
    

    if (this.recordForm.valid) {

        const updatePayload = { ...this.recordForm.value };
        updatePayload["productId"] = this.recordForm.value["productId"].value;
        updatePayload["businessTypeId"] = this.recordForm.value["businessTypeId"].value;
        updatePayload["salaryId"] = this.recordForm.value["salaryId"].value;
        updatePayload["partnerId"] = this.recordForm.value["partnerId"].value;

        //Check unique
        // let payload={};
        // payload["salaryid"] =  this.recordForm.value["salaryId"].value;
        // payload["productId"] = this.recordForm.value["productId"].value;
        // payload["businessTypeid"] = this.recordForm.value["businessTypeId"].value;
        // payload["id"] =  this.id;
        // this.wcRatesService.checkUniqueName(payload).subscribe({
        //   next: (dto: IOneResponseDto<any>) => {
        //       console.log(dto)
        //       if (dto.status == 'already exist') {
        //         this.showMessages('error', 'Error','Rate for business type: '+this.recordForm.value["businessTypeId"].label+ ' and salary slab: ' +this.recordForm.value["salaryId"].label+' is already exist');
        //       }
        //       else if(dto.status == 'not exist')
        //       {
              if (this.mode === "edit") {
              this.wcRatesService.update(this.id , updatePayload).subscribe({
              next: si => {
              this.router.navigateByUrl(`${this.modulePath}`);

              },
              error: error => {
              console.log(error);
              }
              });
              }
              if (this.mode === "new") {


              this.wcRatesService.create(updatePayload).subscribe({
              next: si => {
              this.router.navigateByUrl(`${this.modulePath}`);
              },
              error: error => {
              console.log(error);
              }
              });
              }

              }
              else
              {

              }
    //         }
    //         });
    // }
    
  }

  showMessages(severityInfo, summaryInfo, detailInfo) {
    this.messageService.add({ severity: severityInfo, summary: summaryInfo, detail: detailInfo });
  }
  onCancel() {
    this.wcRatesService.setFilterValueExist(true);
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

  searchOptionsBusinessTypes(event) {
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
          ]
        },
        globalFilter: null,
        multiSortMeta: null
      }
    this.businessTypeService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        const partner = this.user?.partnerId as IPartner;
        this.optionsBusinessTypes = data.data.entities.filter(x=>x.partnerId?.['partnerType']==partner.partnerType).map(entity => ({ label: entity.businessType, value: entity._id }));
      },
      error: e => { }
    });
  }

  searchOptionsSalaries(event) {
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
          ]
        },
        globalFilter: null,
        multiSortMeta: null
      }
    this.salarySlabsService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        const partner = this.user?.partnerId as IPartner;
        this.optionsSalaries = data.data.entities.filter(x=>x.partnerId?.['partnerType']==partner.partnerType).map(entity => ({ label: entity.salaryStr, value: entity._id }));
      },
      error: e => { }
    });
  }

}
