import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';

@Component({
  selector: 'app-delete-bsc-cover',
  templateUrl: './delete-bsc-cover.component.html',
  styleUrls: ['./delete-bsc-cover.component.scss']
})
export class DeleteBscCoverComponent implements OnInit {

  coverName : string
  modelName : string
  quote : any
  id: any;

  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private quoteService : QuoteService
  ) { 
    this.quote = this.config.data.quote
    this.modelName = this.config.data.coverName
    // @ts-ignore
    this.coverName = this.config.data.coverName?.replaceAll('_',' ')
    this.id = config.data?.id;
  }

  ngOnInit(): void {
  }

  close(){
    this.ref.close(false);
  }

  deleteCovers() {
    let removed_covers = []
    removed_covers.push(this.modelName)
    let selectedAllowedProductBscCover = this.quote?.selectedAllowedProductBscCover.filter(item => item!=this.modelName)
    const id = this.id ?? '';
    this.quoteService.deleteproductbsccovers(this.quote?._id,{removed_covers,selectedAllowedProductBscCover,id}).subscribe(data => {
      this.ref.close()
    })
  }

}
