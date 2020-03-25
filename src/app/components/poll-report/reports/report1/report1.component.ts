import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../../services/report.service';

@Component({
  selector: 'app-report1',
  templateUrl: './report1.component.html',
  styleUrls: ['./report1.component.css']
})
export class Report1Component implements OnInit {

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {

    this.reportService.getReport({statusData}).subscribe(res => {
      // if (res.status === 3) {
      //   this.pollsubmitted = true;
      //   this.pollsubmittedOn = `${moment(res.updatedon).fromNow()} (${moment(res.updatedon).format('L')})`;
      // }
    });

  }

}
