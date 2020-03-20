import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-poll-question',
  templateUrl: './add-poll-question.component.html',
  styleUrls: ['./add-poll-question.component.css']
})
export class AddPollQuestionComponent implements OnInit {

  @Output() addPollQuestion: EventEmitter<any> = new EventEmitter();

  title: string;

  constructor(private userservice: UserService) { }

  ngOnInit() {
  }

  onSubmit() {
    const question = {
      question: this.title
    }

    this.addPollQuestion.emit(question);
  }

}
