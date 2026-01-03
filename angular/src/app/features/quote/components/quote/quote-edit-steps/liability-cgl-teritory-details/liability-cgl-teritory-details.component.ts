import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ILov, IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { AccountService } from 'src/app/features/account/account.service';
import { LIABILITY_COVERS_OPTIONS } from 'src/app/features/admin/addon-cover/addon-cover.model';
import { IClaimExperience } from 'src/app/features/admin/claim-experience/claim-experience.model';
import { ClaimExperienceService } from 'src/app/features/admin/claim-experience/claim-experience.service';
import { WCAllowedListOfValuesMasters } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { AllowedOtcTypes } from 'src/app/features/admin/product-partner-ic-configuration/product-partner-ic-configuration.model';
import { liabilityCGLTemplateService } from 'src/app/features/admin/quote/quote.liabilityCGLTemplate.service';
import {  BasicDetailsCGLAttachments, ICGLTemplate, IQuoteSlip, SubsidiaryCGLDetails, liabiltyCGLAddOnCovers } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { BasicDetailsTabComponent } from '../../quote-requisition-tabs/liabilityproducttabs/basic-details-tab/basic-details-tab.component';
import { LiabilityCGLAddoncoversDialogComponent } from '../../add-on-covers-dialogs/liability-cgl-addoncovers-dialog/liability-cgl-addoncovers-dialog.component';
import { BasicDetailsCGLTabComponent } from '../../quote-requisition-tabs/liabilityCGLProductsTabs/basic-details-cgl-tab/basic-details-cgl-tab.component';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';


@Component({
  selector: 'app-liability-cgl-teritory-details',
  templateUrl: './liability-cgl-teritory-details.component.html',
  styleUrls: ['./liability-cgl-teritory-details.component.scss']
})
export class LiabilityCGLTeritoryDetailsComponent implements OnInit {
  quoteCGLOptions: any
  private currentQuote: Subscription;
  quote: IQuoteSlip;
  subsidaryDetails: SubsidiaryCGLDetails[] = [];
  liabiltyCovers: liabiltyCGLAddOnCovers[] = [];
  optionCovers: ILov[] = [];
  countryList: ILov[] = [];
  showEditOption = false;
  OptionTerritoryAndJurasdiction: ILov[] = []
  AllowedProductTemplate = AllowedProductTemplate;
  private currentSelectedTemplate: Subscription;

