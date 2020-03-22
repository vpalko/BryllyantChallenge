import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm, FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-poll',
  templateUrl: './add-poll.component.html',
  styleUrls: ['./add-poll.component.css']
})
export class AddPollComponent implements OnInit {
  @ViewChild('f') gbForm: NgForm;
  @Output() addPoll: EventEmitter<any> = new EventEmitter();

  title: string;
  description: string;

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  onSubmit() {
    const poll = {
      name: this.title,
      description: this.description,
      authorid: this.userService.getUserInfo().id
    }

    this.addPoll.emit(poll);
    this.gbForm.reset();
  }

}
