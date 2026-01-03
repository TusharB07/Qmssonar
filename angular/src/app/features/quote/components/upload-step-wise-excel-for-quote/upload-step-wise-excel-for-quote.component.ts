import { Component, Input, OnInit } from '@angular/core';
import { LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { StepsModule } from 'primeng/steps';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IBscBurglaryHousebreakingCover } from 'src/app/features/admin/bsc-burglary-and-housebreaking/bsc-burglary-and-housebreaking.model';
import { environment } from 'src/environments/environment';
import { BscBurglaryAndHousebreakingService } from 'src/app/features/admin/bsc-burglary-and-housebreaking/bsc-burglary-and-housebreaking.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IBulkImportResponseDto, ILov, IManyResponseDto, IOneResponseDto, PFileUploadGetterProps } from 'src/app/app.model';
import { HttpHeaders } from '@angular/common/http';
import { AccountService } from 'src/app/features/account/account.service';
import { ClientLocationService } from 'src/app/features/admin/client-location/client-location.service';
import { AppService } from 'src/app/app.service';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';


@Component({
    selector: 'app-upload-step-wise-excel-for-quote',
    templateUrl: './upload-step-wise-excel-for-quote.component.html',
    styleUrls: ['./upload-step-wise-excel-for-quote.component.scss']
})
export class UploadStepWiseExcelForQuoteComponent implements OnInit {

    // activeTab: "uploadLocationDetails" | "uploadLocationOccupancy" | "uploadBscCover" = "uploadLocationDetails"
    activeTab: "uploadLocationDetails" | "uploadLocationOccupancy" = "uploadLocationDetails"

    quote: IQuoteSlip;
    quoteOptionId: IQuoteOption;

    uploadQuoteLocationOccupancyForm: FormGroup;
    uploadClientLocationForm: FormGroup;


    uploadHttpHeaders: HttpHeaders;


    constructor(
        public config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
        private clientLocationService: ClientLocationService,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private appService: AppService,
        private accountService: AccountService,
        private quoteService: QuoteService,
        private formBuilder: FormBuilder,
        private quoteOptionService: QuoteOptionService,

        private messageService: MessageService,


    ) {
        // this.config.header = 'Upload Location Details'

        this.quote = this.config.data.quote
        this.quoteOptionId = this.config.data.quoteOption

        this.quoteOptionId = this.config.data.quoteOption

        this.activeTab = this.config.data.activeTab ?? "uploadLocationDetails"

        this.uploadHttpHeaders = this.accountService.bearerTokenHeader();

    }


    // Version 2

    get clientLocationsBulkImportProps(): PFileUploadGetterProps {
        return this.clientLocationService.getBulkImportProps(this.quote?.clientId['_id'], (dto: IOneResponseDto<IBulkImportResponseDto>) => {
            console.log(dto)

            if (dto.status == 'success') {
                // Download the sample file
                // this.appService.downloadFileFromUrl('Client Location Sample Sheet', dto.data.entity.downloadablePath)
                // alert('success')
                this.activeTab =  "uploadLocationOccupancy"
                this.config.header = 'Upload Risk Occupancy'

                this.quoteOptionService.refreshQuoteOption();

            } else {
                // this.messageService.add({
                //     severity: 'fail',
                //     summary: "Failed to Upload",
                //     detail: `${dto.data.entity?.errorMessage}`,
                // })
                alert(dto.data.entity?.errorMessage)
                if (dto.data.entity.downloadablePath) {
                    this.appService.downloadFileFromUrl('Client Location Sample Sheet', dto.data.entity.downloadablePath)

                }
            }
        })
    }

