import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-agent-dashboard',
    templateUrl: './agent-dashboard.component.html',
    styleUrls: ['./agent-dashboard.component.scss','./../dashboard.component.scss']
})
export class AgentDashboardComponent implements OnInit {

    @Input() user;

    constructor() { }

    ngOnInit(): void {
    }

}
