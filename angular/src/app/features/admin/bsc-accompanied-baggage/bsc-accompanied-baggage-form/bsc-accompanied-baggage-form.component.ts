import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IClientLocation } from '../../client-location/client-location.model';
import { ClientLocationService } from '../../client-location/client-location.service';
import { IBscAccompaniedBaggage } from '../bsc-accompanied-baggage.model';
import { BscAccompaniedBaggageService } from '../bsc-accompanied-baggage.service';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-bsc-accompanied-baggage-form',
  templateUrl: './bsc-accompanied-baggage-form.component.html',
  styleUrls: ['./bsc-accompanied-baggage-form.component.scss']
})
export class BscAccompaniedBaggageFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;

  recordSingularName = "BSC Accompanied Baggage";
  recordPluralName = "BSC Accompanied Baggages";
  optionsQuotes: ILov[] = [];
  optionsClientLocations: ILov[] = [];


  modulePath: string = "/backend/admin/bsc-accompanied-baggage-cover";
  constructor(
    private quoteService: QuoteService,
    private clientLocationService: ClientLocationService,
    private recordService: BscAccompaniedBaggageService,
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
        next: (dto: IOneResponseDto<IBscAccompaniedBaggage>) => {

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

  createForm(bscAccompaniedBaggage?: IBscAccompaniedBaggage) {
    const quote: IQuoteSlip = bscAccompaniedBaggage?.quoteId as IQuoteSlip;
    // const clientLocation: IClientLocation = bscAccompaniedBaggage?.clientLocationId as IClientLocation;
    this.recordForm = this.formBuilder.group({
      _id: [bscAccompaniedBaggage?._id],
      baggageType: [bscAccompaniedBaggage?.baggageTypeId, [Validators.required, Validators.pattern("^[a-zA-Z -']+")]],
      baggageDescription: [bscAccompaniedBaggage?.baggageDescription, [Validators.pattern("^[a-zA-Z -']+")]],
      sumInsured: [bscAccompaniedBaggage?.sumInsured, []],
      total: [bscAccompaniedBaggage?.total, Validators.min(0),[]],
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
