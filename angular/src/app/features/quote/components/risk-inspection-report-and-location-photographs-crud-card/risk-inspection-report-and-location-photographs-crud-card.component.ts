import { HttpHeaders } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FileUpload } from 'primeng/fileupload';
import { Observable, Subscription } from 'rxjs';
import { IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import {MessageService} from "primeng/api";
import { DialogService } from 'primeng/dynamicdialog';
import { GenerateAiComponent } from '../generate-ai-dialog/generate-ai-dialog.component';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-risk-inspection-report-and-location-photographs-crud-card',
    templateUrl: './risk-inspection-report-and-location-photographs-crud-card.component.html',
    styleUrls: ['./risk-inspection-report-and-location-photographs-crud-card.component.scss']
})
export class RiskInspectionReportAndLocationPhotographsCrudCardComponent implements OnInit, OnChanges {

    @Input() quote: IQuoteSlip
    @Input() permissions: PermissionType[] = ['create', 'read', 'update', 'delete']

    uploadRiskInspectionReportUrl: string;
    uploadLocationPhotographsUrl: string;
    uploadExpiryCopyUrl: string;
    isMobile: boolean = false;

    uploadHttpHeaders: HttpHeaders;
    currentUser$: Observable<IUser>;
    Summarytable: boolean;
    summarrydata: {};
    aidata:boolean = true;
   
   

    @Input() quoteOptionData: IQuoteOption    // New_Quote_Option
    uploadRiskotherattactmentsReportUrl: string;
    uploadlayoutReportUrl: string;
    uploadRiskotherattachementReportUrl: string;
    uploadbarchartReportUrl: string;
    uploadboqReportUrl: string;
    isLockton: boolean = environment.isLokton


    // data = [
    //     {
    //       "name": "Fire safety",
    //       "value": 15,
    //       "justification": "The presence of a fire hose and a fire hydrant indicates good fire safety measures, however the old and rusty pipe might indicate a potential problem."
    //     },
    //     {
    //       "name": "Mold/Rust detection",
    //       "value": 50,
    //       "justification": "The presence of rust on the fire hydrant suggests potential moisture issues and neglect."
    //     },
    //     {
    //       "name": "Safety measure detection",
    //       "value": 20,
    //       "justification": "The presence of a fire hose and a fire hydrant suggests some safety measures, but more could be in place."
    //     },
    //     {
    //       "name": "Dirt/Maintenance detection",
    //       "value": 40,
    //       "justification": "The presence of dirt on the floor and the rusted pipe suggests a lack of regular maintenance."
    //     },
    //     {
    //       "name": "Structural integrity",
    //       "value": 20,
    //       "justification": "The condition of the steps seems good but the overall structural integrity is unclear from the picture."
    //     },
    //     {
    //       "name": "Cleanliness",
    //       "value": 30,
    //       "justification": "The presence of dirt on the floor suggests a need for better cleaning and maintenance."
    //     },
    //     {
    //       "name": "Lighting",
    //       "value": 10,
    //       "justification": "Lighting is not visible in the picture."
    //     }
    //   ];

    constructor(
        private quoteService: QuoteService,
        private accountService: AccountService,
        private messageService: MessageService,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private deviceService: DeviceDetectorService,
        private quoteOptionService: QuoteOptionService,
        private dialogService: DialogService,
    ) {
        this.uploadHttpHeaders = this.accountService.bearerTokenHeader();
        this.currentUser$ = this.accountService.currentUser$
    }

