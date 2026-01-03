import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { EmployeeDemographic, IQuoteGmcTemplate, IQuoteSlip, QuoteGmcTemplate } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IGmcCoverageOptions, IQuoteGmcOptions, GmcCoverageOptions } from '../../gmc-coverages-options-dialog/gmc-coverage-options.model';
import { GmcOptionsService } from '../../gmc-coverages-options-dialog/gmc-options.service';
import { AppService } from 'src/app/app.service';
import { CoverageTypesService } from 'src/app/features/admin/coverageTypes/coveragetypes.service';
import { ICoverageType } from 'src/app/features/admin/coverageTypes/coveragetypes.model';
import { ThirdPartyAdministratorsService } from 'src/app/features/admin/thirdPartyAdministrators/thirdPartyAdministrators.service';
import { ToWords } from 'to-words';
import { AccountService } from 'src/app/features/account/account.service';
import { IUser } from 'src/app/features/admin/user/user.model';
import { AllowedRoles } from 'src/app/features/admin/role/role.model';

const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};
@Component({
  selector: 'app-sub-template-gmc',
  templateUrl: './sub-template-gmc.component.html',
  styleUrls: ['./sub-template-gmc.component.scss']
})
export class SubTemplateGmcComponent implements OnInit {
  //@Input() quote: IQuoteSlip;
  quote: IQuoteSlip;
  private currentQuote: Subscription;
  coverageOptions: IGmcCoverageOptions
  quoteGmcOptions: IQuoteGmcOptions;
  quoteGmcOptionsLst: IQuoteGmcTemplate[];
  quoteGmcOptionsModel: QuoteGmcTemplate = new QuoteGmcTemplate()
  coverageOptionsLst: GmcCoverageOptions[] = []
  quoteId: string = ""
  employeeDemographic: EmployeeDemographic = new EmployeeDemographic()
  private currentSelectedTemplate: Subscription;
  private currentSelectedOption: Subscription;
  coverageTypeLst: ICoverageType[];
  matternityNotCoveted: boolean = false
  selectedQuoteTemplate: IQuoteGmcTemplate;
  selectedQuoteTemplateAll: IQuoteGmcTemplate[];
  optionsQuoteOptions: ILov[] = [];

  dataTypeCss: string = ""
  tpaLists: ILov[];
  optionsSumInsured: ILov[] = [];
  toWords = new ToWords();
  isFlat: boolean = false;
  user: IUser;
  AllowedRoles = AllowedRoles
  isQuoteslipAllowedUser: boolean = false;
  role: any;
  selectedQuoteOption: any
  templateName: string = "GMC";

