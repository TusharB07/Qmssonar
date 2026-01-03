import { Quote } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { CityService } from '../../city/city.service';
import { IQuoteSlip } from '../../quote/quote.model';
import { QuoteService } from '../../quote/quote.service';
import { StateService } from '../../state/state.service';
import { IClaimExperience } from '../claim-experience.model';
import { ClaimExperienceService } from '../claim-experience.service';

@Component({
  selector: 'app-claim-experience-form',
  templateUrl: './claim-experience-form.component.html',
  styleUrls: ['./claim-experience-form.component.scss']
})
export class ClaimExperienceFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;

  recordSingularName = "Claim Experience";
  recordPluralName = "Claim Experiences";
  modulePath: string = "/backend/admin/claim-experience";
  optionsQuotes: ILov[] = [];
  optionsStates: ILov[] = [];
  quote: IClaimExperience;
  constructor(
    private claimExperienceService: ClaimExperienceService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
    private quoteService: QuoteService,
    // private stateService: StateService
  ) {

  }


  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.claimExperienceService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IClaimExperience>) => {

          this.breadcrumbService.setItems([
            { label: "Pages" },
            {
              label: `${dto.data.entity.quoteId}`,
              routerLink: [`${this.modulePath}`]
            }
          ]);
          this.createForm(dto.data.entity);

          // this.createForm();
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

  createForm(quote?: IClaimExperience) {
    const quoteId = quote?.quoteId as IQuoteSlip

    this.recordForm = this.formBuilder.group({
      // quoteId: [quote?.quoteId, [Validators.required]],
      quoteId: [quoteId? { label: quoteId.quoteNo, value: quoteId._id } : null, [Validators.required]],
      year: [quote?.year, [Validators.required]],
      premiumPaid: [ quote?.premiumPaid ,  [Validators.required]],
      claimAmount: [ quote?.claimAmount ,  [Validators.required]],
      numberOfClaims: [ quote?.numberOfClaims ,  [Validators.required]],
      natureOfClaim: [ quote?.natureOfClaim ,  [Validators.required]],
    });
  }

  saveRecord() {
    // console.log(this.userForm.value);

    if (this.recordForm.valid) {

        const updatePayload = { ...this.recordForm.value };
        updatePayload["quoteId"] = this.recordForm.value["quoteId"].value;

      if (this.mode === "edit") {
        this.claimExperienceService.update(this.id , updatePayload).subscribe({
          next: partner => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        this.claimExperienceService.create(updatePayload).subscribe({
          next: partner => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
      }
    }

    // console.log(this.createForm());
    console.log(this.recordForm.value);

  }

  onCancel() {
    this.router.navigateByUrl(`${this.modulePath}`);
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



}

