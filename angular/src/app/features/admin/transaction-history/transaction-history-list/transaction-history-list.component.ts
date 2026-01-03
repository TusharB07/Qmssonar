import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { ITransactionHistory, Status } from '../transaction-history.model';
import { LazyLoadEvent } from 'primeng/api';
import { TransactionHistoryService } from '../transaction-history.service';

@Component({
  selector: 'app-transaction-history-list',
  templateUrl: './transaction-history-list.component.html',
  styleUrls: ['./transaction-history-list.component.scss']
})
export class TransactionHistoryListComponent implements OnInit {

  totalRecords: number;
  loading: boolean;
  TransactionHistory: ITransactionHistory[];
  status = Status

  constructor(
    private transactionHistoryService : TransactionHistoryService
  ) { }

  ngOnInit(): void {
    // this.TransactionHistory = [
    //   {
    //     partnerId : 'Reliance',
    //     transaction_Date : new Date(),
    //     transaction_No : 'TRAN0101',
    //     quoteId : 'QuoteNO_110232',
    //     status : 'success'
    //   },
    //   {
    //     partnerId : 'Alwrite Agent',
    //     transaction_Date : new Date(),
    //     transaction_No : 'TRAN0102',
    //     quoteId : 'QuoteNO_110234',
    //     status : 'fail'
    //   },
    //   {
    //     partnerId : 'Alwrite Partner',
    //     transaction_Date : new Date(),
    //     transaction_No : 'TRAN0103',
    //     quoteId : 'QuoteNO_110235',
    //     status : 'success'
    //   },
    //   {
    //     partnerId : 'Anand Rathi Financial Services Limited',
    //     transaction_Date : new Date(),
    //     transaction_No : 'TRAN0104',
    //     quoteId : 'QuoteNO_110236',
    //     status : 'success'
    //   },
    //   {
    //     partnerId : 'Reliance',
    //     transaction_Date : new Date(),
    //     transaction_No : 'TRAN0105',
    //     quoteId : 'QuoteNO_110237',
    //     status : 'fail'
    //   }
    // ]
  }

  loadRecords(event : LazyLoadEvent){
    this.loading = true;
    this.transactionHistoryService.getMany(event).subscribe(historyData => {
      this.TransactionHistory = historyData.data.entities
      this.totalRecords = historyData.results;
      console.log(historyData)
      this.loading = false;
      this.TransactionHistory = this.TransactionHistory.filter(data => data.status == 'success')
      this.totalRecords = this.TransactionHistory.length
      
    })
  }

  clear(table: Table) {
    table.clear();
  }

}
