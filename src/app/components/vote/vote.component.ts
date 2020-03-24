import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../shared/constants';
import { PollService } from '../../services/poll.service';
import { UserService } from '../../services/user.service';
import { Question } from '../../models/Question';
import { QuestionService } from '../../services/question.service';
import * as lodash from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {
  questions: any;
  loginError: boolean = false;
  loading: boolean = true;
  msgBoxType = 0; // 0 - no message; 1 - success; 2 - info; 3 - warning; 4 - error
  msgBoxMessage = '';

  userName: string = '';
  pollName: string = '';
  pollDescription: string = '';

  pollid: number;
  requestid: number;
  userid: number;

  polldone: boolean = false;
  formsubmitted: boolean = false;
  pollsubmitted: boolean = false;
  pollsubmittedOn;
  pollsaving: boolean = false;
  pollsubmitting: boolean = false;
  totalQuestions: number = 0;
  totalAnswered: number = 0;

  constructor(
    private questionService: QuestionService,
    private constants: Constants,
    private pollService: PollService,
    private activeRoute: ActivatedRoute,
    private userService: UserService) { }

  ngOnInit(): void {
    // validate user
    let token = this.activeRoute.snapshot.params.id;

    this.userService.logintoken(token).subscribe(
      data => {
        this.userService.setUserInfo({
          id: data['id'],
          email: data['email'],
          phone: data['phone'],
          firstname: data['firstname'],
          lastname: data['lastname'],
          isadmin: data['isadmin'],
          token: data['token']
        });

        this.userName = `${data['lastname']}, ${data['firstname']}`;
        this.userid = data['id'];
        this.pollid = data['pollid'];
        this.requestid = data['requestid'];


        //update poll request status
        // 0 - none; 1 - viewes; 2 - in progress; 3 - complete
        let statusData = {
          pollrequestid: this.requestid,
          userid: this.userid,
          status: 1,
          force: false
        }
        this.pollService.updatePollRequestStatus(statusData).subscribe(res => {
          if (res.status === 3) {
            this.pollsubmitted = true;
            this.pollsubmittedOn = `${moment(res.updatedon).fromNow()} (${moment(res.updatedon).format('L')})`;
          }
        });

        this.pollService.getPoll(this.pollid).subscribe(
          data => {
            this.pollName = data[0].name;
            this.pollDescription = data[0].description;

            //load questions
            this.questionService.getQuestionsAnswers(this.pollid, this.requestid, this.userid).subscribe(questions => {
              this.questions = questions;
              this.totalQuestions = this.questions.length;
              this.getTotalAnswered();
              this.loading = false;
            });
          },
          error => {
            console.log("undable to load poll");
            this.loading = false;
          });

      },
      err => {
        this.loading = false;
        this.loginError = true;
        this.showMessageBox(4, 'Unable to login');
      });
  }

  showMessageBox(msgType, msgMessage) {
    this.msgBoxMessage = msgMessage;
    this.msgBoxType = msgType;
  }

  onClear() {
    this.showMessageBox(0, '');
  }

  answerQuestion(idx, event) {
    this.showMessageBox(0, '');

    this.questions[idx].answer = (event.target.textContent === "Yes") ? true : false;

    if (lodash.findIndex(this.questions, { 'answer': null }) === -1) {
      this.polldone = true;
    }

    this.getTotalAnswered();
  }


  getTotalAnswered(){
    let answeredQuestions = this.questions.filter((item) => (item.answer!==null && item.answer!==''));
    this.totalAnswered = answeredQuestions.length;
  }

  clearAnswers(){
    this.questions.forEach((item) => {
      item.answer = null;
    });
    this.getTotalAnswered();
  }

  saveAnswers(save: boolean) {
    this.showMessageBox(0, '');

    if (save === true) { // save
      this.pollsaving = true;
    } else { //submit/finish
      this.pollsubmitting = true;
    }


    //save answers
    let answersData = {
      pollid: this.pollid,
      pollrequestid: this.requestid,
      userid: this.userid,
      answers: this.questions.filter((question) => { return question.answer != null })
    }


    this.questionService.saveAnswers(answersData).subscribe(res => {
      //update poll request status
      // 0 - none; 1 - viewes; 2 - in progress; 3 - complete
      let statusData = {
        pollrequestid: this.requestid,
        userid: this.userid,
        status: save === true ? 2 : 3,
        force: true
      }

      this.pollService.updatePollRequestStatus(statusData).subscribe(res => {
        this.pollsaving = false;
        this.pollsubmitting = false;

        if (save === true) {
          this.showMessageBox(2, 'Poll answers saved successfully. You can continue now or later');
        } else {
          this.formsubmitted = true;
          this.showMessageBox(2, 'Poll answers submitted successfully. You are all done!');
        }
      });
    });
  }
}
