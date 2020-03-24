import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../shared/constants';

import { Poll } from '../models/Poll';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class PollService {
  pollsUrl: string = `${this.constants.REQRES_API_BASE_URL}${this.constants.REQRES_API_POLL_URL}`;

  constructor(private httpClient: HttpClient, private constants: Constants) { }

  // Get Poll
  getPoll(id) {
    return this.httpClient.get(`${this.pollsUrl}/${id}`, httpOptions);
  }

  // Get Polls
  getPolls(): Observable<Poll[]> {
    return this.httpClient.get<Poll[]>(`${this.pollsUrl}`);
  }

  // Delete Poll
  deletePoll(id) {
    return this.httpClient.delete(`${this.pollsUrl}/${id}`, httpOptions);
  }

  // Add Poll
  addPoll(poll: Poll): Observable<Poll> {
    return this.httpClient.post<Poll>(`${this.pollsUrl}/new`, poll, httpOptions);
  }

  // Send poll invitations
  sendInvitation(data): Observable<Poll> {
    return this.httpClient.post<Poll>(`${this.pollsUrl}/pollrequest`, data, httpOptions);
  }

  // Send poll invitations
  updatePollRequestStatus(data): Observable<Poll> {
    return this.httpClient.post<Poll>(`${this.pollsUrl}/pollrequeststatus`, data, httpOptions);
  }
}
