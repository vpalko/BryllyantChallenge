import { Component, OnInit, Input } from '@angular/core';
import { ReportService } from '../../../../services/report.service';
import * as lodash from 'lodash';

@Component({
  selector: 'app-report1',
  templateUrl: './report1.component.html',
  styleUrls: ['./report1.component.css']
})
export class Report1Component implements OnInit {
  @Input() pollid: number;
  pollRequestData;

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.reportService.getReport({
      "reportid": 1,
      "pollid": this.pollid
    }).subscribe(res => {
      this.pollRequestData = res;
    });

  }

  getStatus(row, status){
    let countObj = lodash.find(this.pollRequestData[row].statuscount, { status });

    return countObj ? countObj.count : 0;

  }

}
