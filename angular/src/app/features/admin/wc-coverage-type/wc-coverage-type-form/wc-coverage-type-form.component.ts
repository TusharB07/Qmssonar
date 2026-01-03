import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IWCCoverageType } from '../wc-coverage-type.model';
import { WCCoverageTypeService } from '../wc-coverage-type.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { IProduct } from '../../product/product.model';
import { ProductService } from '../../product/product.service';
import { AllowedRoles, IRole } from '../../role/role.model';
import { IUser } from '../../user/user.model';
import { PartnerService } from '../../partner/partner.service';
import { AccountService } from 'src/app/features/account/account.service';
import { AllowedPartnerTypes, IPartner } from '../../partner/partner.model';
import { DialogService } from 'primeng/dynamicdialog';


@Component({
  selector: 'app-wc-coverage-type-form',
  templateUrl: './wc-coverage-type-form.component.html',
  styleUrls: ['./wc-coverage-type-form.component.scss']
})
export class WCCoverageTypeFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  optionsProducts: ILov[] = [];
  recordSingularName = "Coverage Type";
  recordPluralName = "Coverage Types";
  modulePath: string = "/backend/admin/wccoveragetypes";
  isCoveragePaidORFreeDash: string = 'Free';
  isCoverageOrStandard: string = 'Coverage';
  role: IRole
  AllowedRoles = AllowedRoles
  user: IUser;
 

  // To Show Options of partners
  optionsPartners: ILov[] = [];
  searchOptionsPartners: any;
 
  constructor(
    private wcCoverageTypeService: WCCoverageTypeService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private productService: ProductService,
    public partnerService: PartnerService,
    private accountService: AccountService,
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
      this.optionsPartners = this.optionsPartners.filter(item => item.partnerType == AllowedPartnerTypes.self)
  })
  this.id = this.activatedRoute.snapshot.paramMap.get("id");
    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.wcCoverageTypeService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IWCCoverageType>) => {
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



  onPaidorFreeChanged(event: any) {
    //console.log(this.isCoveragePaidORFreeDash)
    const formValue = this.recordForm.value;
    this.isCoveragePaidORFreeDash = formValue.coveragePaidORFree;
    //calculate age
    if (this.isCoveragePaidORFreeDash) {
      if (this.isCoveragePaidORFreeDash == "Free") {
        this.recordForm.controls.isFree?.setValue(true);
        this.recordForm.controls.isPaid?.setValue(false);
      }
      if (this.isCoveragePaidORFreeDash == "Paid") {
        this.recordForm.controls.isFree?.setValue(false);
        this.recordForm.controls.isPaid?.setValue(true);
      }
    }
    else {
      this.isCoveragePaidORFreeDash = "Free";
      this.recordForm.controls.isFree?.setValue(true);
      this.recordForm.controls.isPaid?.setValue(false);
      this.recordForm.controls.coveragePaidORFree?.setValue("Free");

    }
    this.createForm(this.recordForm.value);
  }

  onCoverageOrStandard(event: any) {
    const formValue = this.recordForm.value;
    let _isStandard = false;
    if (formValue.isStandard) {
      this.isCoverageOrStandard = 'Standard'
      _isStandard = true;
    } else {
      this.isCoverageOrStandard = 'Coverage'
      _isStandard = false;
    }
    this.recordForm.controls.isStandard?.setValue(_isStandard);
    this.createForm(this.recordForm.value);
  }


  createForm(item?: IWCCoverageType) {
    const productId = item?.productId as IProduct;
    const partner = item?.partnerId as IPartner

    if (item?.isFree) {
      this.isCoveragePaidORFreeDash = "Free";
    }
    else if (item?.isPaid) {
      this.isCoveragePaidORFreeDash = "Paid";
    }
    else {
      this.isCoveragePaidORFreeDash = "Free";
    }
    if (item) {
      item.isStandard = item?.isStandard == undefined ? false : item?.isStandard;
      if (item?.isStandard) {
        this.isCoverageOrStandard = 'Standard'
      } else {
        this.isCoverageOrStandard = 'Coverage'
      }
    }
   
    this.recordForm = this.formBuilder.group({
      partnerId: [partner ? { label: partner.name, value: partner._id } : null],
      productId: [productId ? { label: productId.type, value: productId._id } : null],
      coverageType: [item?.coverageType, [Validators.required]],
      rate: [item?.rate, [Validators.required]],
      isPaid: [this.isCoveragePaidORFreeDash == "Paid" ? true : false],
      isFree: [this.isCoveragePaidORFreeDash == "Free" ? true : false],
      coveragePaidORFree: [this.isCoveragePaidORFreeDash],
      active: [item?.active],
      taskStatus: [{ value: item?.taskStatus ?? null, disabled: true }],
      failedMessage: [{ value: item?.failedMessage, disabled: true }],
      isStandard: [item?.isStandard == undefined ? false : item?.isStandard, [Validators.required]]
    });
  }


  


  searchOptionsProducts(event) {
    let lazyLoadEvent: LazyLoadEvent = {
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

  saveRecord() {
    this.wcCoverageTypeService.setFilterValueExist(true);
    if (this.recordForm.valid) {

      const updatePayload = { ...this.recordForm.value };
      updatePayload["productId"] = this.recordForm.value["productId"].value;
      updatePayload["partnerId"] = this.recordForm.value["partnerId"].value;

      // let payload={};
      // let _coverageType=this.recordForm.value["coverageType"];
      // payload["name"] = _coverageType;
      // payload["productId"] = this.recordForm.value["productId"].value;
      // payload["id"] = this.id;

      // this.wcCoverageTypeService.checkUniqueName(payload).subscribe({
      //   next: (dto: IOneResponseDto<any>) => {
      //       console.log(dto)
      //       if (dto.status == 'already exist') {
      //         this.showMessages('error', 'Error','Coverage Type: '+_coverageType+ ' is already exist');
      //       }
      //       else if(dto.status == 'not exist')
      //       {
      if (this.mode === "edit") {
        this.wcCoverageTypeService.update(this.id, updatePayload).subscribe({
          next: si => {
            this.router.navigateByUrl(`${this.modulePath}`);

          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {

        this.wcCoverageTypeService.create(updatePayload).subscribe({
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
    this.wcCoverageTypeService.setFilterValueExist(true);
    this.router.navigateByUrl(`${this.modulePath}`);
  }

}
