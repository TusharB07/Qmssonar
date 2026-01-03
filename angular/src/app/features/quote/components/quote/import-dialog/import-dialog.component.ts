import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IBulkImportResponseDto, IOneResponseDto, PFileUploadGetterProps } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { AddonCoverService } from 'src/app/features/admin/addon-cover/addon-cover.service';
import { BscCoverService } from 'src/app/features/admin/bsc-cover/bsc-cover.service';
import { EarthquakeRateService } from 'src/app/features/admin/earthquake-rate/earthquake-rate.service';
import { OccupancyRateService } from 'src/app/features/admin/occupancy-rate/occupancy-rate.service';
import { RiskinspectionmasterService } from 'src/app/features/admin/risk-inspection-master/riskinspectionmaster.service';
import { AllowedRoles } from 'src/app/features/admin/role/role.model';
import { TermsConditionsService } from 'src/app/features/admin/terms-conditions/terms-conditions.service';
import { TerrorismRateService } from 'src/app/features/admin/terrorism-rate/terrorism-rate.service';
import { SubOccupancyService } from 'src/app/features/admin/sub-occupancy/sub-occupancy.service';
import { BscCoverDescriptionService } from 'src/app/features/admin/bsc-cover-description/bsc-cover-description.service';
import { MessageService } from 'primeng/api';
import { AddOnCoverOptionsService } from 'src/app/features/admin/add-ons-covers-ddl-options/add-ons-covers-ddl-options.service';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { BusinessTypeService } from 'src/app/features/admin/wc-business-type/wc-business-type.service';
import { SalarySlabsService } from 'src/app/features/admin/wc-salary-slabs/wc-salary-slabs.service';
import { WCDescriptionOfEmployeeService } from 'src/app/features/admin/wc-desc-of-employee/wc-desc-of-employee.service';
import { WCTypeOfEmployeeService } from 'src/app/features/admin/wc-type-of-employee/wc-type-of-employee.service';
import { WCRatesFileUploadService } from 'src/app/features/broker/quote-wc-ratesview-dialog/wc-ratesview-service';
import { WCRatesService } from 'src/app/features/admin/wc-rates-master/wc-rate-master.service';
import { WCCoverageTypeService } from 'src/app/features/admin/wc-coverage-type/wc-coverage-type.service';

@Component({

  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.scss']
})
export class ImportDialogComponent implements OnInit {


  AllowedRoles = AllowedRoles
  constructor(public config: DynamicDialogConfig,
    private appService: AppService,
    private occupancyRateService: OccupancyRateService,
    private terrorismRateService: TerrorismRateService,
    private earthquakeRateService: EarthquakeRateService,
    private addonCoverService: AddonCoverService,
    private bscCoverService: BscCoverService,
    private riskinspectionmasterService: RiskinspectionmasterService,
    private termsConditionsService: TermsConditionsService,
    private subOccupancyService: SubOccupancyService,
    public ref: DynamicDialogRef,
    private bscCoverDescription: BscCoverDescriptionService,
    private messageService:  MessageService,
    private wcListOfValueMasterService: WCListOfValueMasterService,
    private addOnOptionService: AddOnCoverOptionsService,
    private wcBusinessTypeService: BusinessTypeService,
    private wcSalarySlabsService: SalarySlabsService,
    private wcDescriptionOfEmployeeService: WCDescriptionOfEmployeeService,
    private wcTypeOfEmployeeService: WCTypeOfEmployeeService,
    private wcRatesOfEmployee: WCRatesService,
    private wcCoverageService: WCCoverageTypeService,
  ) { }

  ngOnInit(): void {
    console.log(this.config.data)
  }

  cancel() {
    this.ref.close()
  }
  getUploadPropsForOccupancy(): PFileUploadGetterProps {
    return this.occupancyRateService.getBulkImportProps((dto: IOneResponseDto<IBulkImportResponseDto>) => {
      console.log(dto)
      if (dto.status == 'success') {
        window.location.reload()
      } else {
        // this.messageService.add({
        //     severity: 'fail',
        //     summary: "Failed to Upload",
        //     detail: `${dto.data.entity?.errorMessage}`,
        // })
        alert(dto.data.entity?.errorMessage)
        if (dto.data.entity?.downloadablePath) {
          this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
        }
      }
    })
  }

  getUploadPropsForTerrorism(): PFileUploadGetterProps {
    return this.terrorismRateService.getBulkImportProps((dto: IOneResponseDto<IBulkImportResponseDto>) => {
      console.log(dto)
      if (dto.status == 'success') {
        window.location.reload()
      } else {
        // this.messageService.add({
        //     severity: 'fail',
        //     summary: "Failed to Upload",
        //     detail: `${dto.data.entity?.errorMessage}`,
        // })
        alert(dto.data.entity?.errorMessage)
        if (dto.data.entity?.downloadablePath) {
          this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
        }
      }
    })
  }

