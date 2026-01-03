import { AllowedStates } from './../qms.model';
import { AllowedRoles } from 'src/app/features/admin/role/role.model';
import { QuoteService } from './../../../../admin/quote/quote.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { AccountService } from 'src/app/features/account/account.service';
import { IQuoteSlip, AllowedQuoteStates } from 'src/app/features/admin/quote/quote.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { QmsService } from '../qms.service';
import { HttpHeaders } from '@angular/common/http';
import { IOneResponseDto } from 'src/app/app.model';
import { Router } from '@angular/router';
import { AllowedPushbacks } from 'src/app/features/admin/product/product.model';


@Component({
  selector: 'app-query-discussion-box',
  templateUrl: './query-discussion-box.component.html',
  styleUrls: ['./query-discussion-box.component.scss']
})

export class QueryDiscussionBoxComponent implements OnInit {

  insurerQuotes = []

  @Input() quote: IQuoteSlip

  stateOptions: any[];

  openItems: MenuItem[];
  closedItems: MenuItem[];
  partnerNames: any[];
  selectedPartner: any[] = [];

  isShowForm = false;
  newComment = '';
  queryForm: any
  selectedCategory: any = null;
  querySelected: any;

  userOptions: any[]
  AllowedRoles = AllowedRoles;
  AllowedQuoteStates = AllowedQuoteStates;
  categories: any[] = [{ name: 'Open', key: 'O' }, { name: 'Closed', key: 'C' }, { name: 'All', key: 'A' }];

  filteredData = [];
  queryData = [];
  user: IUser;
  id: string;
  uploadHttpHeaders: HttpHeaders;
  uploadedFiles: any[] = [];
  showCreateButton = false;
  lazyLoadEvent: LazyLoadEvent = {
    first: 0,
    rows: 20,
    sortField: null,
    sortOrder: 1,
    filters: {
      // @ts-ignore
      "originalQuoteId": ''
    },
    globalFilter: null,
    multiSortMeta: null
  }

  constructor(
    private quoteService: QuoteService,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private qmsService: QmsService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.stateOptions = ['Internal', 'External'];
    this.uploadHttpHeaders = this.accountService.bearerTokenHeader();

    this.openItems = [{
      label: 'Resolve', icon: 'pi pi-check', command: () => {
        this.qmsService.updateQuery(this.querySelected, { state: 'Closed' }).subscribe({
          next: (res) => {
            this.loadQueryData();
          }
        })
      }
    }];
  }

  get allowedQuoteStates(): typeof AllowedQuoteStates {
    return AllowedQuoteStates;
  }

  ngOnInit(): void {
    this.accountService.currentUser$.subscribe({
      next: (user: IUser) => {
        this.user = user;
        if (this.user.partnerId['partnerType'] == 'broker') {
          this.getOptionPartners(this.quote._id)
        }
        else {
          this.loadQueryData();
        }
      }
    })
    this.getAllUsers()

    this.selectedCategory = this.categories[2];
    this.createForm();
    this.getQuoteCurrentlyAssignedTo()
  }

  getQuoteCurrentlyAssignedTo() {

    switch (this.quote.quoteState) {
      case AllowedQuoteStates.SENT_TO_INSURER_RM:
        if (this.user?._id == this.quote.assignedToRMId['_id']) {
          this.showCreateButton = true;
        }
        break;
      case AllowedQuoteStates.UNDERWRITTER_REVIEW:
        if (this.quote.underWriter10) {
          if (this.user._id == this.quote.underWriter10['_id']) {
            this.showCreateButton = true;
          }
        }
        else if (this.quote.underWriter9) {
          if (this.user._id == this.quote.underWriter9['_id']) {
            this.showCreateButton = true;
          }
        }
        else if (this.quote.underWriter8) {
          if (this.user._id == this.quote.underWriter8['_id']) {
            this.showCreateButton = true;
          }
        }
        else if (this.quote.underWriter7) {
          if (this.user._id == this.quote.underWriter7['_id']) {
            this.showCreateButton = true;
          }
        }
        else if (this.quote.underWriter6) {
          if (this.user._id == this.quote.underWriter6['_id']) {
            this.showCreateButton = true;
          }
        }
        else if (this.quote.underWriter5) {
          if (this.user._id == this.quote.underWriter5['_id']) {
            this.showCreateButton = true;
          }
        }
        else if (this.quote.underWriter4) {
          if (this.user._id == this.quote.underWriter4['_id']) {
            this.showCreateButton = true;
          }
        }
        else if (this.quote.underWriter3) {
          if (this.user._id == this.quote.underWriter3['_id']) {
            this.showCreateButton = true;
          }
        }
        else if (this.quote.underWriter2) {
          if (this.user._id == this.quote.underWriter2['_id']) {
            this.showCreateButton = true;
          }
        }
        else {
          if (this.user._id == this.quote.underWriter1['_id']) {
            this.showCreateButton = true;
          }
        }
        break;
    }
  }

