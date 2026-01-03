import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { Subscription } from 'rxjs';
import { WarrantyService } from 'src/app/features/admin/warranty/warranty.service';
import { ExclusionService } from 'src/app/features/admin/exclusion/exclusion.service';
import { SubjectivityService } from 'src/app/features/admin/subjectivity/subjectivity.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { ProjectDetailsService } from 'src/app/features/broker/project-details-dialog/project-details.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProjectDetailsDialogComponent } from 'src/app/features/broker/project-details-dialog/project-details-dialog.component';
import { IExpiredDetails } from 'src/app/features/broker/expired-details-dialog-form/expired-details-dialog-form.model';

@Component({
  selector: 'app-quote-insurer-review-warrenties-exclusions-subjectives-tab',
  templateUrl: './quote-insurer-review-warrenties-exclusions-subjectives-tab.component.html',
  styleUrls: ['./quote-insurer-review-warrenties-exclusions-subjectives-tab.component.scss']
})
export class QuoteInsurerReviewWarrentiesExclusionsSubjectivesTabComponent implements OnInit {

  selectedExclusions: string[] = [];
  selectedWarrenties: string[] = [];
  selectedSubjectivities: string[] = [];
  displayWarrenyDialog: boolean = false;
  displayExclusionsDialog: boolean = false;
  displaySubjectivitiesDialog: boolean = false;
  saveDialogeFlag: boolean = false;
  saveType: string = '';
  newWarrenty: string = '';
  newExclusion: string = '';
  newSubjectivity: string = '';
  showWarrentyInput: boolean = false;
  showExclusionInput: boolean = false;
  showSubjectivityInput: boolean = false;
  //   quoteId: string = '';
  quote: IQuoteSlip;
  selectedQuoteLocationOccpancyId: string;
  warrenyIndex: number = 0;
  exclusionsIndex: number = 0;
  subjectivitiesindex: number = 0;
  name: any;
  otherSelectedWarrenties: string[] = [];
  otherSelectedExclusion: string[] = [];
  otherSelectedSubjectivity: string[] = [];

  private currentQuote: Subscription;

  warrenties: ILov[] = [];

  exclusions: ILov[] = [];

  subjectivities: ILov[] = [];

