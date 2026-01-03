import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IManyResponseDto } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { IDiffHistory } from 'src/app/components/audit-trail/audit-trail.model';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IUser } from 'src/app/features/admin/user/user.model';

@Component({
    selector: 'app-quote-audit-trail-dialog',
    templateUrl: './quote-audit-trail-dialog.component.html',
    styleUrls: ['./quote-audit-trail-dialog.component.scss']
})
export class QuoteAuditTrailDialogComponent implements OnInit {

    quote: IQuoteSlip

    private currentQuote: Subscription;


    historyAction: Array<{
        user: IUser,
        collection: string,
        eventType: string,
        actions: Array<{ message: string }>,
        timestamp: string
    }> = []

    constructor(
        private quoteService: QuoteService,
        private appService: AppService
    ) {
        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote) => {
                this.quote = quote
            }
        })

    }

    ngOnInit(): void {

        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            // filters: {
            //   // @ts-ignore
            //   name: [
            //     {
            //       value: event.query,
            //       matchMode: "startsWith",
            //       operator: "or"
            //     }
            //   ]
            // },
            // globalFilter: null,
            // multiSortMeta: null
        }

        this.loadRecords(lazyLoadEvent)

    }

    loadRecords(lazyLoadEvent: LazyLoadEvent) {
        lazyLoadEvent.first = 0;
        lazyLoadEvent.rows = 20;

        this.quoteService.getNestedDiffHistory(this.quote._id, lazyLoadEvent).subscribe({
            next: (dto: IManyResponseDto<IDiffHistory>) => {
                console.log(dto.data.entities)




                for (let item of dto.data.entities) {
                    let actions = [];
                    for (let [key, diff] of Object.entries(item.diff)) {

                        let diffItem: Array<any> = diff as Array<any>

                        if (diffItem.length == 1) {

                            actions.push({ message: `Assigned "${key}" as "${diffItem}"` })
                        }
                        if (diffItem.length == 2) {

                            actions.push({ message: `Updated "${key}" from "${diffItem[0]}" to "${diffItem[1]}"  ` })
                        }
                    }



                    this.historyAction.push({
                        user: item.user,
                        collection: item.collectionName.split('-')[0],
                        eventType: item.eventType,
                        actions: actions,
                        timestamp: `${new Date(item.createdAt).toLocaleDateString()} ${new Date(item.createdAt).toLocaleTimeString()}`,
                    })
                }

                this.historyAction = [...this.historyAction]
                console.log(this.historyAction)
            }
        })
    }

    downloadAuditTrail() {
        this.quoteService.downloadAuditTrail(this.quote._id).subscribe((res) => {
            console.log("Ids send successfully")
            console.log(res);

            this.appService.downloadFileFromUrl('Audit Trail', res.data.entity.downloadablePath)
        })
    }

    ngOnDestroy(): void {
        this.currentQuote.unsubscribe();
    }


}
