import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm, FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-add-poll-question',
  templateUrl: './add-poll-question.component.html',
  styleUrls: ['./add-poll-question.component.css']
})
export class AddPollQuestionComponent implements OnInit {
  @ViewChild('f') gbForm: NgForm;
  @Output() addPollQuestion: EventEmitter<any> = new EventEmitter();

  title: string;

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    const question = {
      question: this.title
    }

    this.addPollQuestion.emit(question);
    this.gbForm.reset();
  }

}
