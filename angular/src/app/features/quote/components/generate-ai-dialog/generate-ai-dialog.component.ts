import { Component, OnInit } from "@angular/core";
import { QuoteLocationOccupancyService } from "src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { LoadingService } from "src/app/features/service/loading.service";

@Component({
  selector: "app-generate-ai-dialog",
  templateUrl: "./generate-ai-dialog.component.html",
  styleUrls: ["./generate-ai-dialog.component.css"]
})
export class GenerateAiComponent implements OnInit {
  messages: any = [{ messageRequest: "Hello Broker, how can help you?", messageResponse: "Lorem ipsum dolor sit amet, consectetur adipisicing elit." }];
  value: any;
  id: any;
  constructor(private quoteLocationOccupancyService: QuoteLocationOccupancyService, private config: DynamicDialogConfig,private loadingService:LoadingService) {
    this.id = this.config.data;
  }

  ngOnInit() {
  }
  sendMessage() {
    const payload = {
      prompt: this.value
    };
    this.quoteLocationOccupancyService.locationPhotoGraphUploadUrlPromptAI(this.id, payload).subscribe((res: any[]) => {
      // this.loadingService.idle();

      this.messages.push({
        messageRequest: this.value,
        messageResponse: res["data"]["entity"]["response"] ? res["data"]["entity"]["response"] : res["data"]["entity"]["error"]
      });
      this.value = "";
    });
  }
}
