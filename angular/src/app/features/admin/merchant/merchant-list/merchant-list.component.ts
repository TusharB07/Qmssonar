import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IMerchant } from '../merchant.model';
import { Table } from 'primeng/table';
import { LazyLoadEvent } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { AccountService } from 'src/app/features/account/account.service';
import { Observable } from 'rxjs';
import { IUser } from '../../user/user.model';
import { MerchantService } from '../merchant.service';

@Component({
  selector: 'app-merchant-list',
  templateUrl: './merchant-list.component.html',
  styleUrls: ['./merchant-list.component.scss']
})
export class MerchantListComponent implements OnInit {

  merchant : IMerchant[]

  recordSingularName = "Email Configuration";
  recordPluralName = "Email Configurations";

  modulePath: string = "/backend/admin/merchant";

  selectedRecord: any = null;
  /** Represents the user records being deleted. */

  selectAll: boolean = false;

  selectedRecords: IMerchant[] = [];

  /** Dialog to show when attempting to delete one record */
  deleteRecordDialog: boolean = false;
  /** Dialog to show when attempting to delete more than one record */
  deleteSelectedRecordsDialog: boolean = false;

  totalRecords: number;
  loading: boolean;

  currentUser$: Observable<IUser>;

  constructor(
    private merchantService : MerchantService,
    private router: Router,
    private breadcrumbService: AppBreadcrumbService,
    private accountService: AccountService,
  ) {
    this.breadcrumbService.setItems([
      { label: "Pages" },
      {
        label: this.recordPluralName,
        routerLink: [`${this.modulePath}`]
      }
    ]);
    this.currentUser$ = this.accountService.currentUser$;
   }

  ngOnInit(): void {
    // this.merchant = [
    //   {
    //     _id: '1',
    //     merchant_Name : 'Test ABC',
    //     merchant_URL : 'http://testABC.com',
    //     merchant_No : 'ABC123'
    //   },
    //   {
    //     _id : '2',
    //     merchant_Name : 'Something',
    //     merchant_URL : 'http://testABC.com',
    //     merchant_No : 'ABC123'
    //   },
    //   {
    //     _id:'3',
    //     merchant_Name : 'Test ABC',
    //     merchant_URL : 'http://testABC.com',
    //     merchant_No : 'ABC123'
    //   }
    // ]
  }

  clear(table: Table) {
    this.selectedRecords = [];
    this.selectAll = false;
    table.clear();
  }

  // To Create New Record
  createRecord() {
    this.router.navigateByUrl(`${this.modulePath}/new`);
  }

  // To Edit Existing Record
  editRecord(merchantId) {
    console.log("MerchantID", merchantId  )
    this.router.navigateByUrl(`${this.modulePath}/${merchantId}`);
  }

  // To Load Records
  loadRecords(event: LazyLoadEvent, name?: string) {
    this.loading = true;
    this.merchantService.getMany(event).subscribe({
      next: merchantList => {
        console.log(merchantList)
        this.merchant = merchantList.data.entities
        this.totalRecords = merchantList.results;
        console.log(this.merchant)
        this.loading = false;
      },
      error: e => {
        console.log(e);
      }
    })
   }

}
