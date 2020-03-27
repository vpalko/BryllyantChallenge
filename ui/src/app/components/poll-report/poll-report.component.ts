import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-poll-report',
  templateUrl: './poll-report.component.html',
  styleUrls: ['./poll-report.component.css']
})
export class PollReportComponent implements OnInit {
  currentReport: number = 0;
  pollid: number = 0;

  constructor(private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.pollid = this.activeRoute.snapshot.params.id; //pollid is in querystring
  }

  setCurrentReport(id) {
    this.currentReport = id;
  }

}