  getUploadPropsForEarthquake(): PFileUploadGetterProps {
    return this.earthquakeRateService.getBulkImportProps((dto: IOneResponseDto<IBulkImportResponseDto>) => {
      console.log(dto)
      if (dto.status == 'success') {
        window.location.reload()
      } else {
        // this.messageService.add({
        //     severity: 'fail',
        //     summary: "Failed to Upload",
        //     detail: `${dto.data.entity?.errorMessage}`,
        // })
        alert(dto.data.entity?.errorMessage)
        if (dto.data.entity?.downloadablePath) {
          this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
        }
      }
    })
  }

  getUploadPropsForaddOnCovers(): PFileUploadGetterProps {
    return this.addonCoverService.getBulkImportProps((dto: IOneResponseDto<IBulkImportResponseDto>) => {
      console.log(dto)
      if (dto.status == 'success') {
        window.location.reload()
      } else {
        // this.messageService.add({
        //     severity: 'fail',
        //     summary: "Failed to Upload",
        //     detail: `${dto.data.entity?.errorMessage}`,
        // })
        alert(dto.data.entity?.errorMessage)
        if (dto.data.entity?.downloadablePath) {
          this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
        }
      }
    })
  }

  getUploadPropsForBscCover(): PFileUploadGetterProps {
    return this.bscCoverService.getBulkImportProps((dto: IOneResponseDto<IBulkImportResponseDto>) => {
      console.log(dto)
      if (dto.status == 'success') {
        window.location.reload()
      } else {
        // this.messageService.add({
        //     severity: 'fail',
        //     summary: "Failed to Upload",
        //     detail: `${dto.data.entity?.errorMessage}`,
        // })
        alert(dto.data.entity?.errorMessage)
        if (dto.data.entity?.downloadablePath) {
          this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
        }
      }
    })
  }
  getUploadPropsForRiskInspection(): PFileUploadGetterProps {
    return this.riskinspectionmasterService.getBulkImportProps((dto: IOneResponseDto<IBulkImportResponseDto>) => {
      console.log(dto)
      if (dto.status == 'success') {
        window.location.reload()
      } else {
        // this.messageService.add({
        //     severity: 'fail',
        //     summary: "Failed to Upload",
        //     detail: `${dto.data.entity?.errorMessage}`,
        // })
        alert(dto.data.entity?.errorMessage)
        if (dto.data.entity?.downloadablePath) {
          this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
        }
      }
    })
  }
  getUploadPropsForSubOccupancy(): PFileUploadGetterProps {
    return this.subOccupancyService.getBulkImportProps((dto: IOneResponseDto<IBulkImportResponseDto>) => {
      console.log(dto)
      if (dto.status == 'success') {
        window.location.reload()
      } else {
        // this.messageService.add({
        //     severity: 'fail',
        //     summary: "Failed to Upload",
        //     detail: `${dto.data.entity?.errorMessage}`,
        // })
        alert(dto.data.entity?.errorMessage)
        if (dto.data.entity?.downloadablePath) {
          this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
        }
      }
    })
  }

  getUploadPropsForTermsAndConditions(): PFileUploadGetterProps {
    return this.termsConditionsService.getBulkImportProps((dto: IOneResponseDto<IBulkImportResponseDto>) => {
      console.log(dto)
      if (dto.status == 'success') {
        window.location.reload()
      } else {
        // this.messageService.add({
        //     severity: 'fail',
        //     summary: "Failed to Upload",
        //     detail: `${dto.data.entity?.errorMessage}`,
        // })
        alert(dto.data.entity?.errorMessage)
        if (dto.data.entity?.downloadablePath) {
          this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
        }
      }
    })
  }

  //liability

  getUploadPropsForLiabilityAddOnCoversOptions(): PFileUploadGetterProps {
    return this.addOnOptionService.getBulkImportProps((dto: IOneResponseDto<IBulkImportResponseDto>) => {
      console.log(dto)
      if (dto.status == 'success') {
        window.location.reload()
      } else {
        // this.messageService.add({
        //     severity: 'fail',
        //     summary: "Failed to Upload",
        //     detail: `${dto.data.entity?.errorMessage}`,
        // })
        alert(dto.data.entity?.errorMessage)
        if (dto.data.entity?.downloadablePath) {
          this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
        }
      }
    })
  }

  getUploadPropsForLiabilityDropdown(): PFileUploadGetterProps {
    return this.wcListOfValueMasterService.getBulkImportProps((dto: IOneResponseDto<IBulkImportResponseDto>) => {
      console.log(dto)
      if (dto.status == 'success') {
        window.location.reload()
      } else {
        // this.messageService.add({
        //     severity: 'fail',
        //     summary: "Failed to Upload",
        //     detail: `${dto.data.entity?.errorMessage}`,
        // })
        alert(dto.data.entity?.errorMessage)
        if (dto.data.entity?.downloadablePath) {
          this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
        }
      }
    })
  }

