import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IQuoteSlip } from '../../quote/quote.model';
import { QuoteService } from '../../quote/quote.service';
import { IFloaterCoverAddOn } from '../floater-cover-addon.model';
import { FloaterCoverAddonService } from '../floater-cover-addon.service';

@Component({
  selector: 'app-floater-cover-addon-form',
  templateUrl: './floater-cover-addon-form.component.html',
  styleUrls: ['./floater-cover-addon-form.component.scss']
})
export class FloaterCoverAddonFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  recordSingularName = "Floater Cover Addon";
  recordPluralName = "Floater Cover Addon";
  modulePath: string = "/backend/admin/floater-cover-addon";
  optionsQuotes: ILov[] = [];

  quote: IFloaterCoverAddOn;
  constructor(
    private floaterCoverAddonService: FloaterCoverAddonService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
    private quoteService: QuoteService,

  ) {

  }
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");


    if (this.id !== "new") {
      this.mode = "edit";
      this.floaterCoverAddonService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IFloaterCoverAddOn>) => {

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

  createForm(quote?: IFloaterCoverAddOn) {
    const quoteId = quote?.quoteId as IQuoteSlip

    this.recordForm = this.formBuilder.group({

      quoteId: [quoteId? { label: quoteId.quoteNo, value: quoteId._id } : null],
      stockValue: [ quote?.stockValue,  [Validators.required]],
      whetherStockStoredInOpen: [ quote?.whetherStockStoredInOpen,  [Validators.required]],

      sumInsured: [ quote?.sumInsured ,  [Validators.required]],
      // id: [ quote?._id ,  [Validators.required]],
    });
  }

  saveRecord() {
    // console.log(this.userForm.value);

    if (this.recordForm.valid) {

        const updatePayload = { ...this.recordForm.value };
        updatePayload["quoteId"] = this.recordForm?.value["quoteId"]?.value;

      if (this.mode === "edit") {
        this.floaterCoverAddonService.update(this.id , updatePayload).subscribe({
          next: partner => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        this.floaterCoverAddonService.create(updatePayload).subscribe({
          next: partner => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
      }
    }


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