  private currentPropertyQuoteOption: Subscription;                      // New_Quote_option
  quoteOptionData: IQuoteOption                                          // New_Quote_option
  warrantiesInputs: any = [];
  exclusionsInputs: any = [];
  subjectivitiesInputs: any = [];
  projectDetailsData: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private quoteService: QuoteService,
    private warrentyService: WarrantyService,
    private exclusionService: ExclusionService,
    private subjectivityService: SubjectivityService,
    private messageService: MessageService,
    private quoteOptionService: QuoteOptionService,
    private projectDetailsService: ProjectDetailsService,
    private dialogService: DialogService,

  ) {
    // this.quoteId = this.activatedRoute.parent.snapshot.paramMap.get("quote_id");

    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote: IQuoteSlip) => {
        this.quote = quote;

        // Old_Quote
        // this.warrenties = [...quote?.locationBasedCovers?.warranties];
        // this.newWarrenty = quote.locationBasedCovers.warranties.filter(warranty => warranty?.warranty_dict?.name == 'Other').map(warranty => warranty?.warranty_dict?.other_desc)[0];
        // this.otherSelectedWarrenties = quote.locationBasedCovers.warranties.filter(warranty => warranty?.warranty_dict?.name == 'Other' && warranty?.warranty_dict?.checkbox === true).map(warranty => warranty?.warranty_dict?._id);
        // this.selectedWarrenties = this.quote.locationBasedCovers.warranties.filter(warranty => warranty?.warranty_dict?.checkbox === true && warranty?.warranty_dict?.name != 'Other').map(item => item?.warranty_dict._id);

        // this.exclusions = [...quote?.locationBasedCovers?.exclusions];
        // this.newExclusion = quote.locationBasedCovers.exclusions.filter(exclusion => exclusion?.exclusion_dict?.name == 'Other').map(item => item?.exclusion_dict?.other_desc)[0];
        // this.otherSelectedExclusion = quote.locationBasedCovers.exclusions.filter(exclusion => exclusion?.exclusion_dict?.name == 'Other' && exclusion?.exclusion_dict?.checkbox === true).map(item => item?.exclusion_dict?._id);
        // this.selectedExclusions = this.quote.locationBasedCovers.exclusions.filter(exclusion => exclusion?.exclusion_dict.checkbox === true && exclusion?.exclusion_dict?.name != 'Other').map(item => item?.exclusion_dict._id);

        // this.subjectivities = [...quote?.locationBasedCovers?.subjectivities];
        // this.newSubjectivity = quote.locationBasedCovers.subjectivities.filter(subjectivity => subjectivity?.subjectivity_dict?.name == 'Other').map(item => item?.subjectivity_dict?.other_desc)[0];
        // this.otherSelectedSubjectivity = quote.locationBasedCovers.subjectivities.filter(subjectivity => subjectivity?.subjectivity_dict?.name == 'Other' && subjectivity?.subjectivity_dict?.checkbox === true).map(item => item?.subjectivity_dict?._id);
        // this.selectedSubjectivities = this.quote.locationBasedCovers.subjectivities.filter(subjectivity => subjectivity?.subjectivity_dict.checkbox === true && subjectivity?.subjectivity_dict?.name != 'Other').map(item => item?.subjectivity_dict._id);
      }
    });

    // New_Quote_option
    this.currentPropertyQuoteOption = this.quoteOptionService.currentPropertyQuoteOption$.subscribe({
      next: (dto: IQuoteOption) => {
        this.quoteOptionData = dto
        this.warrantiesInputs = dto['warrantiesList'];
        if (!this.warrantiesInputs.length) {
          this.addInputWarranties();
        }
        this.subjectivitiesInputs = dto['subjectivityList'];
        if (!this.subjectivitiesInputs.length) {
          this.addInputSubjectivities();
        }
        this.exclusionsInputs = dto['exclusionList'];
        if (!this.exclusionsInputs.length) {
          this.addInputExclusions();
        }
        this.warrenties = [...this.quoteOptionData?.locationBasedCovers?.warranties];
        this.newWarrenty = this.quoteOptionData.locationBasedCovers.warranties.filter(warranty => warranty?.warranty_dict?.name == 'Other').map(warranty => warranty?.warranty_dict?.other_desc)[0];
        this.otherSelectedWarrenties = this.quoteOptionData.locationBasedCovers.warranties.filter(warranty => warranty?.warranty_dict?.name == 'Other' && warranty?.warranty_dict?.checkbox === true).map(warranty => warranty?.warranty_dict?._id);
        this.selectedWarrenties = this.quoteOptionData.locationBasedCovers.warranties.filter(warranty => warranty?.warranty_dict?.checkbox === true && warranty?.warranty_dict?.name != 'Other').map(item => item?.warranty_dict._id);

        this.exclusions = [...this.quoteOptionData?.locationBasedCovers?.exclusions];
        this.newExclusion = this.quoteOptionData.locationBasedCovers.exclusions.filter(exclusion => exclusion?.exclusion_dict?.name == 'Other').map(item => item?.exclusion_dict?.other_desc)[0];
        this.otherSelectedExclusion = this.quoteOptionData.locationBasedCovers.exclusions.filter(exclusion => exclusion?.exclusion_dict?.name == 'Other' && exclusion?.exclusion_dict?.checkbox === true).map(item => item?.exclusion_dict?._id);
        this.selectedExclusions = this.quoteOptionData.locationBasedCovers.exclusions.filter(exclusion => exclusion?.exclusion_dict.checkbox === true && exclusion?.exclusion_dict?.name != 'Other').map(item => item?.exclusion_dict._id);

        this.subjectivities = [...this.quoteOptionData?.locationBasedCovers?.subjectivities];
        this.newSubjectivity = this.quoteOptionData.locationBasedCovers.subjectivities.filter(subjectivity => subjectivity?.subjectivity_dict?.name == 'Other').map(item => item?.subjectivity_dict?.other_desc)[0];
        this.otherSelectedSubjectivity = this.quoteOptionData.locationBasedCovers.subjectivities.filter(subjectivity => subjectivity?.subjectivity_dict?.name == 'Other' && subjectivity?.subjectivity_dict?.checkbox === true).map(item => item?.subjectivity_dict?._id);
        this.selectedSubjectivities = this.quoteOptionData.locationBasedCovers.subjectivities.filter(subjectivity => subjectivity?.subjectivity_dict.checkbox === true && subjectivity?.subjectivity_dict?.name != 'Other').map(item => item?.subjectivity_dict._id);
      }
    });
  }

  ngOnInit(): void {
    this.getProjectDetails();
  }


  ngOnDestroy(): void {
    this.currentQuote.unsubscribe();
  }

  //   previousPage() {
  //     this.router.navigateByUrl(`backend/quotes/${this.quoteId}/edit/risk-inspection`);
  //   }
  //   nextPage() {
  //     this.router.navigateByUrl(`backend/quotes/${this.quoteId}/edit/decision-matrix`);
  //   }

  showWarrentieDialog(i: number) {
    this.warrenyIndex = i;
    this.displayWarrenyDialog = true;
  }

  showExclusionsDialog(i: number) {
    this.exclusionsIndex = i;
    this.displayExclusionsDialog = true;
  }
  showSubjectivitiesDialog(i: number) {
    this.subjectivitiesindex = i;
    this.displaySubjectivitiesDialog = true;
  }

  saveDialoge(type: string) {
    this.saveType = type;
    this.saveDialogeFlag = true;
  }

  /* addWarrenty() {
    let temp = { name: this.newWarrenty }
    this.warrentyService.create(temp).subscribe(response => {
      this.newWarrenty = '';
      this.saveDialogeFlag = false;
      console.log(response);
      // @ts-ignore
      this.warrenties.push({ warranty_dict: response.data.entity });
      this.selectedWarrenties.push(response.data.entity._id);
    }, error => {
      console.log(error);
    });
  }

  addExclusion() {
    let temp = { name: this.newWarrenty }
    this.exclusionService.create(temp).subscribe(response => {
      this.newWarrenty = '';
      this.saveDialogeFlag = false;
      console.log(response);
      // @ts-ignore
      this.exclusions.push({ exclusion_dict: response.data.entity });
      this.selectedExclusions.push(response.data.entity._id);
    }, error => {
      console.log(error);
    });
  }

  addSubjectivity() {
    let temp = { name: this.newWarrenty }
    this.subjectivityService.create(temp).subscribe(response => {
      this.newWarrenty = '';
      this.saveDialogeFlag = false;
      console.log(response);
      // @ts-ignore
      this.subjectivities.push({ subjectivity_dict: response.data.entity });
      this.selectedSubjectivities.push(response.data.entity._id);
    }, error => {
      console.log(error);
    });
  } */

  saveWarrenty() {
    let temp = {
      others: { _id: '', name: '' },
      warranties: [],
      quoteId: '',
      quoteOptionId: '',
      warrantiesList: []                                                            // New_Quote_option
    }

    temp.quoteId = this.quote._id;
    temp.quoteOptionId = this.quoteOptionData._id;                                 // New_Quote_option
    temp.warranties = [...this.selectedWarrenties];
    temp.others[`name`] = this.newWarrenty;
    temp.warrantiesList = [...this.warrantiesInputs]
    //@ts-ignore
    temp.others[`_id`] = this.warrenties.filter(item => item?.warranty_dict?.name == 'Other').map(item => item.warranty_dict?._id)[0];
    if (this.newWarrenty == '') {
      delete temp.others;
    }

    // Old_Quote
    // this.warrentyService.saveQuoteWarrenties(temp).subscribe(response => {
    //   // console.log(response);
    //   this.messageService.add({
    //     summary: 'Warranty saved',
    //     severity: 'success'
    //   })
    //   this.quoteService.refresh();

    // }, error => {
    //   console.log(error);
    // })


    // New_Quote_option
    this.warrentyService.saveQuoteOptionWarrenties(temp).subscribe(response => {
      this.messageService.add({
        summary: 'Warranty saved',
        severity: 'success'
      })
      this.quoteOptionService.refreshQuoteOption();

    }, error => {
      console.log(error);
    })
  }

  saveSubjectivity() {
    let temp = {
      others: { _id: '', name: '' },
      subjectivity: [],
      quoteId: '',
      quoteOptionId: '',
      subjectivityList: [],                                                            // New_Quote_option
    }

    temp.quoteId = this.quote._id;
    temp.quoteOptionId = this.quoteOptionData._id;                                 // New_Quote_option
    temp.subjectivity = [...this.selectedSubjectivities];
    temp.subjectivityList = [...this.subjectivitiesInputs];
    temp.others[`name`] = this.newSubjectivity;
    //@ts-ignore
    temp.others[`_id`] = this.subjectivities.filter(item => item?.subjectivity_dict?.name == 'Other').map(item => item.subjectivity_dict?._id)[0];
    // temp.others.push(this.newSubjectivity);
    if (this.newSubjectivity == '') {
      delete temp.others;
    }

    // Old_Quote
    // this.subjectivityService.saveQuoteSubjectivities(temp).subscribe(response => {
    //   // console.log(response);
    //   this.messageService.add({
    //     summary: 'Subjectivity saved',
    //     severity: 'success'
    //   })
    //   this.quoteService.refresh();

    // }, error => {
    //   console.log(error);
    // })


    // New_Quote_option
    this.subjectivityService.saveQuoteOptionSubjectivities(temp).subscribe(response => {
      this.messageService.add({
        summary: 'Subjectivity saved',
        severity: 'success'
      })
      this.quoteOptionService.refreshQuoteOption();

    }, error => {
      console.log(error);
    })
  }

  saveExclusion() {
    let temp = {
      others: { _id: '', name: '' },
      exclusion: [],
      quoteId: '',
      quoteOptionId: '',
      exclusionList: [],                                                           // New_Quote_option
    }

    temp.quoteId = this.quote._id;
    temp.quoteOptionId = this.quoteOptionData._id;                                 // New_Quote_option
    temp.exclusion = [...this.selectedExclusions];
    temp.exclusionList = [...this.exclusionsInputs];
    temp.others[`name`] = this.newExclusion;
    //@ts-ignore
    temp.others[`_id`] = this.exclusions.filter(item => item?.exclusion_dict?.name == 'Other').map(item => item.exclusion_dict?._id)[0];

    // temp.others.push(this.newExclusion);
    if (this.newExclusion == '') {
      delete temp.others;
    }

    // Old_Quote
    // this.exclusionService.saveQuoteExclusions(temp).subscribe(response => {
    //   // console.log(response);
    //   this.messageService.add({
    //     summary: 'Exclusion saved',
    //     severity: 'success'
    //   })
    //   this.quoteService.refresh();
    // }, error => {
    //   console.log(error);
    // })

    // New_Quote_option
    this.exclusionService.saveQuoteOptionExclusions(temp).subscribe(response => {
      this.messageService.add({
        summary: 'Exclusion saved',
        severity: 'success'
      })
      this.quoteOptionService.refreshQuoteOption();

    }, error => {
      console.log(error);
    })
  }

  otherWarrenty(e) {
    if (e.checked[0]) {
      this.showWarrentyInput = true;
    }
    else {
      this.showWarrentyInput = false;
      this.newWarrenty = null;
    }
  }

  otherExcusion(e) {
    if (e.checked[0]) {
      this.showExclusionInput = true;
    }
    else {
      this.showExclusionInput = false;
      this.newExclusion = null;
    }
  }

  otherSubjectivity(e) {
    if (e.checked[0]) {
      this.showSubjectivityInput = true;
    }
    else {
      this.showSubjectivityInput = false;
      this.newSubjectivity = null;
    }
  }
  addInputWarranties() {
    this.warrantiesInputs.push({ warranty: '' })
  }
  addInputExclusions() {
    this.exclusionsInputs.push({ exclusion: '' });
  }
  addInputSubjectivities() {
    this.subjectivitiesInputs.push({ subjectivity: '' });
  }
  getInputWarrantiesValue(val: any, item: any) {
    item.warranty = val.target.value
  }
  getInputExclusionsValue(val: any, item: any) {
    item.exclusion = val.target.value
  }
  getInputSubjectivitiesValue(val: any, item: any) {
    item.subjectivity = val.target.value
  }
  removeInputWarranties(index: number) {
    if (this.warrantiesInputs && this.warrantiesInputs.length > index) {
      this.warrantiesInputs.splice(index, 1);
    }
  }
  removeInputExclusions(index: number) {
    if (this.exclusionsInputs && this.exclusionsInputs.length > index) {
      this.exclusionsInputs.splice(index, 1);
    }
  }
  removeInputSubjectivities(index: number) {
    if (this.subjectivitiesInputs && this.subjectivitiesInputs.length > index) {
      this.subjectivitiesInputs.splice(index, 1);
    }
  }
  projectDetails() {
    const ref = this.dialogService.open(ProjectDetailsDialogComponent, {
      header: "Project Details",
      data: {
        quote: this.quote,
        quoteOptionId: this.quoteOptionData._id,
      },
      width: "60vw",
      styleClass: "customPopup"
    }).onClose.subscribe(() => {
      // this.loadQuoteDetails(this.id);
    })
  }
  getProjectDetails() {
    let lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 20,
      sortField: null,
      sortOrder: 1,
      filters: {
        // @ts-ignore
        quoteOptionId: [
          {
            value: this.quoteOptionData._id,
            matchMode: "equals",
            operator: "and"
          }
        ]
      },
      globalFilter: null,
      multiSortMeta: null
    }
    this.projectDetailsService.getMany(lazyLoadEvent).subscribe({
      next: (dto: IOneResponseDto<IExpiredDetails>) => {
        console.log(dto)
        if (dto.data?.entities[0]?._id) {
          this.projectDetailsData = dto.data?.entities
        }
      },
      error: e => {
        console.log(e);
      }
    });
  }
}