    ngOnInit(): void {
        this.isMobile = this.deviceService.isMobile();
     console.log(this.quoteOptionData);
     console.log(this.quote);
        // Old_Quote
        // this.uploadRiskInspectionReportUrl = this.quoteLocationOccupancyService.riskInspectionReportUploadUrl(this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id);
        // this.uploadLocationPhotographsUrl = this.quoteLocationOccupancyService.locationPhotoGraphUploadUrl(this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id);

        // New_Quote_Option
        this.uploadRiskInspectionReportUrl = this.quoteLocationOccupancyService.riskInspectionReportUploadUrl(this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id);
        this.uploadlayoutReportUrl = this.quoteLocationOccupancyService.layoutUploadUrl(this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id);
        this.uploadRiskotherattachementReportUrl = this.quoteLocationOccupancyService.otherattachementUploadUrl(this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id);
        this.uploadbarchartReportUrl = this.quoteLocationOccupancyService.barchartUploadUrl(this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id);
        this.uploadboqReportUrl = this.quoteLocationOccupancyService.BoqUploadUrl(this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id);
        this.uploadLocationPhotographsUrl = this.quoteLocationOccupancyService.locationPhotoGraphUploadUrl(this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id, {quoteOptionId: this.quoteOptionData?._id});
        this.summarrydata = (this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?.locationPhotographs?.[0].riskInspectionReportFromAI.parameters);
        setTimeout(() => {
            if(this.quote?.productId['shortName'] == 'FIPR'){
                this.aidata = true 
               }
               else{
                this.aidata = false
               } 
        }, 3000);
        // console.log('quote:', this.quote);
        // console.log('shortName:', this.quote?.productId?.['shortName']);
        //! Bad code needs to be removed as the permissions are from props and also default
        // this.currentUser$.subscribe({
        //     next: user => {
        //       let role: IRole = user?.roleId as IRole;
        // if (role?.name === AllowedRoles.INSURER_RM) {

        //    this.permissions = ['read'];
        // }else{

        //     this.permissions = ['read', 'update', 'delete'];
        // }
        // }
        // })
    }


    ngOnChanges(changes: SimpleChanges): void {
        this.ngOnInit();
    }

    



    onUploadRiskInspectionReport() {
        // Old_Quote
        // this.quoteService.get(`${this.quote._id}`, { 'quoteLocationOccupancyId': this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id }).subscribe({
        //     next: (dto: IOneResponseDto<IQuoteSlip>) => {
        //         if (dto.status == 'success') {
        //             this.messageService.add({
        //                 summary: "Success",
        //                 detail: 'Saved',
        //                 severity: 'success'
        //             })
        //             // console.log(dto.data.entity)
        //             this.quoteService.setQuote(dto.data.entity)
        //         }
        //     },
        //     error: e => {
        //         console.log(e);
        //     }
        // });

        // New_Quote_Option
        this.quoteOptionService.get(`${this.quoteOptionData._id}`, { 'quoteLocationOccupancyId': this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id }).subscribe({
            next: (dto: IOneResponseDto<IQuoteOption>) => {
                if (dto.status == 'success') {
                    this.messageService.add({
                        summary: "Success",
                        detail: 'Saved!',
                        severity: 'success'
                    })
                    this.quoteOptionService.setQuoteOptionForProperty(dto.data.entity)
                }
            },
            error: e => {
                console.log(e);
            }
        });
    }

    onUploadlayoutReport() {
        this.quoteOptionService.get(`${this.quoteOptionData._id}`, { 'quoteLocationOccupancyId': this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id }).subscribe({
            next: (dto: IOneResponseDto<IQuoteOption>) => {
                if (dto.status == 'success') {
                    this.messageService.add({
                        summary: "Success",
                        detail: 'Saved!',
                        severity: 'success'
                    })
                    this.quoteOptionService.setQuoteOptionForProperty(dto.data.entity)
                }
            },
            error: e => {
                console.log(e);
            }
        });
    }

    onUploadOtheAttachementReport() {
        this.quoteOptionService.get(`${this.quoteOptionData._id}`, { 'quoteLocationOccupancyId': this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id }).subscribe({
            next: (dto: IOneResponseDto<IQuoteOption>) => {
                if (dto.status == 'success') {
                    this.messageService.add({
                        summary: "Success",
                        detail: 'Saved!',
                        severity: 'success'
                    })
                    this.quoteOptionService.setQuoteOptionForProperty(dto.data.entity)
                }
            },
            error: e => {
                console.log(e);
            }
        });
    }

