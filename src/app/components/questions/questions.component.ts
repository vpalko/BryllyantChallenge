import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../shared/constants';
import { QuestionService } from '../../services/question.service';
import { Router } from '@angular/router';
import { Question } from '../../models/Question';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  questions: Question[];
  pollid;

  constructor(private questionService: QuestionService, private constants: Constants, private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.pollid = this.activeRoute.snapshot.params.id;
    this.questionService.getQuestions(this.pollid).subscribe(questions => {
      this.questions = questions;
    });
  }

  deletPolleQuestion(question: Question) {
    // Remove From UI
    this.questions = this.questions.filter(t => t.id !== question.id);
    // Remove from server
    this.questionService.deletPolleQuestion(question.id).subscribe(
      data => {
        console.log("question deleted");
      },
      error => {
        console.log("undable to delete question");
      });


    /*
    
          .subscribe(
            data => {
              let userIdx = lodash.findIndex(this.users, {'userid': this.userid});
              if(userIdx!=-1){
                this.users.splice(userIdx, 1);
              }
    
              this.onClear();
              this.showMessageBox(1, 'User deleted successfully');
            },
            error => {
              this.showMessageBox(4, 'Unable to delete the user');
            }
          );
    */


  }

  addPollQuestion(question: Question) {
    question.pollid = this.pollid;
    this.questionService.addPollQuestion(question).subscribe(res => {
      let newQuestion = {
        id: res['id'],
        pollid: res['pollid'],
        question: res['question']
      }

      if (!this.questions) {
        this.questions = [newQuestion];
      } else {
        this.questions.push(newQuestion);
      }
    });
  }
}
