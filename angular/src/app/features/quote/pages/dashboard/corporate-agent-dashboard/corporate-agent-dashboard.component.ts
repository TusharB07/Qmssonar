import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-corporate-agent-dashboard',
    templateUrl: './corporate-agent-dashboard.component.html',
    styleUrls: ['./corporate-agent-dashboard.component.scss','./../dashboard.component.scss']
})
export class CorporateAgentDashboardComponent implements OnInit {


    @Input() user;

    constructor() { }

    ngOnInit(): void {
    }

}
