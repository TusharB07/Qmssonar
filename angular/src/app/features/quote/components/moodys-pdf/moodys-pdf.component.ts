import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';

@Component({
  selector: 'app-moodys-pdf',
  templateUrl: './moodys-pdf.component.html',
  styleUrls: ['./moodys-pdf.component.scss']
})
export class MoodysPDFComponent implements OnInit{
  @Input() quote: IQuoteSlip;
  private currentQuote: Subscription;
  earthquakeRiskScore;
  earthquakeLossCosts;
  FloodRiskScore;
  FloodLossCosts;
  AllowedProductTemplate = AllowedProductTemplate

  ExpectedDamageRatio = []
  quoteId:any
  quotedetails: IQuoteSlip;
  adddress: any
  locationdata: any;
  quoteIdmain: any;
  constructor(
    private quoteService : QuoteService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) { 
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
      }
    })
  }

  location = {
    address: '1 Mota Pir Rd, Bhuj, Gujarat 370001, India',
    latitude: 23.26195363241513,
    longitude: 69.6564658205606
  };


  apiInput = {
    latitude: '23.26195363241513',
    longitude: '69.6564658205606',
    countryCode: 'IN',
    occupancy: 'General Commercial',
    buildingTIV: 'INR 3,000,000',
    contentsTIV: 'INR 150,000',
    biTIV: 'INR 150,000'
  };

  ngOnInit(): void {
    const storedQuote = localStorage.getItem('quoteData'); 
    const parentParamMap = this.activateRoute.snapshot.params['quote_id'];
    this.quoteIdmain = parentParamMap;
    this.quotedetails = storedQuote ? JSON.parse(storedQuote) : null;
    this.quoteId = this.quotedetails ? this.quotedetails._id : null;
    this.adddress = this.quotedetails ? this.quotedetails.locationBasedCovers.quoteLocationOccupancy.clientLocationId : null;
    this.locationdata = this.quotedetails ? this.quotedetails.locationBasedCovers.quoteLocationOccupancy: null

    this.ExpectedDamageRatio = [
        { riskScore: '1', ratio: '0 - 0.5%' },
        { riskScore: '2', ratio: '0.5 - 1%' },
        { riskScore: '3', ratio: '1 - 5%' },
        { riskScore: '4', ratio: '5 - 10%' },
        { riskScore: '5', ratio: '10 - 15%' },
        { riskScore: '6', ratio: '15 - 20%' },
        { riskScore: '7', ratio: '20 - 30%' },
        { riskScore: '8', ratio: '30 - 40%' },
        { riskScore: '9', ratio: '40 - 50%' },
        { riskScore: '10', ratio: '>50%' },
    ];
    this.getMoodysAPI();
}

  getMoodysAPI(){

    let address = {
      "countryCode": "IN",
      "countryScheme": "ISO2A",
      "countryRmsCode": "IN",
      "latitude": this.adddress['Latitude'],
      "longitude": this.adddress['Longitude'],
      "rmsGeoModelResolutionCode": 1,
      "postalCode": this.locationdata.pincodeId['name'],
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

  navigateBack(){
  //  this.router.navigate([`backend/quotes/${this.quotedetails._id}/requisition`]);
   this.router.navigate([`/backend/quotes/${this.quoteIdmain}/requisition`], {
    queryParams: { quoteOptionId: this.quotedetails._id }
});
  }

  printpdf(){
    (window).print();
  }

}