    clientLocationsBulkImportGenerateSample() {
        this.clientLocationService.bulkImportGenerateSample(this.quote.clientId['_id']).subscribe({
            next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
                console.log(dto)
                if (dto.status == 'success') {
                    // Download the sample file
                    this.appService.downloadFileFromUrl('Client Location Sample Sheet', dto.data.entity.downloadablePath)

                }
            }
        })
    }

    get quoteLocationOccupancyBulkImportProps(): PFileUploadGetterProps {
        return this.quoteLocationOccupancyService.getBulkImportProps(this.quote['_id'], {quoteOptionId: this.quoteOptionId}, (dto: IOneResponseDto<IBulkImportResponseDto>) => {
            console.log(dto)
            if (dto.status == 'success') {
                console.log("Before Refresh")
                console.log(this.quote)
                // this.quoteService.setQuote(this.quote)
                // this.quoteService.refresh();
                this.ref.close();
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

    quoteRiskLocationsBulkImportGenerateSample() {
        this.quoteLocationOccupancyService.bulkImportGenerateSample(this.quote['_id']).subscribe({
            next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
                console.log(dto)
                if (dto.status == 'success') {
                    // Download the sample file
                    this.appService.downloadFileFromUrl(' Sample Sheet', dto.data.entity.downloadablePath)

                }
            }
        })
    }




    ngOnInit(): void {
        this.uploadQuoteLocationOccupancyForm = this.formBuilder.group({
            quote_location_occupancy: [null, []],
            fileSource: [null, []]
        });
        this.uploadClientLocationForm = this.formBuilder.group({
            client_locations: [null, []],
            fileSource: [null, []]
        });
    }

    uploadQuoteLocationOccupancy() {
        console.log(this.uploadQuoteLocationOccupancyForm)

        const payload = { ...this.uploadQuoteLocationOccupancyForm.value }

        console.log(payload)

        // if (payload.files.length > 0) {

        let formData = new FormData();

        const file = payload['fileSource'];

        formData.append('quote_location_occupancy', file)

        this.quoteLocationOccupancyService.uploadQuoteLocationOccupanciesExcel(this.quote._id, formData).subscribe({
            next: (response: any) => {
                console.log('response', response)
                if (response?.status == '201') {
                    console.log(this.quote)
                    this.quoteService.refresh()
                } else {
                    console.log(typeof response)
                    this.appService.downloadSampleExcel(response)
                }
            },
        })
        // }
    }


    uploadClientLocation() {
        console.log(this.uploadClientLocationForm)

        const payload = { ...this.uploadClientLocationForm.value }

        console.log(payload)

        // if (payload.files.length > 0) {

        let formData = new FormData();

        const file = payload['fileSource'];

        formData.append('client_locations', file)

        this.clientLocationService.uploadClientLocationsExcel(this.quote.clientId['_id'], formData).subscribe({
            next: (response: any) => {
                console.log('response', response)
                if (response?.status == '201') {
                    alert('Please Reload the Page')
                } else {
                    console.log(typeof response)
                    this.appService.downloadSampleExcel(response)
                }
            },
        })
        // }
    }



    get uploadClientLocationExcel(): PFileUploadGetterProps {
        return {
            name: "client_locations",
            url: this.clientLocationService.uploadClientLocationsExcelUrl(this.quote.clientId['_id']),
            accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/wps-office.xlsx',
            maxFileSize: 1000000,
            method: 'post',
            onUpload: ($event) => {
                this.messageService.add({
                    detail: 'Client Location Uploaded',
                    severity: 'success'
                })

                this.next()
            }

        }
    }

    downloadClientLocationExcel() {
        this.clientLocationService.downloadClientLocationsExcel(this.quote.clientId['_id']).subscribe({
            next: (response: any) => this.appService.downloadSampleExcel(response),
            error: e => {
                console.log(e)
            }
        })
    }

    onChange(event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];

            this.uploadQuoteLocationOccupancyForm.patchValue({
                fileSource: file
            });
        }
    }
    onClientLocationChange(event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];

            this.uploadClientLocationForm.patchValue({
                fileSource: file
            });
        }
    }

    get uploadQuoteLocationOccupancyExcel(): PFileUploadGetterProps {
        return {
            name: "quote_location_occupancy",
            url: this.quoteLocationOccupancyService.uploadQuoteLocationOccupanciesExcelUrl(this.quote._id),
            accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/wps-office.xlsx',
            maxFileSize: 1000000,
            method: 'post',
            onUpload: ($event) => {
                console.log($event.target.files);
                if ($event.target.files.length > 0) {

                    let formData = new FormData();

                    const file = $event.target.files[0];

                    // formData.append('quote_location_occupancy', file)

                    // this.quoteLocationOccupancyService.uploadQuoteLocationOccupanciesExcel(formData).subscribe({
                    //     next: (dto) => {
                    //         console.log(dto)
                    //     }
                    // })
                }
                this.appService.downloadSampleExcel($event.files[0])
            },
        }
    }

    downloadQuoteLocationOccupancyExcel() {
        this.quoteLocationOccupancyService.downloadQuoteLocationOccupanciesExcel(this.quote._id).subscribe({
            next: (response: any) => this.appService.downloadSampleExcel(response),
            error: e => {
                console.log(e)
            }
        })
    }




    get uploadBSCCoverExcel(): PFileUploadGetterProps {
        return {
            name: "Upload_Bsc_Covers_Excel",
            url: this.quoteService.uploadBscCoversExcel(this.quote._id),
            accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/wps-office.xlsx',
            maxFileSize: 1000000,
            method: 'post'
        }
    }

    downloadBscCoverExcel() {
        this.quoteService.downloadBscCoversExcel(this.quote._id).subscribe({
            next: (response: any) => this.appService.downloadSampleExcel(response),
            error: e => {
                console.log(e)
            }
        })
    }

    next() {
        this.activeTab = 'uploadLocationOccupancy';
        this.config.header = 'Upload Location Details'
    }

    done() {
        this.ref.close()
    }

    goToStep1(){
        this.activeTab =  "uploadLocationDetails"
        this.config.header = 'Upload Location'
        // alert(123)
    }
    goToStep2(){
        this.activeTab =  "uploadLocationOccupancy"
        this.config.header = 'Upload Risk Occupancy'
    }

    errorHandler(e, uploader: FileUpload) {
        uploader.remove(e,0)
    }
}
