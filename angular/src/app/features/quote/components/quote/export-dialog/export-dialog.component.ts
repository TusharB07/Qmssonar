import { MessageService } from 'primeng/api';
import { ProductPartnerIcConfigurationService } from './../../../../admin/product-partner-ic-configuration/product-partner-ic-configuration.service';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IBulkImportResponseDto, ILov, IOneResponseDto } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { AddonCoverService } from 'src/app/features/admin/addon-cover/addon-cover.service';
import { BscCoverService } from 'src/app/features/admin/bsc-cover/bsc-cover.service';
import { EarthquakeRateService } from 'src/app/features/admin/earthquake-rate/earthquake-rate.service';
import { OccupancyRateService } from 'src/app/features/admin/occupancy-rate/occupancy-rate.service';
import { ProductService } from 'src/app/features/admin/product/product.service';
import { AllowedRoles } from 'src/app/features/admin/role/role.model';
import { TerrorismRateService } from 'src/app/features/admin/terrorism-rate/terrorism-rate.service';
import { RiskinspectionmasterService } from 'src/app/features/admin/risk-inspection-master/riskinspectionmaster.service';
import { TermsConditionsService } from 'src/app/features/admin/terms-conditions/terms-conditions.service';
import { SubOccupancyService } from 'src/app/features/admin/sub-occupancy/sub-occupancy.service';
import { BscCoverDescriptionService } from 'src/app/features/admin/bsc-cover-description/bsc-cover-description.service';
import { AddOnCoverOptionsService } from 'src/app/features/admin/add-ons-covers-ddl-options/add-ons-covers-ddl-options.service';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { BusinessTypeService } from 'src/app/features/admin/wc-business-type/wc-business-type.service';
import { SalarySlabsService } from 'src/app/features/admin/wc-salary-slabs/wc-salary-slabs.service';
import { WCDescriptionOfEmployeeService } from 'src/app/features/admin/wc-desc-of-employee/wc-desc-of-employee.service';
import { WCTypeOfEmployeeService } from 'src/app/features/admin/wc-type-of-employee/wc-type-of-employee.service';
import { WCRatesService } from 'src/app/features/admin/wc-rates-master/wc-rate-master.service';
import { WCCoverageTypeListComponent } from 'src/app/features/admin/wc-coverage-type/wc-coverage-type-list/wc-coverage-type-list.component';
import { WCCoverageTypeService } from 'src/app/features/admin/wc-coverage-type/wc-coverage-type.service';

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.scss']
})
export class ExportDialogComponent implements OnInit {

  optionsProducts: ILov[] = []

  AllowedRoles = AllowedRoles

  selectedProductId: string

  mappedProducts = []

  constructor(
    private productService: ProductService,
    private productPartnerIcConfigurationService: ProductPartnerIcConfigurationService,
    public config: DynamicDialogConfig,
    private appService: AppService,
    private occupancyRateService: OccupancyRateService,
    private terrorismRateService: TerrorismRateService,
    private earthquakeRateService: EarthquakeRateService,
    private addonCoverService: AddonCoverService,
    private bscCoverService: BscCoverService,
    public ref: DynamicDialogRef,
    private riskinspectionmasterService: RiskinspectionmasterService,
    private termsConditionsService: TermsConditionsService,
    private subOccupancyService: SubOccupancyService,
    private messageService: MessageService, private addOnOptionService: AddOnCoverOptionsService, private wcListOfValueMasterService: WCListOfValueMasterService,
    private wcBusinessTypeService: BusinessTypeService,
    private wcSalarySlabsService: SalarySlabsService,
    private wcDescriptionOfEmployeeService: WCDescriptionOfEmployeeService,
    private wcTypeOfEmployeeService: WCTypeOfEmployeeService,
    private wcRatesOfEmployee: WCRatesService,
    private wcCoverageTypes: WCCoverageTypeService

  ) { }

  ngOnInit(): void {
    this.getAllProducts()
  }

  getAllProducts() {
    this.productService.searchOptionsProducts().then(response => {
      //console.log(response);
      // this.optionsProducts = response;
    })
    this.productPartnerIcConfigurationService.getInsurerMappedAllProducts().subscribe(Icproducts => {
      //console.log(Icproducts)
      this.mappedProducts = Icproducts.data.entities
      this.mappedProducts.map(products => {
        let temp: any = {}
        //console.log(products.type, products._id)
        temp['label'] = products.type
        temp['value'] = products._id
        //console.log(temp)
        this.optionsProducts.push(temp)
        this.optionsProducts.sort((a, b) => a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);
        console.log(this.optionsProducts)
      })
    })
  }

  cancel() {
    this.ref.close()
  }

  selectProduct(event) {
    this.selectedProductId = event.value
  }

