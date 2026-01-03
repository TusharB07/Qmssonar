import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AllowedQuoteStates, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { ConfigureDiscountDialogeService } from '../configure-discount-dialoge/configure-discount-dialoge.service';
import { ProductPartnerIcConfigurationService } from 'src/app/features/admin/product-partner-ic-configuration/product-partner-ic-configuration.service';
import { AccountService } from 'src/app/features/account/account.service';
import { Subscription } from 'rxjs';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { ActivatedRoute } from '@angular/router';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { IQuoteDiscount } from '../configure-discount-dialoge/configure-discount-dialoge.model';

@Component({
  selector: 'app-moodys-review-discount-dialoge',
  templateUrl: './moodys-review-discount-dialoge.component.html',
  styleUrls: ['./moodys-review-discount-dialoge.component.scss']
})
export class MoodysReviewDiscountDialogeComponent implements OnInit {
  @Input() quote: IQuoteSlip;
  private currentQuote: Subscription;
  earthquakeRiskScore;
  earthquakeLossCosts;
  FloodRiskScore;
  FloodLossCosts;
  AllowedProductTemplate = AllowedProductTemplate

  ExpectedDamageRatio = []
  quoteId:any
  id: string;

  configureDiscountForm: FormGroup;
  discountId: string;
  discountPercentage = 0;
  discountFrom = -100;
  discountTo = 100;
  moodys : boolean = true

  totalIndictiveQuoteAmt = 0;

  afterDiscountAmount = 0
  discountCover;
  
  permissions: PermissionType[] = [];
  adddress: any;
  quotedetails: IQuoteSlip;
  constructor(
    private formBuilder: FormBuilder,
    // private quoteService: QuoteService,
    public ref: DynamicDialogRef,
    public quoteService: QuoteService,
    public config: DynamicDialogConfig,
    private configureDiscountDialogeService: ConfigureDiscountDialogeService,
    private bscCoverService: ProductPartnerIcConfigurationService,
    private accountService: AccountService,
    private activateRoute:ActivatedRoute
  ) { 
    this.quote = this.config.data.quote;
  }

  ngOnInit(): void {
    const parentParamMap = this.activateRoute.snapshot.params['quote_id'];
    this.quotedetails = this.quote
    this.quoteId = parentParamMap;
    this.adddress = this.quotedetails.locationBasedCovers.quoteLocationOccupancy.clientLocationId;
    console.log(this.quote);
    console.log(this.quoteId);
    this.ExpectedDamageRatio = []
    this.ExpectedDamageRatio = [
      {riskScore : '1', ratio : '0 - 0.5%'},
      {riskScore : '2', ratio : '0.5 - 1%'},
      {riskScore : '3', ratio : '1 - 5%'},
      {riskScore : '4', ratio : '5 - 10%'},
      {riskScore : '5', ratio : '10 - 15%'},
      {riskScore : '6', ratio : '15 - 20%'},
      {riskScore : '7', ratio : '20 - 30%'},
      {riskScore : '8', ratio : '30 - 40%'},
      {riskScore : '9', ratio : '40 - 50%'},
      {riskScore : '10', ratio : '>50%'},
    ]
    this.getMoodysAPI()




    this.createForm();
    let disRules = this.quote.productPartnerIcConfigurations[0].productPartnerIcConfigurationId.discountRules;
    // this.discountFrom = disRules.discountFrom as number;
    // this.discountTo = disRules.discountTo as number;
    
    this.configureDiscountDialogeService.getQuoteDiscounts({ quoteId: this.quote._id }).subscribe({
        next: (dto: IOneResponseDto<any>) => {
            if (dto.data?.entity?._id) {
                this.discountId = dto.data?.entity?._id
            }
            this.createForm(dto.data.entity);
            console.log(dto.data.entity)
        },
        error: e => {
            console.log(e);
        }
    });

    
    this.accountService.currentUser$.subscribe({
    next: user => {
      let role: IRole = user?.roleId as IRole;
      if (role?.name === AllowedRoles.INSURER_RM || this.quote.quoteState == AllowedQuoteStates.REJECTED) {

        this.permissions = ['read'];
      } else {

        this.permissions = ['read', 'update'];
      }
    }
  })

    console.log(this.quote)



  }

