import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../shared/constants';

import { Question } from '../models/Question';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  questionsUrl: string = `${this.constants.REQRES_API_BASE_URL}${this.constants.REQRES_API_QUESTION_URL}`;
  answerUrl: string = `${this.constants.REQRES_API_BASE_URL}${this.constants.REQRES_API_ANSWER_URL}`;


  constructor(private httpClient: HttpClient, private constants: Constants) { }

  // Get Questions
  getQuestions(pollid): Observable<Question[]> {
    return this.httpClient.get<Question[]>(`${this.questionsUrl}/poll/${pollid}`);
  }

  // Get Questions and Answers
  getQuestionsAnswers(pollid, requestid, userid) {
    return this.httpClient.get(`${this.answerUrl}/${pollid}/${requestid}/${userid}`);
  }

  // Delete Question
  deletPolleQuestion(id) {
    return this.httpClient.delete(`${this.constants.REQRES_API_BASE_URL}${this.constants.REQRES_API_QUESTION_URL}/${id}`, httpOptions);
  }

  // Add Question
  addPollQuestion(question: Question): Observable<Question> {
    return this.httpClient.post<Question>(`${this.constants.REQRES_API_BASE_URL}${this.constants.REQRES_API_QUESTION_URL}/new`, question, httpOptions);
  }
}
