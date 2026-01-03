import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-self-dashboard',
    templateUrl: './self-dashboard.component.html',
    styleUrls: ['./self-dashboard.component.scss','./../dashboard.component.scss']
})
export class SelfDashboardComponent implements OnInit {


    @Input() user;

    constructor() { }

    ngOnInit(): void {
    }

}