  getMoodysAPI(){
    let address = {
      "countryCode": "IN",
      "countryScheme": "ISO2A",
      "countryRmsCode": "IN",
      "latitude": this.adddress['Latitude'],
      "longitude": this.adddress['Longitude'],
      "rmsGeoModelResolutionCode": 1,
      "postalCode": "400072",
      "admin1GeoId": 2345750
    }
    let characteristics = {
      "construction": "ATC1",
      "occupancy": "ATC1",
      "yearBuilt": 1973,
      "numOfStories": 3
    }
    let coverageValues = {
      "buildingValue": 640000,
      "contentsValue": 100000,
      "businessInterruptionValue": 10000
    }
    this.quoteService.getEarthquakeHazardIndia({location : {address : address}}).subscribe(res => {
      console.log("in_eq_hazard",res)
    })

    this.quoteService.getEarthquakeLossCostIndia({location : {address : address , characteristics : characteristics , coverageValues : coverageValues}}).subscribe(res => {
      console.log("Earthquake - in_eq_loss_cost",res)
      this.earthquakeLossCosts = res
      if(this.earthquakeLossCosts && this.earthquakeRiskScore && this.FloodLossCosts && this.FloodRiskScore){
        //   setTimeout(() => {
        //     (window).print();
        // },1000)
      }
    })

    this.quoteService.getEarthquakeRiskScoreIndia({location : {address : address , characteristics : characteristics}}).subscribe(res => {
      console.log("Earthquake - in_eq_risk_score",res)
      this.earthquakeRiskScore = res
      if(this.earthquakeLossCosts && this.earthquakeRiskScore && this.FloodLossCosts && this.FloodRiskScore){
        //   setTimeout(() => {
        //     (window).print();
        // },1000)
      }
    })

    this.quoteService.getFloodLossCostIndia({location : {address : address , characteristics : characteristics , coverageValues : coverageValues}}).subscribe(res => {
      console.log("in_fl_loss_cost",res)
      this.FloodLossCosts = res
      if(this.earthquakeLossCosts && this.earthquakeRiskScore && this.FloodLossCosts && this.FloodRiskScore){
        //   setTimeout(() => {
        //     (window).print();
        // },1000)
      }
    })

    this.quoteService.getFloodRiskScoreIndia({location : {address : address , characteristics : characteristics}}).subscribe(res => {
      console.log("in_fl_risk_score",res)
      this.FloodRiskScore = res
      if(this.earthquakeLossCosts && this.earthquakeRiskScore && this.FloodLossCosts && this.FloodRiskScore){
        //   setTimeout(() => {
        //     (window).print();
        // },1000)
      }
    })
  }


  createForm(item?: IQuoteDiscount) {
    console.log(item)

    this.discountPercentage = item?.discountPercentage ?? 0
    this.totalIndictiveQuoteAmt = item?.totalIndictiveQuoteAmt;
    // this.discountFrom = this.quote.otcType == AllowedOtcTypes.NONOTC ? 0 :(item?.discountFrom ?? 20)
    // this.discountTo = this.quote.otcType == AllowedOtcTypes.NONOTC ? 100 : (item?.discountTo ?? 50)
    // this.discountFrom = item?.discountFrom;
    // this.discountTo = item?.discountTo;

    this.configureDiscountForm = this.formBuilder.group({
        discountedAmount: [item?.discountedAmount ?? 0, []],
        totalIndictiveQuoteAmt: [item?.totalIndictiveQuoteAmt ?? 0, []],
        afterDiscountAmount: [item?.afterDiscountAmount ?? 0, []],
        moodys:[true]
    })
}


discountPercentageUpdated($value) {
    this.configureDiscountForm.controls['discountedAmount'].setValue((this.configureDiscountForm.controls['totalIndictiveQuoteAmt'].value * $value) / 100)
    this.configureDiscountForm.controls['afterDiscountAmount'].setValue((this.configureDiscountForm.controls['totalIndictiveQuoteAmt'].value) - (this.configureDiscountForm.controls['discountedAmount'].value))
}

submitConfigueDiscount() {
    if (this.configureDiscountForm?.valid) {
        if (this.discountId) {
            const payload = { ...this.configureDiscountForm.value };
            payload["discountPercentage"] = this.discountPercentage;
            payload["discountFrom"] = this.discountFrom;
            payload["discountTo"] = this.discountTo;
            payload["moodys"] = this.moodys;
            // payload["discountedAmount"] = `${payload["discountedAmount"]}`;
            payload['quoteId'] = this.config.data.quote._id;

            this.configureDiscountDialogeService.update(this.discountId, payload).subscribe({
                next: (response: IOneResponseDto<IQuoteDiscount>) => {
                    console.log(response.data.entity)
                    this.quoteService.refresh()
                    this.ref.close();
                }, error: error => {
                }
            });
        } else {
            const payload = { ...this.configureDiscountForm.value };
            payload["discountPercentage"] = this.discountPercentage;
            payload["discountFrom"] = this.discountFrom;
            payload["discountTo"] = this.discountTo;
            // payload["discountedAmount"] = `${payload["discountedAmount"]}`;
            payload['quoteId'] = this.config.data.quote._id;

            this.configureDiscountDialogeService.create(payload).subscribe({
                next: (response: IOneResponseDto<IQuoteDiscount>) => {
                    console.log(response.data.entity)
                    this.quoteService.refresh()
                    this.ref.close();
                },
                error: error => {
                    //   console.log(error);
                }
            });
        }
    }
}

removeDiscount() {
    this.configureDiscountDialogeService.delete(this.discountId).subscribe(data => {
        console.log(data)
        this.quoteService.refresh()
        this.ref.close()
    })
}

ngOnDestroy() {
}


}
