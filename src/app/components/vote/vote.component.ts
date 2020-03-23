import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../shared/constants';
import { PollService } from '../../services/poll.service';
import { UserService } from '../../services/user.service';
import { Question } from '../../models/Question';
import { QuestionService } from '../../services/question.service';
import * as lodash from 'lodash';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {
  questions: Question[];
  loginError: boolean = false;
  loading: boolean = true;
  msgBoxType = 0; // 0 - no message; 1 - success; 2 - info; 3 - warning; 4 - error
  msgBoxMessage = '';

  constructor(
    private questionService: QuestionService,
    private constants: Constants,
    private pollService: PollService,
    private activeRoute: ActivatedRoute,
    private userService: UserService) { }

  ngOnInit(): void {
    // validate user
    let token = this.activeRoute.snapshot.params.id;
    console.log(token);
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


        //update poll request status
        let statusData = {
          pollrequestid: data['requestid'],
          userid: data['id'],
          status: 1,
          force: false
        }
        this.pollService.updatePollRequestStatus(statusData).subscribe(res => {
          console.log(res['msg']);
          // let msg = '';
          // for (let i = 0; i < res['url'].length; i++) {
          //   msg += `${window.location.protocol}//${window.location.hostname}`;

          //   if(window.location.port){
          //     msg += `:${window.location.port}`;
          //   }

          //   msg += `${this.constants.REQRES_API_VOTE_URL}/${res['url'][i]}\n`
          // }

          // this.showMessageBox(2, `Users notified: \n ${msg}`);
        });


        // make new API to load questions with already answered questions
        // this.questionService.getQuestions(data['pollid']).subscribe(questions => {
        //   this.questions = questions;
        // });

        this.loading = false;
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
}