  showSucessMessage() {
    this.messageService.add({
      severity: "success",
      summary: "File Downloaded",
      life: 3000
    });
  }

  bulkImportGenerateSampleFilterForOccupancy(payload: any) {
    this.occupancyRateService.bulkImportGenerateSample(payload).subscribe({
      next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
        console.log(dto)
        if (dto.status == 'success') {
          // Download the sample file
          this.appService.downloadFileFromUrl(' Sample Sheet', dto.data.entity.downloadablePath)
          this.ref.close()
          this.showSucessMessage()
        }
      }
    })
  }

  bulkImportGenerateSampleFilterForTerrorism(payload: any) {
    this.terrorismRateService.bulkImportGenerateSample(payload).subscribe({
      next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
        console.log(dto)
        if (dto.status == 'success') {
          // Download the sample file
          this.appService.downloadFileFromUrl(' Sample Sheet', dto.data.entity.downloadablePath)
          this.ref.close()
          this.showSucessMessage()
        }
      }
    })
  }

  bulkImportGenerateSampleFilterForEarthquake(payload: any) {
    this.earthquakeRateService.bulkImportGenerateSample(payload).subscribe({
      next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
        console.log(dto)
        if (dto.status == 'success') {
          // Download the sample file
          this.appService.downloadFileFromUrl(' Sample Sheet', dto.data.entity.downloadablePath)
          this.ref.close()
          this.showSucessMessage()
        }
      }
    })
  }

  bulkImportGenerateSampleFilterForAddOnCover(payload: any) {
    this.addonCoverService.bulkImportGenerateSample(payload).subscribe({
      next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
        console.log(dto)
        if (dto.status == 'success') {
          // Download the sample file
          this.appService.downloadFileFromUrl(' Sample Sheet', dto.data.entity.downloadablePath)
          this.ref.close()
          this.showSucessMessage()
        }
      }
    })
  }

  bulkImportGenerateSampleFilterForBscCover(payload: any) {
    this.bscCoverService.bulkImportGenerateSample(payload).subscribe({
      next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
        console.log(dto)
        if (dto.status == 'success') {
          // Download the sample file
          this.appService.downloadFileFromUrl(' Sample Sheet', dto.data.entity.downloadablePath)
          this.ref.close()
          this.showSucessMessage()
        }
      }
    })
  }
  bulkImportGenerateSampleFilterForRiskInspection(payload: any) {
    this.riskinspectionmasterService.bulkImportGenerateSample(payload).subscribe({
      next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
        console.log(dto)
        if (dto.status == 'success') {
          // Download the sample file
          this.appService.downloadFileFromUrl(' Sample Sheet', dto.data.entity.downloadablePath)
          this.ref.close()
          this.showSucessMessage()
        }
      }
    })
  }
  bulkImportGenerateSampleFilterForTermsAndConditions(payload: any) {
    this.termsConditionsService.bulkImportGenerateSample(payload).subscribe({
      next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
        console.log(dto)
        if (dto.status == 'success') {
          // Download the sample file
          this.appService.downloadFileFromUrl(' Sample Sheet', dto.data.entity.downloadablePath)
          this.ref.close()
          this.showSucessMessage()
        }
      }
    })
  }

  bulkImportGenerateSampleFilterForSubOccupancyService(payload: any) {
    this.subOccupancyService.bulkImportGenerateSample(payload).subscribe({
      next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
        console.log(dto)
        if (dto.status == 'success') {
          // Download the sample file
          this.appService.downloadFileFromUrl(' Sample Sheet', dto.data.entity.downloadablePath)
          this.ref.close()
          this.showSucessMessage()
        }
      }
    })
  }


  //liability
  bulkImportGenerateSampleFilterForLiabilityAddOnCoverOptions(payload: any) {
    this.addOnOptionService.bulkImportGenerateSample(payload).subscribe({
      next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
        console.log(dto)
        if (dto.status == 'success') {
          // Download the sample file
          this.appService.downloadFileFromUrl(' Sample Sheet', dto.data.entity.downloadablePath)
          this.ref.close()
          this.showSucessMessage()
        }
      }
    })
  }

  bulkImportGenerateSampleFilterForLiabilityDropdowns(payload: any) {
    this.wcListOfValueMasterService.bulkImportGenerateSample(payload).subscribe({
      next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
        console.log(dto)
        if (dto.status == 'success') {
          // Download the sample file
          this.appService.downloadFileFromUrl(' Sample Sheet', dto.data.entity.downloadablePath)
          this.ref.close()
          this.showSucessMessage()
        }
      }
    })
  }


  bulkImportGenerateSampleFilterLiabilityWCBusinessType(payload: any) {
    this.wcBusinessTypeService.bulkImportGenerateSample(payload).subscribe({
      next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
        console.log(dto)
        if (dto.status == 'success') {
          // Download the sample file
          this.appService.downloadFileFromUrl(' Sample Sheet', dto.data.entity.downloadablePath)
          this.ref.close()
          this.showSucessMessage()
        }
      }
    })
  }



  bulkImportGenerateSampleFilterLiabilityWCBSalarySlab(payload: any) {
    this.wcSalarySlabsService.bulkImportGenerateSample(payload).subscribe({
      next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
        console.log(dto)
        if (dto.status == 'success') {
          // Download the sample file
          this.appService.downloadFileFromUrl(' Sample Sheet', dto.data.entity.downloadablePath)
          this.ref.close()
          this.showSucessMessage()
        }
      }
    })
  }


  bulkImportGenerateSampleFilterLiabilityWCDescriptionOfEmployee(payload: any) {
    this.wcDescriptionOfEmployeeService.bulkImportGenerateSample(payload).subscribe({
      next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
        console.log(dto)
        if (dto.status == 'success') {
          // Download the sample file
          this.appService.downloadFileFromUrl(' Sample Sheet', dto.data.entity.downloadablePath)
          this.ref.close()
          this.showSucessMessage()
        }
      }
    })
  }

  bulkImportGenerateSampleFilterLiabilityWCTypeOfEmployee(payload: any) {
    this.wcTypeOfEmployeeService.bulkImportGenerateSample(payload).subscribe({
      next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
        console.log(dto)
        if (dto.status == 'success') {
          // Download the sample file
          this.appService.downloadFileFromUrl(' Sample Sheet', dto.data.entity.downloadablePath)
          this.ref.close()
          this.showSucessMessage()
        }
      }
    })
  }

  bulkImportGenerateSampleFilterLiabilityWCRates(payload: any) {
    this.wcRatesOfEmployee.bulkImportGenerateSample(payload).subscribe({
      next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
        console.log(dto)
        if (dto.status == 'success') {
          // Download the sample file
          this.appService.downloadFileFromUrl(' Sample Sheet', dto.data.entity.downloadablePath)
          this.ref.close()
          this.showSucessMessage()
        }
      }
    })
  }

  bulkImportGenerateSampleFilterLiabilityWCCoverage(payload: any) {
    this.wcCoverageTypes.bulkImportGenerateSample(payload).subscribe({
      next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
        console.log(dto)
        if (dto.status == 'success') {
          // Download the sample file
          this.appService.downloadFileFromUrl(' Sample Sheet', dto.data.entity.downloadablePath)
          this.ref.close()
          this.showSucessMessage()
        }
      }
    })
  }


  bulkImportGenerateSample() {
    let payload = {}
    payload['productId'] = this.selectedProductId
    switch (this.config.data.event.rate) {
      case 'occupancy':
        this.bulkImportGenerateSampleFilterForOccupancy(payload)
        break;
      case 'terrorism':
        this.bulkImportGenerateSampleFilterForTerrorism(payload)
        break;
      case 'earthquake':
        this.bulkImportGenerateSampleFilterForEarthquake(payload)
        break;
      case 'add_on':
        this.bulkImportGenerateSampleFilterForAddOnCover(payload)
        break;
      case 'bsc_cover':
        this.bulkImportGenerateSampleFilterForBscCover(payload)
        break;
      case 'riskinspection':
        this.bulkImportGenerateSampleFilterForRiskInspection(payload)
        break;
      case 'termsAndConditions':
        this.bulkImportGenerateSampleFilterForTermsAndConditions(payload)
        break;
      case 'subOccupancy':
        this.bulkImportGenerateSampleFilterForSubOccupancyService(payload)
        break;
      case 'add_on_options':
        this.bulkImportGenerateSampleFilterForLiabilityAddOnCoverOptions(payload)
        break;
      case 'liability_dropdowns':
        this.bulkImportGenerateSampleFilterForLiabilityDropdowns(payload)
        break;
      case 'wc_businesstypes':
        return this.bulkImportGenerateSampleFilterLiabilityWCBusinessType(payload)
        break;
      case 'wc_SalarySlabs':
        return this.bulkImportGenerateSampleFilterLiabilityWCBSalarySlab(payload)
        break;
      case 'wc_DescriptionOfEmployee':
        return this.bulkImportGenerateSampleFilterLiabilityWCDescriptionOfEmployee(payload)
        break;
      case 'wc_TypeOfEmployee':
        return this.bulkImportGenerateSampleFilterLiabilityWCTypeOfEmployee(payload)
        break;
      case 'wc_rates':
        return this.bulkImportGenerateSampleFilterLiabilityWCRates(payload)
        break;
      case 'wc_coverage':
        return this.bulkImportGenerateSampleFilterLiabilityWCCoverage(payload)
        break;

    }
  }

}
