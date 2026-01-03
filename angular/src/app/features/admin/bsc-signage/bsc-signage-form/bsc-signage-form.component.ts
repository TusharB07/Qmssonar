import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { IClientLocation } from '../../client-location/client-location.model';
import { ClientLocationService } from '../../client-location/client-location.service';
import { IQuoteSlip } from '../../quote/quote.model';
import { QuoteService } from '../../quote/quote.service';
import { IBscSignage } from '../bsc-signage.model';
import { BscSignageService } from '../bsc-signage.service';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-bsc-signage-form',
  templateUrl: './bsc-signage-form.component.html',
  styleUrls: ['./bsc-signage-form.component.scss']
})
export class BscSignageFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;

  recordSingularName = "BSC Signage";
  recordPluralName = "BSC Signages";
  modulePath: string = "/backend/admin/bsc-signage-cover";
  optionsQuotes: ILov[] = [];
  optionsClientLocations: ILov[] = [];
  constructor(
    private quoteService: QuoteService,
    private clientLocationService: ClientLocationService,
    private recordService: BscSignageService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.recordService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IBscSignage>) => {

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
  }

  createForm(bscSignage?: IBscSignage) {
    const quote: IQuoteSlip = bscSignage?.quoteId as IQuoteSlip;
    // const clientLocation: IClientLocation = bscSignage?.clientLocationId as IClientLocation;
    this.recordForm = this.formBuilder.group({
      _id: [bscSignage?._id],
      signageType: [bscSignage?.signageTypeId, [Validators.required, Validators.pattern("^[a-zA-Z -']+")]],
      signageDescription: [bscSignage?.signageDescription, [Validators.pattern("^[a-zA-Z -']+")]],
      sumInsured: [bscSignage?.sumInsured, [Validators.min(0)]],
      total: [bscSignage?.total, [Validators.min(0)]],
      quoteId: [quote ? { label: quote.quoteNo, value: quote._id } : null, [Validators.required]],
    //   clientLocationId: [clientLocation ? { label: clientLocation.locationName, value: clientLocation._id } : null, [Validators.required]],
    });
  }

  saveRecord() {
    // console.log(this.userForm.value);

    if (this.recordForm.valid) {

      const updatePayload = { ...this.recordForm.value };

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


  searchOptionsQuotes(event) {
    let  lazyLoadEvent: LazyLoadEvent = {
        first: 0,
        rows: 200,
        sortField: null,
        sortOrder: 1,
        filters: {
          // @ts-ignore
          quoteNo: [
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
    this.quoteService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        this.optionsQuotes = data.data.entities.map(entity => ({ label: entity.quoteNo, value: entity._id }));
      },
      error: e => { }
    });
  }

  /* searchOptionsClientLocations(event) {
    this.clientLocationService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsClientLocations = data.data.entities.map(entity => ({ label: entity.address, value: entity._id }));
      },
      error: e => { }
    });
  } */

  onCancel() {
    this.router.navigateByUrl(`${this.modulePath}`);
  }

}
