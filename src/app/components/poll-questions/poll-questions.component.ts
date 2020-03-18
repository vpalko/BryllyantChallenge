import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { Question } from 'src/app/models/Question';

@Component({
  selector: 'app-poll-questions',
  templateUrl: './poll-questions.component.html',
  styleUrls: ['./poll-questions.component.css']
})
export class PollQuestionsComponent implements OnInit {
  @Input() question: Question;
  @Output() deleteQuestion: EventEmitter<Question> = new EventEmitter();
  @Output() navigateQuestions: EventEmitter<Question> = new EventEmitter();

  constructor(private questionService: QuestionService) { }

  ngOnInit() {
  }

  onDelete(poll) {
    this.deleteQuestion.emit(poll);
  } 
}
