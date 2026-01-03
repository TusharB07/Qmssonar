import { filter } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { BscCoverService } from 'src/app/features/admin/bsc-cover/bsc-cover.service';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';

@Component({
  selector: 'app-annexures',
  templateUrl: './annexures.component.html',
  styleUrls: ['./annexures.component.scss']
})
export class AnnexuresComponent implements OnInit {

  @Input() quote : IQuoteSlip

  annexures : any =  []

  constructor(
    private bscCoverService : BscCoverService,
    private quoteService : QuoteService,
  ) { }

  ngOnInit(): void {
    console.log(this.quote?.locationBasedCovers)

    this.quoteService.listofbsccoverswithfile(this.quote._id).subscribe(res => {
      this.annexures = res.data['entity'].bscCovers
      this.annexures = this.annexures.filter(item => item.filePath !=null && typeof(item.filePath) == 'string')
      console.log(this.annexures)
    })



    // for(let obj of Object.entries(this.quote?.locationBasedCovers)){
    //   console.log(obj)
    // }

    // let obj  = Object.entries(this.quote?.locationBasedCovers).map(item => {
    //   return item[0].includes('bsc') ? item : null
    // }).filter(item => item!=null)
    // console.log(obj)

    // obj.forEach(item => {
    //   if(item[1].length==undefined){
    //     this.annexures.push({'key' : item[0] , 'value' : item[1].filePath})
    //   }else{
    //     for (let index = 0; index < item[1].length; index++) {
    //       this.annexures.push({'key' : item[0], 'value' : item[1][index].filePath})
    //     }
    //   }
    // })
    // this.annexures = this.annexures.filter(item => item.value!=null)
    // console.log(this.annexures)
  }

  downloadFile(filePath){
    this.bscCoverService.downloadExcel(filePath).subscribe(res => {

        let fileName = res?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'uploadedFile';
  
        const a = document.createElement('a')
        const blob = new Blob([res.body], { type: res.headers.get('content-type') });
        const file = new File([blob], 'Hello', { type: res.headers.get('content-type'), });
        const objectUrl = window.URL.createObjectURL(file);
  
        a.href = objectUrl
        a.download = fileName;
        a.click();
  
        // window.open(objectUrl, '_blank');
        URL.revokeObjectURL(objectUrl);
  
      })
}
  
titleCaseWord(word: string) {
  if (!word) return word;
  return word[0].toUpperCase() + word.substr(1).toLowerCase();
}

}