    onUploadExpiryCopy() {
        
        // New_Quote_Option
        this.quoteOptionService.get(`${this.quoteOptionData._id}`, { 'quoteLocationOccupancyId': this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id }).subscribe({
            next: (dto: IOneResponseDto<IQuoteOption>) => {
                if (dto.status == 'success') {
                    this.messageService.add({
                        summary: "Success",
                        detail: 'Saved!',
                        severity: 'success'
                    })
                    this.quoteOptionService.setQuoteOptionForProperty(dto.data.entity)
                }
            },
            error: e => {
                console.log(e);
            }
        });
    }

    onUploadLocationPhotographs() {
        // Old_Quote
        // this.quoteService.get(`${this.quote._id}`, { 'quoteLocationOccupancyId': this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id }).subscribe({
        //     next: (dto: IOneResponseDto<IQuoteSlip>) => {
        //         if (dto.status == 'success') {
        //             this.messageService.add({
        //                 summary: "Success",
        //                 detail: 'Saved',
        //                 severity: 'success'
        //             })
        //             // console.log(dto.data.entity)
        //             this.quoteService.setQuote(dto.data.entity)
        //         }
        //     },
        //     error: e => {
        //         console.log(e);
        //     }
        // });

        // New_Quote_Option
        this.quoteOptionService.get(`${this.quoteOptionData._id}`, { 'quoteLocationOccupancyId': this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id }).subscribe({
            next: (dto: IOneResponseDto<IQuoteOption>) => {
                if (dto.status == 'success') {
                    this.messageService.add({
                        summary: "Success",
                        detail: 'Saved!',
                        severity: 'success'
                    })
                    this.quoteOptionService.setQuoteOptionForProperty(dto.data.entity)

                }
            },
            error: e => {
                console.log(e);
            }
        });
    }

    downloadRiskInspectionReport() {
        // Old_Quote
        // this.quoteLocationOccupancyService.riskInspectionReportDownload(this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id).subscribe({

        // New_Quote_Option
        this.quoteLocationOccupancyService.riskInspectionReportDownload(this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id).subscribe({
            next: (response: any) => {
                let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Risk Inspection Report';

                const a = document.createElement('a')
                const blob = new Blob([response.body], { type: response.headers.get('content-type') });
                const file = new File([blob], 'Hello', { type: response.headers.get('content-type'), });
                const objectUrl = window.URL.createObjectURL(file);
                window.open(objectUrl, '_blank');

                URL.revokeObjectURL(objectUrl);

            }
        })
    }

    downloadlayout() {
        this.quoteLocationOccupancyService.layoutUploadDownload(this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id).subscribe({
            next: (response: any) => {
                let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Layout Report';

                const a = document.createElement('a')
                const blob = new Blob([response.body], { type: response.headers.get('content-type') });
                const file = new File([blob], 'Hello', { type: response.headers.get('content-type'), });
                const objectUrl = window.URL.createObjectURL(file);
                window.open(objectUrl, '_blank');

                URL.revokeObjectURL(objectUrl);

            }
        })
    }
    deletelbarchart() {
        this.quoteLocationOccupancyService.barchartDelete(this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id).subscribe({
            next: () => {
                this.quoteOptionService.get(`${this.quoteOptionData._id}`, { 'quoteLocationOccupancyId': this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id }).subscribe({
                    next: (dto: IOneResponseDto<IQuoteOption>) => {
                        this.quoteOptionService.setQuoteOptionForProperty(dto.data.entity)
                    },
                    error: e => {
                        console.log(e);
                    }
                });
            }
        })
    }


