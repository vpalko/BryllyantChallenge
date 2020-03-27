import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../shared/constants';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  reportUrl: string = `${this.constants.REQRES_API_BASE_URL}${this.constants.REQRES_REPORT_URL}`;

  constructor(private httpClient: HttpClient, private constants: Constants) { }

  getReport(data): Observable<any> {
    return this.httpClient.post(`${this.reportUrl}`, data, httpOptions);
  }
}
