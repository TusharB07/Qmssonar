import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IWCCoverageForMedicalExpenses } from '../wc-coverage-for-mefical-expenses.model';
import { WCCoverageForMedicalExpensesService} from '../wc-coverage-for-mefical-expenses.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { race } from 'rxjs';
import { IProduct } from '../../product/product.model';
import { ProductService } from '../../product/product.service';
import { AllowedRoles, IRole } from '../../role/role.model';
import { IUser } from '../../user/user.model';
import { PartnerService } from '../../partner/partner.service';
import { AccountService } from 'src/app/features/account/account.service';
import { AllowedPartnerTypes, IPartner } from '../../partner/partner.model';

@Component({
  selector: 'app-wc-coverage-for-mefical-expenses-form',
  templateUrl: './wc-coverage-for-mefical-expenses-form.component.html',
  styleUrls: ['./wc-coverage-for-mefical-expenses-form.component.scss']
})
export class WCCoverageForMedicalExpensesFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  optionsProducts: ILov[]=[];
  recordSingularName = "Coverage For Medical Expense";
  recordPluralName = "Coverage For Medical Expenses";
  modulePath: string = "/backend/admin/wccoveragemedicalexpenses";
  isCoveragePaidORFreeDash:string='Free';

  role: IRole
  AllowedRoles = AllowedRoles
  user: IUser;

  // To Show Options of partners
  optionsPartners: ILov[] = [];
  searchOptionsPartners  : any 
  constructor(
    private wcCoveragMedicalExpensesService: WCCoverageForMedicalExpensesService,
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
      this.wcCoveragMedicalExpensesService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IWCCoverageForMedicalExpenses>) => {
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

  createForm(item?: IWCCoverageForMedicalExpenses) {
    const productId = item?.productId as IProduct;
    const partner = item?.partnerId as IPartner

    this.recordForm = this.formBuilder.group({
      partnerId: [partner ? { label: partner.name, value: partner._id } : null],
      productId: [productId ? { label: productId.type, value: productId._id } : null, [Validators.required]], 
      limitPerEmployee: [item?.limitPerEmployee,  [Validators.required]],
      netPremiumPerEmployee: [item?.netPremiumPerEmployee,  [Validators.required]],
      active: [item?.active],
      taskStatus : [{value : item?.taskStatus ?? null,disabled : true}] ,
      failedMessage : [{value : item?.failedMessage,disabled : true}]
    });
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
    

    if (this.recordForm.valid) {

        const updatePayload = { ...this.recordForm.value };
        updatePayload["productId"] = this.recordForm.value["productId"].value;
        updatePayload["partnerId"] = this.recordForm.value["partnerId"].value;

        // let payload={};
        // let _limitPerEmployee=this.recordForm.value["limitPerEmployee"];
        // payload["limit"] = _limitPerEmployee;
        // payload["productId"] = this.recordForm.value["productId"].value;
        // payload["id"] = this.id;
        // this.wcCoveragMedicalExpensesService.checkUniqueName(payload).subscribe({
        //   next: (dto: IOneResponseDto<any>) => {
        //       console.log(dto)
        //       if (dto.status == 'already exist') {
        //         this.showMessages('error', 'Error','Coverage For Medical Expense for Limit per Employee '+_limitPerEmployee+ ' is already exist');
        //       }
        //       else if(dto.status == 'not exist')
        //       {
      if (this.mode === "edit") {
        this.wcCoveragMedicalExpensesService.update(this.id , updatePayload).subscribe({
          next: si => {
            this.router.navigateByUrl(`${this.modulePath}`);

          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
       
              this.wcCoveragMedicalExpensesService.create(updatePayload).subscribe({
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
    //   });
   
    // }
    
  }

  showMessages(severityInfo, summaryInfo, detailInfo) {
    this.messageService.add({ severity: severityInfo, summary: summaryInfo, detail: detailInfo });
  }
  onCancel() {
    this.router.navigateByUrl(`${this.modulePath}`);
  }

}
