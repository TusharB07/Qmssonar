import { Component, Input, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ILov, IManyResponseDto } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { AccountService } from 'src/app/features/account/account.service';
import { LIABILITY_COVERS_OPTIONS } from 'src/app/features/admin/addon-cover/addon-cover.model';
import { IClaimExperience } from 'src/app/features/admin/claim-experience/claim-experience.model';
import { ClaimExperienceService } from 'src/app/features/admin/claim-experience/claim-experience.service';
import { WCAllowedListOfValuesMasters } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { liabilityEandOTemplateService } from 'src/app/features/admin/quote/quote.liabilityEandOTemplate.service';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { IEandOTemplate, IQuoteSlip, RevenueDetails, RevenueRows, SubjectivityAndMajorExclusions, SubsidiaryDetails, liabiltyAddOnCovers, liabiltyEandODeductibles, uploadAttachmentDetails } from 'src/app/features/admin/quote/quote.model';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
@Component({
  selector: 'app-sub-template-liability-eando',
  templateUrl: './sub-template-liability-eando.component.html',
  styleUrls: ['./sub-template-liability-eando.component.scss']
})
export class SubTemplateLiabilityEandOComponent implements OnInit {
  @Input() quote: IQuoteSlip;
  private currentQuote: Subscription;
  private currentSelectedTemplate: Subscription;