    downloadbarChart() {
        this.quoteLocationOccupancyService.barchartDownload(this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id).subscribe({
            next: (response: any) => {
                let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Layout Report';

                const a = document.createElement('a')
                const blob = new Blob([response.body], { type: response.headers.get('content-type') });
                const file = new File([blob], 'Hello', { type: response.headers.get('content-type'), });
                const objectUrl = window.URL.createObjectURL(file);
                window.open(objectUrl, '_blank');

                URL.revokeObjectURL(objectUrl);

            }
        })
    }
    deletelayout() {
        this.quoteLocationOccupancyService.layoutDelete(this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id).subscribe({
            next: () => {
                this.quoteOptionService.get(`${this.quoteOptionData._id}`, { 'quoteLocationOccupancyId': this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id }).subscribe({
                    next: (dto: IOneResponseDto<IQuoteOption>) => {
                        this.quoteOptionService.setQuoteOptionForProperty(dto.data.entity)
                    },
                    error: e => {
                        console.log(e);
                    }
                });
            }
        })
    }
    downloadOtherAttachment() {
        this.quoteLocationOccupancyService.otherattachementDownload(this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id).subscribe({
            next: (response: any) => {
                let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Layout Report';

                const a = document.createElement('a')
                const blob = new Blob([response.body], { type: response.headers.get('content-type') });
                const file = new File([blob], 'Hello', { type: response.headers.get('content-type'), });
                const objectUrl = window.URL.createObjectURL(file);
                window.open(objectUrl, '_blank');

                URL.revokeObjectURL(objectUrl);

            }
        })
    }
    deleteOtherAttachment() {
        this.quoteLocationOccupancyService.otherAttachmentDelete(this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id).subscribe({
            next: () => {
                this.quoteOptionService.get(`${this.quoteOptionData._id}`, { 'quoteLocationOccupancyId': this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id }).subscribe({
                    next: (dto: IOneResponseDto<IQuoteOption>) => {
                        this.quoteOptionService.setQuoteOptionForProperty(dto.data.entity)
                    },
                    error: e => {
                        console.log(e);
                    }
                });
            }
        })
    }

    downloadBoqAttachment() {
        this.quoteLocationOccupancyService.BoqDownload(this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id).subscribe({
            next: (response: any) => {
                let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Layout Report';

                const a = document.createElement('a')
                const blob = new Blob([response.body], { type: response.headers.get('content-type') });
                const file = new File([blob], 'Hello', { type: response.headers.get('content-type'), });
                const objectUrl = window.URL.createObjectURL(file);
                window.open(objectUrl, '_blank');

                URL.revokeObjectURL(objectUrl);

            }
        })
    }
    deleteBoq() {
        this.quoteLocationOccupancyService.BoqDelete(this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id).subscribe({
            next: () => {
                this.quoteOptionService.get(`${this.quoteOptionData._id}`, { 'quoteLocationOccupancyId': this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id }).subscribe({
                    next: (dto: IOneResponseDto<IQuoteOption>) => {
                        this.quoteOptionService.setQuoteOptionForProperty(dto.data.entity)
                    },
                    error: e => {
                        console.log(e);
                    }
                });
            }
        })
    }


    errorHandler(event: any, uploader: FileUpload) {
        uploader.remove(event.files[0], 0);
        if (event && event.xhr && event.xhr.response) {
            const response = JSON.parse(event.xhr.response);
            if (response.error && response.error.message) {
                this.messageService.add({
                    summary: "Error",
                    detail: response.error.message,
                    severity: 'error'
                });
            } else {
                this.messageService.add({
                    summary: "Error",
                    detail: "An unknown error occurred.",
                    severity: 'error'
                });
            }
        } else {
            this.messageService.add({
                summary: "Error",
                detail: "An unknown error occurred.",
                severity: 'error'
            });
        }
    }

    deleteRiskInspectionReport() {
        // Old_Quote
        // this.quoteLocationOccupancyService.riskInspectionReportDelete(this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id).subscribe({
        //     next: () => {
        //         this.quoteService.get(`${this.quote._id}`, { 'quoteLocationOccupancyId': this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id }).subscribe({
        //             next: (dto: IOneResponseDto<IQuoteSlip>) => {
        //                 // console.log(dto.data.entity)
        //                 this.quoteService.setQuote(dto.data.entity)
        //             },
        //             error: e => {
        //                 console.log(e);
        //             }
        //         });
        //     }
        // })

        // New_Quote_Option
        this.quoteLocationOccupancyService.riskInspectionReportDelete(this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id).subscribe({
            next: () => {
                this.quoteOptionService.get(`${this.quoteOptionData._id}`, { 'quoteLocationOccupancyId': this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id }).subscribe({
                    next: (dto: IOneResponseDto<IQuoteOption>) => {
                        this.quoteOptionService.setQuoteOptionForProperty(dto.data.entity)
                    },
                    error: e => {
                        console.log(e);
                    }
                });
            }
        })
    }

