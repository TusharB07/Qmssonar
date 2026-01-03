import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { IClient } from '../../client/client.model';
import { ClientService } from '../../client/client.service';
import { IProduct } from '../../product/product.model';
import { ProductService } from '../../product/product.service';
import { ISector } from '../../sector/sector.model';
import { SectorService } from '../../sector/sector.service';
import { IQuoteSlip, OPTIONS_QUOTE_TYPES } from '../quote.model';
import { QuoteService } from '../quote.service';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-quote-form',
  templateUrl: './quote-form.component.html',
  styleUrls: ['./quote-form.component.scss']
})
export class QuoteFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;

  recordSingularName = "Quote";
  recordPluralName = "Quotes";
  modulePath: string = "/backend/admin/quote";

  optionsQuoteType: ILov[] = [];
  optionsSectors: ILov[] = [];
  optionsClients: ILov[] = [];
  optionsProducts: ILov[] = [];


  constructor(
    private recordService: QuoteService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
    private sectorService: SectorService,
    private clientService: ClientService,
    private productService: ProductService,
  ) {
    this.optionsQuoteType = OPTIONS_QUOTE_TYPES;

  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.recordService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IQuoteSlip>) => {
          this.breadcrumbService.setItems([
            { label: "Pages" },
            // {
            //   label: `${dto.data.entity.name}`,
            //   routerLink: [`${this.modulePath}/new`]
            // }
          ]);

          this.createForm(dto.data.entity);
        },
        error: e => {
          console.log(e);
        }
      });
    } else {
      this.breadcrumbService.setItems([{ label: "Pages" }, { label: `Add new ${this.recordSingularName}`, routerLink: [`${this.modulePath}/new`] }]);
    }

    // mode: New
    this.createForm();
  }

  createForm(item?: IQuoteSlip) {
    const product: IProduct = item?.productId as IProduct;
    const client: IClient = item?.clientId as IClient;
    const sector: ISector = item?.sectorId as ISector;

    this.recordForm = this.formBuilder.group({
      _id: [item?._id],
      // quoteNo: [item?.quoteNo],
      quoteType: [item?.quoteType],
      renewalPolicyPeriod: [item?.renewalPolicyPeriod],
      insurredBusiness: [item?.insurredBusiness],
      status: [item?.status],
      deductiblesExcess: [],
      existingBrokerCurrentYear: [item?.existingBrokerCurrentYear],
      otherTerms: [item?.otherTerms],
      additionalInfo: [item?.additionalInfo],
      claim1NoOfClaims: [item?.claim1NoOfClaims],
      claim1Nature: [item?.claim1Nature],
      approvedBy: [item?.approvedBy],
      approvedOn: [item?.approvedOn],
      createdBy: [item?.createdBy],
    //   createdOn: [item?.createdOn],
      clientAddress: [item?.clientAddress],
      totalIndictiveQuoteAmt: [item?.totalIndictiveQuoteAmt],
      brokerages: [],
      targetPremium: [item?.targetPremium],
      claimYear1: [item?.claimYear1],
      claimToYear1: [item?.claimToYear1],
      claim1PremiumPaid: [item?.claim1PremiumPaid],
      claim1ClaimAmount: [item?.claim1ClaimAmount],
      revNo: [item?.revNo],
      sameAsPremium: [item?.sameAsPremium],
      quoteSubmissionDate: [item?.quoteSubmissionDate],
      sectorId: [sector ? { label: sector.name, value: sector._id } : null],
      clientId: [client ? { label: client.name, value: client._id } : null],
      productId: [product ? { label: product.type, value: product._id } : null],
      // name: [city?.name, [Validators.required, Validators.pattern("^[a-zA-Z -']+")]],
      // state: [city?.state, [Validators.required]]
    });
  }

  saveRecord() {
    // console.log(this.userForm.value);

    if (this.recordForm.valid) {
      const updatePayload = { ...this.recordForm.value };
      updatePayload["sectorId"] = this.recordForm.value["sectorId"].value;
      updatePayload["clientId"] = this.recordForm.value["clientId"].value;
      updatePayload["productId"] = this.recordForm.value["productId"].value;

      if (this.mode === "edit") {
        this.recordService.update(this.id, updatePayload).subscribe({
          next: partner => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        this.recordService.create(updatePayload).subscribe({
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

  searchOptionsSectors(event) {
    this.sectorService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsSectors = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
      },
      error: e => { }
    });
  }
  searchOptionsClients(event) {
    this.clientService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsClients = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
      },
      error: e => { }
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
}