  getOptionPartners(originalQuoteId: string) {

    this.partnerNames = []
    this.quoteService.getInsurerQuote(originalQuoteId).subscribe(res => {
      this.insurerQuotes = res.data.entity

      this.insurerQuotes = this.insurerQuotes.map(item => {
        let value = {}
        value['name'] = item.partnerId['name']
        value['id'] = item.partnerId['_id']
        this.partnerNames.push(value)
      })
      this.selectedPartner = this.partnerNames.map(item => item.id);
      this.loadQueryData();
    })
  }

  createForm() {
    this.queryForm = this.formBuilder.group({
      queryHeader: [, [Validators.required]],
      assignedTo: [],
      queryType: [, [Validators.required]],
      comment: [, [Validators.required]]
    })
  }

  saveRecord() {

    const payload = { ...this.queryForm.value };
    const formData = new FormData();
    this.uploadedFiles.map(item => {
      formData.append('location_photographs', item, item.name)
    })

    if (this.queryForm.value.queryType == 'External') {
      payload['quoteId'] = this.quote.originalQuoteId
      payload['assignedTo'] = this.quote.approvedById
    } else {
      payload['quoteId'] = this.quote._id;
      payload['assignedTo'] = this.quote.originalQuoteId
    }
    payload['assignedBy'] = this.user._id
    payload['createdById'] = this.user._id;

    this.qmsService.create(payload).subscribe({
      next: (res) => {
        const id = res.data.entity._id;
        this.qmsService.locationPhotoGraphUpload(id, formData).subscribe(resp => {
          this.loadQueryData();
        })
      }
    })

    this.isShowForm = false;
    this.queryForm.reset()
  }

  loadQueryData() {

    let payload = {};
    payload['quoteId'] = this.quote._id;

    this.qmsService.getAllData(payload).subscribe({
      next: (res) => {
        // @ts-ignore 
        let records = res.data.entity['allQueryManagements'];
        let filteredRecords = records.filter(data => data.parentId == undefined).map(item => {
          // @ts-ignore
          if (item.queryType == 'External' && item.createdById?.partnerId?.partnerType != this.user?.partnerId?.partnerType) {
            item.isPartnerTypeVisible = true;
          }
          return {
            ...item,
            isReplyBoxVisible: false,
            isEditable: false
          }
        })

        if (this.user.partnerId['partnerType'] == "broker") {
          filteredRecords = filteredRecords.filter(item => item.queryType == 'External')
        }

        filteredRecords = filteredRecords.map(item => {
          let replies = []
          for (let data of records) {
            // @ts-ignore
            if (data.queryType == 'External' && data.createdById?.partnerId?.partnerType != this.user?.partnerId?.partnerType) {
              data.isPartnerTypeVisible = true;
            }
            if (data.parentId?._id == item?._id) {
              let commentData = { ...data }
              commentData.isEditable = false
              commentData.isReplyBoxVisible = false;
              replies.push(commentData)
              item.replies = replies;
            }
          }
          return item;
        })

        this.filteredData = filteredRecords.sort(function (a, b) {
          return new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf()
        });
        this.queryData = this.filteredData;
        this.filterQueries();
      }
    })
  }

  CreateQuery() {
    this.isShowForm = true;
  }

  cancelQuery() {
    this.isShowForm = false;
  }


