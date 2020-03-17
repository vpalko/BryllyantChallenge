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
  pollsUrl:string = `${this.constants.REQRES_API_BASE_URL}${this.constants.REQRES_API_POLL_URL}`;

  constructor(private http:HttpClient, private constants: Constants,) { }

  // Get Polls
  getPolls():Observable<Poll[]> {
    return this.http.get<Poll[]>(`${this.pollsUrl}`);
  }

  // Delete Poll
  deletePoll(poll:Poll):Observable<Poll> {
    const url = `${this.pollsUrl}/${poll.id}`;
    return this.http.delete<Poll>(url, httpOptions);
  }

  // Add Poll
  addPoll(poll:Poll):Observable<Poll> {
    return this.http.post<Poll>(this.pollsUrl, poll, httpOptions);
  }

  // Toggle Completed
  toggleCompleted(poll: Poll):Observable<any> {
    const url = `${this.pollsUrl}/${poll.id}`;
    return this.http.put(url, poll, httpOptions);
  }
}
