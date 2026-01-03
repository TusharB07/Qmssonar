import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";

import { LoadingService } from "../features/service/loading.service";
import { Observable } from "rxjs";
import { delay, finalize } from "rxjs/operators";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    constructor(private busyService: LoadingService) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {


        // if (!(request.url.includes("prime") || request.url.includes("match") || request.url.includes("quote-locations-breakup"))) {
        if (!(request.url.includes("prime") || request.url.includes("match")|| request.url.includes("prompt-ai") || request.url.includes("batch-upsert-mail-parser"))) {
            this.busyService.busy();
        }

        return next.handle(request).pipe(
            // delay(3000),
            finalize(() => this.busyService.idle())
        );
    }
}