  constructor(private accountService: AccountService, private messageService: MessageService, private quoteService: QuoteService, private wclistofmasterservice: WCListOfValueMasterService, private liabilityCGLTemplateService: liabilityCGLTemplateService) {
    // * DO NOT TOUCH
    this.accountService.currentUser$.subscribe({
      next: user => {
        const role: IRole = user.roleId as IRole;
        if (AllowedRoles.INSURER_RM == role?.name) {
          this.showEditOption = false;
        }
        else {
          this.showEditOption = true;
        }
      }
    });
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote

      // if(this.showEditOption)
      //     {
      //   this.quoteCGLOptions = this.quote?.liabilityCGLTemplateDataId;
      //   this.subsidaryDetails = this.quoteCGLOptions.subsidaryDetails
      //   this.subsidaryDetails.forEach(element => {
      //     if (element.activityName == '' || element.activityName == null || element.activityName == undefined) {
      //       element.activityName = 'N/A'
      //     }


      //   });
      //   this.liabiltyCovers = this.quoteCGLOptions.liabiltyCovers
      //   this.liabiltyCovers.forEach(element => {
      //     if (element.optionSelected == '' || element.optionSelected == null || element.optionSelected == undefined) {
      //       element.optionSelected = 'N/A'
      //     }

      //     if (element.description == '' || element.description == null || element.description == undefined) {
      //       element.description = 'N/A'
      //     }
      //   });
      // }
      // else
      // {
      //   if (this.quote?.liabilityCGLTemplateDataId != null && this.quote?.liabilityCGLTemplateDataId["_id"] != undefined) {
      //     this.liabilityCGLTemplateService.get(this.quote?.liabilityCGLTemplateDataId["_id"]).subscribe({
      //     next: quoteLiablitity => {
      //       this.quoteCGLOptions = quoteLiablitity.data.entity;
      //       this.subsidaryDetails = this.quoteCGLOptions.subsidaryDetails
      //       this.subsidaryDetails.forEach(element => {
      //         if (element.activityName == '' || element.activityName == null || element.activityName == undefined) {
      //           element.activityName = 'N/A'
      //         }   
    
      //       });
      //       this.liabiltyCovers = this.quoteCGLOptions.liabiltyCovers
      //       this.liabiltyCovers.forEach(element => {
      //         if (element.optionSelected == '' || element.optionSelected == null || element.optionSelected == undefined) {
      //           element.optionSelected = 'N/A'
      //         }
    
      //         if (element.description == '' || element.description == null || element.description == undefined) {
      //           element.description = 'N/A'
      //         }
      //       });
      //     },
      //     error: e => {
      //       console.log(e);
      //     }
      //   });
      // }
      //}
        this.searchOptionsCountries()
      }
    })
  
    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        this.quoteCGLOptions =template
        this.subsidaryDetails = this.quoteCGLOptions.subsidaryDetails
        this.subsidaryDetails.forEach(element => {
          if (element.activityName == '' || element.activityName == null || element.activityName == undefined) {
            element.activityName = 'N/A'
          }


        });
        this.liabiltyCovers = this.quoteCGLOptions.liabiltyCovers
        this.liabiltyCovers.forEach(element => {
          if (element.optionSelected == '' || element.optionSelected == null || element.optionSelected == undefined) {
            element.optionSelected = 'N/A'
          }

          if (element.description == '' || element.description == null || element.description == undefined) {
            element.description = 'N/A'
          }
        });
      }
    })


  }

  ngOnInit(): void {
    this.searchOptionsCountries();
    this.loadTerritoryAndJurasdiction()
  }

  loadTerritoryAndJurasdiction() {
    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.CGL_TERRITORY_AND_JURISDICTION).subscribe({
      next: records => {

        this.OptionTerritoryAndJurasdiction = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
      },
      error: e => {
        console.log(e);
      }
    });
  }


  handleBusinessActivityCheckboxChange(event: any, item: any, index: number) {
    if (item.isSelected && !item.countryId) {
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: `Missing Information`,
        detail: `Please select a location`
      });
      this.quoteCGLOptions.subsidaryDetails.splice(index, 1);
      let subDetails = new SubsidiaryCGLDetails()
      this.quoteCGLOptions.subsidaryDetails.push(subDetails)

    }
    else {
      if (!item.isSelected) {
        this.quoteCGLOptions.subsidaryDetails[index].activityName = ""
      }
    }
  }
  removeRow(index: any) {
    this.quoteCGLOptions.subsidaryDetails.splice(index, 1);
  }

  addSubsidary() {
    let subDetails = new SubsidiaryCGLDetails()
    this.quoteCGLOptions.subsidaryDetails.push(subDetails)
  }

  searchOptionsCountries() {
    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.CGL_SUBSIDIARY_LOCATION).subscribe({
      next: records => {
        if (records.data.entities.length > 0) {
          records.data.entities = records.data.entities.sort((a, b) => (a.lovKey < b.lovKey ? -1 : 1));
        }
        this.countryList = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
      },
      error: e => {
        console.log(e);
      }
    });

  }
  setCountryName(item: any) {
    item.countryName = this.countryList.filter(x => x.value == item.countryId)[0].label;
  }



  save() {
    this.liabilityCGLTemplateService.updateArray(this.quoteCGLOptions._id, this.quoteCGLOptions).subscribe({
      next: quote => {
        console.log("CGL Added Successfully");
        this.quoteService.refresh(() => {
        })
      },
      error: error => {
        console.log(error);
      }
    });
    this.quoteService.refresh(() => {
    })

  }
}