  quoteId: string = "";
  quoteEandOOptions: any
  role: IRole
  AllowedRoles = AllowedRoles
  fileDetails: uploadAttachmentDetails[] = [];
  subsidaryDetails: SubsidiaryDetails[] = [];
  deductiblesInfo: liabiltyEandODeductibles[] = [];
  liabiltyCovers: liabiltyAddOnCovers[] = [];
  optionCovers: ILov[] = [];
  claimExperiences: IClaimExperience[] = []
  OptionEandOPoilcyTypes: ILov[] = []
  policyType: string = ""
  cols: ILov[] = [
    { value: 'period', label: 'Period/Locations' },
    { value: 'firstYear', label: '' },
    { value: 'secondyear', label: '' },
    { value: 'thirdYear', label: '' },
    { value: 'EstForNextYear', label: 'Est for next year' },
  ];
  rows: ILov[] = [
    { value: 'india', label: 'India' },
    { value: 'unitedKingdom', label: 'United Kingdom' },
    { value: 'europe', label: 'Europe' },
    { value: 'usaCanada', label: 'USA/Canada' },
    { value: 'ROW', label: 'ROW (Rest of World)' },
    { value: 'total', label: 'Total' },
  ];
  showExclusionAndSubjectivity: boolean = false
  majorExclusions: SubjectivityAndMajorExclusions[] = []
  subjectivities: SubjectivityAndMajorExclusions[] = []
  constructor(private wclistofmasterservice: WCListOfValueMasterService, private accountService: AccountService, private quoteService: QuoteService, private claimExperienceService: ClaimExperienceService, private appService: AppService, private liabilityEandOTemplateService: liabilityEandOTemplateService) {
    this.accountService.currentUser$.subscribe({
      next: user => {
        const role: IRole = user.roleId as IRole;
        if (AllowedRoles.INSURER_UNDERWRITER != role?.name) {
          this.showExclusionAndSubjectivity = false;
        }
        else {
          this.showExclusionAndSubjectivity = true;
        }
      }
    });
    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        if ([AllowedProductTemplate.LIABILITY_EANDO].includes(this.quote?.productId['productTemplate'])) {
          this.liabilityEandOTemplateService.getTemplateById(template._id, template.quoteId).subscribe({
            next: quoteLiablitity => {
              if (quoteLiablitity) {
                console.log("E&O Get Successfully :" +quoteLiablitity.data.entity.optionName);
                if (quoteLiablitity) {
                  this.quoteEandOOptions = quoteLiablitity.data.entity;
                  this.subsidaryDetails = this.quoteEandOOptions.subsidaryDetails;
                  this.fileDetails = this.quoteEandOOptions.basicDetailsAttchments;
                  this.subsidaryDetails.forEach(element => {
                    if (element.activityName == '' || element.activityName == null || element.activityName == undefined) {
                      element.activityName = 'N/A'
                    }


                  });
                  this.liabiltyCovers = this.quoteEandOOptions.liabiltyCovers.filter(x => x.isSelected)
                  this.liabiltyCovers.forEach(element => {
                    if (element.optionSelected == '' || element.optionSelected == null || element.optionSelected == undefined) {
                      element.optionSelected = 'N/A'
                    }

                    if (element.description == '' || element.description == null || element.description == undefined) {
                      element.description = 'N/A'
                    }
                  });
                  this.deductiblesInfo = this.quoteEandOOptions.liabiltyDeductibles
                  //RevenueDetails revenueDetails
                  if (!this.quoteEandOOptions.revenueDetails) {
                    this.quoteEandOOptions.revenueDetails = new RevenueDetails();
                    this.quoteEandOOptions.revenueDetails.revenueColumn = this.cols;
                    this.rows.forEach(element => {
                      var data = new RevenueRows();
                      data.label = element.label;
                      data.name = element.value;
                      data.firstYear = 0;
                      data.secondYear = 0;
                      data.thirdYear = 0;
                      data.estimatedForNextYear = 0;
                      this.quoteEandOOptions.revenueDetails.revenueRows.push(data);
                    });
                  }
                  else {

                  }
                  this.majorExclusions = this.quoteEandOOptions.majorExclusions.filter(exclusions => exclusions.isSelected === true);
                  this.subjectivities = this.quoteEandOOptions.subjectivity.filter(subjectivity => subjectivity.isSelected === true);
                }
              }
            },
            error: error => {
              console.log(error);
            }
          });
        }
      }
    })
    this.optionCovers = LIABILITY_COVERS_OPTIONS;
    this.updateYears()

  }

  ngOnInit(): void {
    // this.currentQuote = this.quoteService.currentQuote$.subscribe({
    //   next: (quote) => {
    //     this.quote = quote
    this.quoteId = this.quote._id;
    if (!this.showExclusionAndSubjectivity && !this.quote.insurerProcessedQuotes) {
      if (this.quote.quoteState == 'QCR From Underwritter' || this.quote.quoteState == 'Under Writter Review') {
        this.showExclusionAndSubjectivity = true;
      }
    }
    //this.quoteEandOOptions = this.quote?.liabilityEandOTemplateDataId;  
    let templateId =  this.quote?.liabilityEandOTemplateDataId["_id"] ||  this.quote?.liabilityEandOTemplateDataId   
    this.liabilityEandOTemplateService.getTemplateById(templateId, this.quoteId).subscribe({
      next: quoteLiablitity => {
        console.log("E&O Get Successfully");
        this.quoteEandOOptions = quoteLiablitity.data.entity;
        this.subsidaryDetails = this.quoteEandOOptions.subsidaryDetails;
        this.fileDetails = this.quoteEandOOptions.basicDetailsAttchments;
        this.subsidaryDetails.forEach(element => {
          if (element.activityName == '' || element.activityName == null || element.activityName == undefined) {
            element.activityName = 'N/A'
          }


        });
        this.liabiltyCovers = this.quoteEandOOptions.liabiltyCovers.filter(x => x.isSelected)
        this.liabiltyCovers.forEach(element => {
          if (element.optionSelected == '' || element.optionSelected == null || element.optionSelected == undefined) {
            element.optionSelected = 'N/A'
          }

          if (element.description == '' || element.description == null || element.description == undefined) {
            element.description = 'N/A'
          }
        });
        this.deductiblesInfo = this.quoteEandOOptions.liabiltyDeductibles
        //RevenueDetails revenueDetails
        if (!this.quoteEandOOptions.revenueDetails) {
          this.quoteEandOOptions.revenueDetails = new RevenueDetails();
          this.quoteEandOOptions.revenueDetails.revenueColumn = this.cols;
          this.rows.forEach(element => {
            var data = new RevenueRows();
            data.label = element.label;
            data.name = element.value;
            data.firstYear = 0;
            data.secondYear = 0;
            data.thirdYear = 0;
            data.estimatedForNextYear = 0;
            this.quoteEandOOptions.revenueDetails.revenueRows.push(data);
          });
        }
        else {

        }
        this.majorExclusions = this.quoteEandOOptions.majorExclusions.filter(exclusions => exclusions.isSelected === true);
        this.subjectivities = this.quoteEandOOptions.subjectivity.filter(subjectivity => subjectivity.isSelected === true);
      },
      error: error => {
        console.log(error);
      }

    });
    let lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 5,
      sortField: '_id',
      sortOrder: -1,
      filters: {
        // @ts-ignore
        quoteId: [
          {
            value: this.quote._id,
            matchMode: "equals",
            operator: "and"
          }
        ]
      },
      globalFilter: null,
      multiSortMeta: null
    };

    if (this.quote.quoteState == 'QCR From Underwritter') {
      this.claimExperienceService.getClaimsExperienceOfInsurer(lazyLoadEvent).subscribe({
        next: (dto: IManyResponseDto<IClaimExperience>) => {
          this.claimExperiences = dto.data.entities
        }
      })
    }
    else {
      this.claimExperienceService.getMany(lazyLoadEvent).subscribe({
        next: (dto: IManyResponseDto<IClaimExperience>) => {
          this.claimExperiences = dto.data.entities
        }
      })
    }
    //   }
    // })
  }

  updateYears() {
    const currentYear = new Date().getFullYear();
    this.cols[3].label = currentYear.toString();
    this.cols[2].label = (currentYear - 1).toString();
    this.cols[1].label = (currentYear - 2).toString();
  }
  getTotalfirstYear() {
    const firstYear = this.quoteEandOOptions.revenueDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.firstYear;
    }, 0);
    return firstYear;
  }

  getTotalsecondYear() {
    const secondYear = this.quoteEandOOptions.revenueDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.secondYear;
    }, 0);
    return secondYear;
  }

  getTotalthirdYear() {
    const thirdYear = this.quoteEandOOptions.revenueDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.thirdYear;
    }, 0);
    return thirdYear;
  }
  getTotalestimatedForNextYear() {
    const estimatedForNextYear = this.quoteEandOOptions.revenueDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.estimatedForNextYear;
      ;
    }, 0);
    return estimatedForNextYear;
  }


  // loadEandOPolicyTypes() {
  //   this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.EANDO_TYPE_OF_POLICY).subscribe({
  //     next: records => {

  //       this.OptionEandOPoilcyTypes = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
  //       this.policyType = this.OptionEandOPoilcyTypes.find(s => s.value == this.quote.policyTypeIdEandO['_id']).label;
  //     },
  //     error: e => {
  //       console.log(e);
  //     }
  //   });
  // }

}