  getUploadPropsForLiabilityWCBusinessType(): PFileUploadGetterProps {
    return this.wcBusinessTypeService.getBulkImportProps((dto: IOneResponseDto<IBulkImportResponseDto>) => {
      console.log(dto)
      if (dto.status == 'success') {
        window.location.reload()
      } else {
        // this.messageService.add({
        //     severity: 'fail',
        //     summary: "Failed to Upload",
        //     detail: `${dto.data.entity?.errorMessage}`,
        // })
        alert(dto.data.entity?.errorMessage)
        if (dto.data.entity?.downloadablePath) {
          this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
        }
      }
    })
  }


  getUploadPropsForLiabilityWCDescriptionOfEmployee(): PFileUploadGetterProps {
    return this.wcDescriptionOfEmployeeService.getBulkImportProps((dto: IOneResponseDto<IBulkImportResponseDto>) => {
      console.log(dto)
      if (dto.status == 'success') {
        window.location.reload()
      } else {
        // this.messageService.add({
        //     severity: 'fail',
        //     summary: "Failed to Upload",
        //     detail: `${dto.data.entity?.errorMessage}`,
        // })
        alert(dto.data.entity?.errorMessage)
        if (dto.data.entity?.downloadablePath) {
          this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
        }
      }
    })
  }


  getUploadPropsForLiabilityWCBSalarySlab(): PFileUploadGetterProps {
    return this.wcSalarySlabsService.getBulkImportProps((dto: IOneResponseDto<IBulkImportResponseDto>) => {
      console.log(dto)
      if (dto.status == 'success') {
        window.location.reload()
      } else {
        // this.messageService.add({
        //     severity: 'fail',
        //     summary: "Failed to Upload",
        //     detail: `${dto.data.entity?.errorMessage}`,
        // })
        alert(dto.data.entity?.errorMessage)
        if (dto.data.entity?.downloadablePath) {
          this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
        }
      }
    })
  }
  getUploadPropsForLiabilityWCTypeOfEmployee(): PFileUploadGetterProps {
    return this.wcTypeOfEmployeeService.getBulkImportProps((dto: IOneResponseDto<IBulkImportResponseDto>) => {
      console.log(dto)
      if (dto.status == 'success') {
        window.location.reload()
      } else {
        // this.messageService.add({
        //     severity: 'fail',
        //     summary: "Failed to Upload",
        //     detail: `${dto.data.entity?.errorMessage}`,
        // })
        alert(dto.data.entity?.errorMessage)
        if (dto.data.entity?.downloadablePath) {
          this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
        }
      }
    })
  }

  getUploadPropsForLiabilityWCRates(){
    return this.wcRatesOfEmployee.getBulkImportProps((dto: IOneResponseDto<IBulkImportResponseDto>) => {
      console.log(dto)
      if (dto.status == 'success') {
        window.location.reload()
      } else {
        // this.messageService.add({
        //     severity: 'fail',
        //     summary: "Failed to Upload",
        //     detail: `${dto.data.entity?.errorMessage}`,
        // })
        alert(dto.data.entity?.errorMessage)
        if (dto.data.entity?.downloadablePath) {
          this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
        }
      }
    })
  }

  getUploadPropsForLiabilityWCCoverage(){
    return this.wcCoverageService.getBulkImportProps((dto: IOneResponseDto<IBulkImportResponseDto>) => {
      console.log(dto)
      if (dto.status == 'success') {
        window.location.reload()
      } else {
        // this.messageService.add({
        //     severity: 'fail',
        //     summary: "Failed to Upload",
        //     detail: `${dto.data.entity?.errorMessage}`,
        // })
        alert(dto.data.entity?.errorMessage)
        if (dto.data.entity?.downloadablePath) {
          this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
        }
      }
    })
  }


  get uploadProps(): any {
    switch (this.config.data.event.rate) {
      case 'occupancy':
        return this.getUploadPropsForOccupancy()
      case 'terrorism':
        return this.getUploadPropsForTerrorism()
      case 'earthquake':
        return this.getUploadPropsForEarthquake()
      case 'add_on':
        return this.getUploadPropsForaddOnCovers()
      case 'bsc_cover':
        return this.getUploadPropsForBscCover()
      case 'riskinspection':
        return this.getUploadPropsForRiskInspection()
      case 'termsAndConditions':
        return this.getUploadPropsForTermsAndConditions()
      case 'subOccupancy':
        return this.getUploadPropsForSubOccupancy()
      case 'add_on_options':
        return this.getUploadPropsForLiabilityAddOnCoversOptions()
      case 'liability_dropdowns':
        return this.getUploadPropsForLiabilityDropdown()
      case 'wc_businesstypes':
        return this.getUploadPropsForLiabilityWCBusinessType()
      case 'wc_SalarySlabs':
        return this.getUploadPropsForLiabilityWCBSalarySlab()
      case 'wc_DescriptionOfEmployee':
        return this.getUploadPropsForLiabilityWCDescriptionOfEmployee()
      case 'wc_TypeOfEmployee':
        return this.getUploadPropsForLiabilityWCTypeOfEmployee()
      case 'wc_rates':
        return this.getUploadPropsForLiabilityWCRates()
      case 'wc_coverage':
        return this.getUploadPropsForLiabilityWCCoverage()

    }
  }

}