    downloadLocationPhotograph(imagePath: string) {
        // Old_Quote
        // this.quoteLocationOccupancyService.locationPhotoGraphDownload(this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id, imagePath).subscribe({

        // New_Quote_Option
        this.quoteLocationOccupancyService.locationPhotoGraphDownload(this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id, imagePath).subscribe({
            next: (response: any) => {
                let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Location Photograph';

                const a = document.createElement('a')
                const blob = new Blob([response.body], { type: response.headers.get('content-type') });
                const file = new File([blob], 'Hello', { type: response.headers.get('content-type'), });
                const objectUrl = window.URL.createObjectURL(file);
                window.open(objectUrl, '_blank');

                URL.revokeObjectURL(objectUrl);

            }
        })
    }

    deleteLocationPhotograph(imagePath: string) {
        // Old_Quote
        // this.quoteLocationOccupancyService.locationPhotoGraphDelete(this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id, imagePath).subscribe({
        //     next: () => {
        //         this.quoteService.get(`${this.quote._id}`, { 'quoteLocationOccupancyId': this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id }).subscribe({
        //             next: (dto: IOneResponseDto<IQuoteSlip>) => {
        //                 // console.log(dto.data.entity)
        //                 this.quoteService.setQuote(dto.data.entity)
        //             },
        //             error: e => {
        //                 console.log(e);
        //             }
        //         });
        //     }
        // })

        // New_Quote_Option
        this.quoteLocationOccupancyService.locationPhotoGraphDelete(this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id, imagePath).subscribe({
            next: () => {
                this.quoteOptionService.get(`${this.quoteOptionData._id}`, { 'quoteLocationOccupancyId': this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id }).subscribe({
                    next: (dto: IOneResponseDto<IQuoteOption>) => {
                        this.quoteOptionService.setQuoteOptionForProperty(dto.data.entity)
                    },
                    error: e => {
                        console.log(e);
                    }
                });
            }
        })
    }

    updateLocationPhotograph(imagePath, value) {
        // this.quoteLocationOccupancyService.locationPhotoGraphUpdate(this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id, imagePath, value).subscribe({
        //     next: () => {
        //         this.quoteService.get(`${this.quote._id}`, { 'quoteLocationOccupancyId': this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id }).subscribe({
        //             next: (dto: IOneResponseDto<IQuoteSlip>) => {
        //                 // console.log(dto.data.entity)
        //                 this.quoteService.setQuote(dto.data.entity)
        //             },
        //             error: e => {
        //                 console.log(e);
        //             }
        //         });
        //     }
        // })

        this.quoteLocationOccupancyService.locationPhotoGraphUpdate(this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id, imagePath, value).subscribe({
            next: () => {
                this.quoteOptionService.get(`${this.quoteOptionData._id}`, { 'quoteLocationOccupancyId': this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id }).subscribe({
                    next: (dto: IOneResponseDto<IQuoteOption>) => {
                        this.quoteOptionService.setQuoteOptionForProperty(dto.data.entity)
                    },
                    error: e => {
                        console.log(e);
                    }
                });
            }
        })
    }

    opendialog(){
        this.Summarytable = true;
    }
    openAIDialog(){
        const ref = this.dialogService.open(GenerateAiComponent, {
            header: "Chatbot",
            width: '650px',
            height:'800px',
            styleClass: 'customPopup',
            data:this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id
        })
        ref.onClose.subscribe(() => {

        });
    }
}
