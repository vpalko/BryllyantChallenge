import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-poll-report',
  templateUrl: './poll-report.component.html',
  styleUrls: ['./poll-report.component.css']
})
export class PollReportComponent implements OnInit {
  currentReport: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  setCurrentReport(id){
    this.currentReport = id;
  }

}