  addComment(query: any) {

    if (this.newComment != '') {
      const formData = new FormData();
      this.uploadedFiles.map(item => {
        console.log(item, item.name)
        formData.append('location_photographs', item, item.name)
      })

      console.log(this.uploadedFiles.length)
      const payload = { ...query };
      console.log(payload)

      payload['createdById'] = this.user._id;
      payload['parentId'] = query._id
      payload['comment'] = this.newComment
      payload['assignedTo'] = payload['assignedBy']
      payload['assignedBy'] = this.user._id;
      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.locationPhotographs
      console.log(payload)

      this.qmsService.create(payload).subscribe({
        next: (res) => {

          const id = res.data.entity._id;
          this.qmsService.locationPhotoGraphUpload(id, formData).subscribe(resp => {

            this.qmsService.updateQuery(query._id, { assignedBy: payload['assignedBy'], assignedTo: payload['assignedTo'], updatedAt: new Date() }).subscribe({
              next: (res) => {
                this.loadQueryData();
              }
            })
          })
        }
      })

      this.newComment = '';
    }
    else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: `Please add some description`,
        life: 3000
      });
    }
  }

  onUpload(event) {
    this.uploadedFiles = [];
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  getAllUsers() {
    let userList = []

    if (this.quote.assignedToRMId) {
      userList.push(this.quote.assignedToRMId)
    }
    if (this.quote.underWriter1) {
      userList.push(this.quote.underWriter1)
    }
    if (this.quote.underWriter2) {
      userList.push(this.quote.underWriter2)
    }
    if (this.quote.underWriter3) {
      userList.push(this.quote.underWriter3)
    }
    if (this.quote.underWriter4) {
      userList.push(this.quote.underWriter4)
    }
    if (this.quote.underWriter5) {
      userList.push(this.quote.underWriter5)
    }
    if (this.quote.underWriter6) {
      userList.push(this.quote.underWriter6)
    }
    if (this.quote.underWriter7) {
      userList.push(this.quote.underWriter7)
    }
    if (this.quote.underWriter8) {
      userList.push(this.quote.underWriter8)
    }
    if (this.quote.underWriter9) {
      userList.push(this.quote.underWriter9)
    }
    if (this.quote.underWriter10) {
      userList.push(this.quote.underWriter10)
    }
    this.userOptions = userList
    this.userOptions = this.userOptions.filter(user => user._id != this.user._id)
  }

  downloadDocument(id: any, imagePath: string) {

    this.qmsService.locationPhotoGraphDownload(id, imagePath).subscribe(res => {

      let fileName = res?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'chatDocument';

      const a = document.createElement('a')
      const blob = new Blob([res.body], { type: res.headers.get('content-type') });
      const file = new File([blob], 'Hello', { type: res.headers.get('content-type'), });
      const objectUrl = window.URL.createObjectURL(file);

      a.href = objectUrl
      a.download = fileName;
      a.click();

      window.open(objectUrl, '_blank');
      URL.revokeObjectURL(objectUrl);

    })
  }

  filterQueries() {
    if (this.user.partnerId['partnerType'] == 'broker') {
      if (this.selectedCategory?.name == 'All') {
        this.filteredData = [...this.queryData].filter(item => this.selectedPartner.includes(item.createdById.partnerId._id))
      }
      else if (this.selectedCategory?.name == 'Open') {
        this.filteredData = this.queryData.filter(item => item.state == 'Open').filter(item => this.selectedPartner.includes(item.createdById.partnerId._id))
      }
      else if (this.selectedCategory?.name == 'Closed') {
        this.filteredData = this.queryData.filter(item => item.state == 'Closed').filter(item => this.selectedPartner.includes(item.createdById.partnerId._id))
      }
    }
    else {
      if (this.selectedCategory?.name == 'All') {
        this.filteredData = [...this.queryData].filter(item => item?.createdById?.partnerId['_id'] == this.user.partnerId['_id'])
      }
      else if (this.selectedCategory?.name == 'Open') {
        this.filteredData = this.queryData.filter(item => item.state == 'Open').filter(item => item?.createdById?.partnerId['_id'] == this.user.partnerId['_id'])
      }
      else if (this.selectedCategory?.name == 'Closed') {
        this.filteredData = this.queryData.filter(item => item.state == 'Closed').filter(item => item?.createdById?.partnerId['_id'] == this.user.partnerId['_id'])
      }
    }
  }

  icWiseQuotes(event) {
    if (this.selectedCategory?.name == 'All') {
      this.filteredData = this.queryData.filter(item => event.includes(item.createdById.partnerId._id));
    }
    else {
      this.filteredData = this.queryData.filter(item => event.includes(item.createdById.partnerId._id)).filter(item => item.state == this.selectedCategory?.name);
    }
  }
  pushBackTo() {
    console.log("called")
    const payload = {};
    payload["pushBackFrom"] = AllowedPushbacks.QCR;
    payload["pushBackToState"] = AllowedQuoteStates.QCR_FROM_UNDERWRITTER;
    this.quoteService.pushBackTo(this.quote._id,payload).subscribe((res) => {
      this.router.navigateByUrl('/backend/quotes')
    })
  }

}