  private currentUser: Subscription;
  Object = Object // To Access Object Helper in HTML
  constructor(private accountService: AccountService, private tpaService: ThirdPartyAdministratorsService, private coverageTypesService: CoverageTypesService, private quoteService: QuoteService, private gmcOptionsService: GmcOptionsService, private appService: AppService) {
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        this.quoteId = this.quote._id;
        console.log(this.quote._id)
        console.log(this.quote.qcrApprovedRequested);
        this.templateName == this.quote?.productId['type']
      }
    })

    this.currentUser = this.accountService.currentUser$.subscribe({
      next: user => {
        this.user = user
        this.role = user.roleId['name'];
        if ([
          AllowedRoles.BROKER_CREATOR,
          AllowedRoles.BROKER_CREATOR_AND_APPROVER,
          AllowedRoles.BROKER_APPROVER,
          AllowedRoles.AGENT_CREATOR,
          AllowedRoles.AGENT_CREATOR_AND_APPROVER,
          AllowedRoles.BANCA_APPROVER,
          AllowedRoles.BANCA_CREATOR,
          AllowedRoles.BANCA_CREATOR_AND_APPROVER,
          AllowedRoles.SALES_CREATOR,
          AllowedRoles.SALES_APPROVER,
          AllowedRoles.SALES_CREATOR_AND_APPROVER,
          AllowedRoles.PLACEMENT_CREATOR,
          AllowedRoles.PLACEMENT_APPROVER,
          AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER,
        ].includes(this.role)) {
          this.isQuoteslipAllowedUser = true;
        }
        else {
          this.isQuoteslipAllowedUser = false;
        }

      }
    });
    //   this.accountService.currentUser$.subscribe({
    //     next: (user) => {
    //         // this.role = user.roleId as IRole
    //         this.user = user
    //     }
    // })
    this.currentSelectedOption = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        const temp = template;
        this.selectedQuoteOption = template._id;
        this.selectedQuoteTemplate = template;

        const sortOrder = [
          'Basic Details',
          'Family Composition',
          'Standard Coverages',
          'Maternity Benifits',
          'Enhanced Covers',
          'Other Restrictions',
          'Other Details'
        ];
        //console.log(this.quote._id)
        // Sorting the gmcTemplateData array by parentTabName according to the defined sortOrder
        this.selectedQuoteTemplate.gmcTemplateData = this.selectedQuoteTemplate.gmcTemplateData.sort((a, b) => {
          const aIndex = sortOrder.indexOf(a.parentTabName);
          const bIndex = sortOrder.indexOf(b.parentTabName);

          // If aIndex or bIndex is -1 (not found in sortOrder), push those to the end
          if (aIndex === -1) return 1; // If a is not found in sortOrder, push it to the end
          if (bIndex === -1) return -1; // If b is not found in sortOrder, push it to the end

          return aIndex - bIndex; // Sort in the order defined in sortOrder
        });
      }

    })
    this.currentSelectedTemplate = this.quoteService.currentQuoteOptions$.subscribe({
      next: (template) => {
        this.optionsQuoteOptions = template.map(entity => ({ label: entity.optionName, value: entity._id })); // Set the Id to this component
        this.selectedQuoteTemplateAll = template;

      }
    })
  }
  // handleQuoteOptionChange(event) {
  //   console.log('Selected option:', event.value);
  //   this.selectedQuoteTemplate = this.selectedQuoteTemplateAll.filter(x => x._id == event.value)        

  // }
  getTotalEmployees(gmcBasicDetails: any) {
    return gmcBasicDetails.gmcPolicyDetails.filter(x => x.name == "Employee Count")[0].inception

  }

  getTotalDependents(gmcBasicDetails: any) {
    return gmcBasicDetails.gmcPolicyDetails.filter(x => x.name == "Dependant Count")[0].inception


  }

  getTotalLives(gmcBasicDetails: any) {

    return gmcBasicDetails.gmcPolicyDetails.filter(x => x.name == "Total Lives")[0].inception

    return 0
  }


  ngOnInit(): void {
    console.log("--------------------------------------------")
    console.log(this.quote._id)
    console.log(this.selectedQuoteOption)

    if (this.selectedQuoteTemplate == undefined) {
      this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
        next: (dtoOption: IOneResponseDto<any>) => {

          this.loadOptionsData(dtoOption.data.entity) //.map(entity => ({ label: entity.if(), value: entity._id })))

          if (dtoOption.data.entity.some(x => x.isQuoteOptionPlaced)) {
            let placedquote = dtoOption.data.entity.filter(x => x.isQuoteOptionPlaced)[0]
            this.loadSelectedOption(placedquote)
          }
          else {
            this.loadSelectedOption(dtoOption.data.entity[0])
            this.selectedQuoteOption = dtoOption.data.entity[0];
            this.selectedQuoteTemplate = dtoOption.data.entity[0];

            const sortOrder = [
              'Basic Details',
              'Family Composition',
              'Standard Coverages',
              'Maternity Benifits',
              'Enhanced Covers',
              'Other Restrictions',
              'Other Details'
            ];
            //console.log(this.quote._id)
            // Sorting the gmcTemplateData array by parentTabName according to the defined sortOrder
            this.selectedQuoteTemplate.gmcTemplateData = this.selectedQuoteTemplate.gmcTemplateData.sort((a, b) => {
              const aIndex = sortOrder.indexOf(a.parentTabName);
              const bIndex = sortOrder.indexOf(b.parentTabName);

              // If aIndex or bIndex is -1 (not found in sortOrder), push those to the end
              if (aIndex === -1) return 1; // If a is not found in sortOrder, push it to the end
              if (bIndex === -1) return -1; // If b is not found in sortOrder, push it to the end

              return aIndex - bIndex; // Sort in the order defined in sortOrder
            });

          }
          // this.selectedQuoteTemplate = dtoOption.data.entity[0])
          //Load data    
        },
        error: e => {
          console.log(e);
        }
      });

    }
    // this.coverageTypesService.getMany(DEFAULT_RECORD_FILTER).subscribe({
    //   next: records => {
    //     this.coverageTypeLst = records.data.entities;
    //     this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
    //       next: (dtoOption: IOneResponseDto<any>) => {

    //         this.loadOptionsData(dtoOption.data.entity) //.map(entity => ({ label: entity.if(), value: entity._id })))

    //         if(dtoOption.data.entity.some(x=>x.isQuoteOptionPlaced)){
    //           let placedquote = dtoOption.data.entity.filter(x=>x.isQuoteOptionPlaced)[0]
    //           this.loadSelectedOption(placedquote)
    //         }
    //         else{
    //           this.loadSelectedOption(dtoOption.data.entity[0])

    //         }
    //         // this.selectedQuoteTemplate = dtoOption.data.entity[0])
    //         //Load data    
    //       },
    //       error: e => {
    //         console.log(e);
    //       }
    //     });
    //   },
    //   error: e => {
    //     console.log(e);
    //   }
    // });
    // this.quoteService.get(`${this.quote._id}`, { allCovers: true, qcr: true }).subscribe({
    //   next: (dto: IOneResponseDto<IQuoteSlip>) => {
    //     console.log(dto.data.entity)
    //     //this.quoteService.setQuote(dto.data.entity)


    //   },
    //   error: e => {
    //     console.log(e);
    //   }
    // });

    // this.getTpas();
  }
  showOption(option: IQuoteGmcTemplate) {
    // alert(option.isQuoteOptionPlaced)
    if (option.isQuoteOptionPlaced && this.quote.quoteState == 'QCR From Underwritter') {
      return true
    }
    else {

      if ((option.isAccepted == '' || option.isAccepted == 'Accept') && this.quote.quoteState != 'QCR From Underwritter') {
        return true;
      }
      else {
        return false;
      }

    }

  }
  showTabs(parentName, j) {
    if (parentName == 'Claim Analytics') {
      if (this.quote.quoteType != 'new') {
        return true;
      }
      return false;
    }
    else if (parentName == 'Final Rater') {
      if (this.quote.quoteType != 'new' && j == 0) {
        return true;
      }
      return false;
    }
    else if (this.quote.productId['type'].toLowerCase() == 'group health policy top up') {
      return true;
      // if (parentName == 'Maternity Benifits' || ) {
      //   return true;
      // }
      // else {
      //   return false
      // }

    }
    else { return true; }
  }


  // getTpas() {
  //   this.tpaService.getManyAsLovs(event).subscribe({
  //       next: data => {
  //           this.tpaLists = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
  //       },
  //       error: e => { }
  //   });
  //}
  loadOptionsData(quoteOption: IQuoteGmcTemplate[]) {
    this.quoteService.setQuoteOptions(quoteOption)
  }
  loadSelectedOption(quoteOption: IQuoteGmcTemplate) {
    this.quoteService.setSelectedOptions(quoteOption)
  }
  getAnswer(coveritemQuetions, subTabName, planType) {
    //console.log(coveritemQuetions)
    let text = ""
    if (coveritemQuetions.inputControl == 'dropdown') {

      if (coveritemQuetions.question.trim() == "Maternity Limits Normal Delivery") {
        let ans = coveritemQuetions.answer.filter(x => x._id == coveritemQuetions.selectedAnswer)[0]
        if (ans != undefined) {
          console.log();
        }
      }

      if (coveritemQuetions.question.trim() == "Maternity Covers") {
        let ans = coveritemQuetions.answer.filter(x => x._id == coveritemQuetions.selectedAnswer)[0]
        if (ans != undefined) {
          if (ans.ansDataType != undefined) {
            if (ans.ansDataType == "Number") {
              this.dataTypeCss = "numbercss"
            } else {
              this.dataTypeCss = ""
            }
          }

          if (ans.answer == "Not Covered") {
            this.matternityNotCoveted = true;
          }
          else {
            this.matternityNotCoveted = false;
          }
        }
        else {
          return 'Not Selected'
        }
        if (ans.answer.trim() == 'Flat') {
          this.isFlat = true
        }
        else {
          this.isFlat == false
        }
        return ans.answer == '' ? '--' : ans.answer
      }
      else {
        if (subTabName == "Basics Covers") {
          if (this.matternityNotCoveted) {
            return '-'
          }
          else {
            let ans = coveritemQuetions.answer.filter(x => x._id == coveritemQuetions.selectedAnswer)[0]
            if (ans != undefined) {
              if (coveritemQuetions.question == 'Sum Insured Basis') {
                if (planType != 'Floater') {
                  return "--"
                }
              }
              if (ans.ansDataType != undefined) {
                if (ans.ansDataType == "Number") {
                  this.dataTypeCss = "numbercss"
                } else {
                  this.dataTypeCss = ""
                }
              }
              if (ans.answer.trim() == 'Flat') {
                this.isFlat = true
              }
              else {
                this.isFlat == false
              }
              return ans.answer == '' ? '--' : ans.answer
            }
            else {
              return 'Not Selected'
            }

          }
        }
        else {
          let ans = coveritemQuetions.answer.filter(x => x._id == coveritemQuetions.selectedAnswer)[0]
          if (ans != undefined) {
            if (coveritemQuetions.question == 'Sum Insured Basis') {
              if (planType != 'Floater') {
                return "--"
              }
            }
            if (ans.ansDataType != undefined) {
              if (ans.ansDataType == "Number") {
                this.dataTypeCss = "numbercss"
              } else {
                this.dataTypeCss = ""
              }
            }
            if (ans.answer.trim() == 'Flat') {
              this.isFlat = true
            }
            else {
              this.isFlat == false
            }
            return ans.answer == '' ? '--' : ans.answer
          }
          else {
            return 'Not Selected'
          }
        }

      }




    }
    else if (coveritemQuetions.inputControl == 'multiselectdropdown') {
      if (coveritemQuetions.selectedAnswer != 0) {

        if (Array.isArray(coveritemQuetions.selectedAnswer)) {
          const answersString = coveritemQuetions.selectedAnswer
            .map((item) => item.answer) // Extract `answer` property
            .filter((answer) => answer) // Remove undefined or empty values
            .join(",\n\n"); // Join with commas
          console.log("selectedAnswer is an array");
          return answersString;
        } else {
          console.log("selectedAnswer is not an array");
          return "-"
        }


      }
      else {
        return "-"
      }



    }
    else if (coveritemQuetions.inputControl == 'radiobutton') {
      if (coveritemQuetions.selectedAnswer == 1) {
        let ans = coveritemQuetions.answer.filter(x => x._id == coveritemQuetions.selectedAnswer)[0]
        if (ans != undefined) {
          return coveritemQuetions.selectedAnswer
        }
      }
      else {
        return coveritemQuetions.selectedAnswer
      }
    }
    else if (coveritemQuetions.inputControl == 'checkbox') {
      if (coveritemQuetions.selectedAnswer) {
        let ans = coveritemQuetions.answer[0].answer
        return ans
      }
      else {
        return "Not Covered"
      }
    }
    else {
      return coveritemQuetions.selectedAnswer == '' ? '--' : coveritemQuetions.selectedAnswer
    }
  }
  ConvertStringToNumber(input: any) {

    if (input != null && input != undefined) {
      if (input.label == null || input.label == undefined) {
        return 0;
      }
    }
    else {
      return 0;
    }

    if (input.label.trim().length == 0) {
      return 0;
    }
    let siamt = input.label.replace(/\D/g, '');
    return Number(siamt);
  }

  convertToWords(si: number) {
    let result = this.toWords.convert((si) ?? 0, {
      currency: true,
      ignoreZeroCurrency: true
    })
    return result;
  }
  getCoverageTypeText(option, coverageTypeLst) {
    if (option.coverageTypeId != "") {
      return coverageTypeLst.filter(x => x._id == option.coverageTypeId)[0].coverageType
    }
    return ''
  }

  downloadEmployeeDemographyExcel() {

    this.quoteService.downloadQuoteEmployeeDemographyExcel(this.quote?._id, this.selectedQuoteTemplate[0].fileUploadType).subscribe({
      next: (response: any) => this.appService.downloadSampleExcel(response),
      error: e => {
        console.log(e)
      }
    })
  }
  getOptions() {
    this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
      next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
        this.quoteGmcOptionsLst = dto.data.entity.filter(x => x.version == this.quote.qcrVersion);
        for (let element of this.quoteGmcOptionsLst) {
          const dd = element.employeeDemographic
          this.employeeDemographic = dd;
          break;
        }
      },
      error: e => {
        console.log(e);
      }
    });
  }

}
