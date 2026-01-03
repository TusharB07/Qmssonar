import { Component, OnInit } from '@angular/core';
import { EmailServiceService } from '../email-service.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-email-history-list',
  templateUrl: './email-history-list.component.html',
  styleUrls: ['./email-history-list.component.scss']
})
export class EmailHistoryListComponent implements OnInit {

  records : any[]

  modulePath: string = "/backend/admin/email-configuration";

  selectedRecord:any  = null;
  /** Represents the user records being deleted. */

  selectAll: boolean = false;

  totalRecords: number;
  loading: boolean;
  emailHistory : any[]
  constructor(private emailService : EmailServiceService) { }

  ngOnInit(): void {

    this.emailService.getAllEmailHistory().subscribe(res => {
      console.log(res)
      this.emailHistory = res.data.entities
      console.log(this.emailHistory)
    })
    // this.emailHistory = [
    //   {subject:'Dummy',date:'07/07/2023',from:'dummy@gmail.com',to:'dummy2@gmail.com',model:'Dummy',body:'Hello',Status:'Sent',failedreason:'-'},
    //   {subject:'Dummy',date:'07/07/2023',from:'dummy@gmail.com',to:'dummy2@gmail.com',model:'Dummy',body:'Hello',Status:'Sent',failedreason:'-'},
    //   {subject:'Dummy',date:'07/07/2023',from:'dummy@gmail.com',to:'dummy2@gmail.com',model:'Dummy',body:'Hello',Status:'Sent',failedreason:'-'},
    //   {subject:'Dummy',date:'07/07/2023',from:'dummy@gmail.com',to:'dummy2@gmail.com',model:'Dummy',body:'Hello',Status:'Sent',failedreason:'-'},
    //   {subject:'Dummy',date:'07/07/2023',from:'dummy@gmail.com',to:'dummy2@gmail.com',model:'Dummy',body:'Hello',Status:'Sent',failedreason:'-'},
    //   {subject:'Dummy',date:'07/07/2023',from:'dummy@gmail.com',to:'dummy2@gmail.com',model:'Dummy',body:'Hello',Status:'Sent',failedreason:'-'},
    // ]

  }
  
  clear(table: Table) {
    table.clear();
  }

}
