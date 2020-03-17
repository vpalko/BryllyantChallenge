import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Constants } from '../../shared/constants';
import { PollService } from '../../services/poll.service';

import { Poll } from '../../models/Poll';

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.css']
})
export class PollsComponent implements OnInit {
  polls:Poll[];

  @ViewChild('f') gbForm: NgForm;
  pollForm: FormGroup;
  formState = 0; //0 - initial (Find Poll), 1 - veiw poll, 2 - edit poll, 3 - new poll
  msgBoxType = 0; // 0 - no message; 1 - success; 2 - info; 3 - warning; 4 - error
  msgBoxMessage = '';
  pollIsValid: boolean = true;
  pollInfo;

  pollid: number;
  pollname: string;
  polldescription: string;

  constructor(private pollService:PollService, private formBuilder: FormBuilder, private constants: Constants) { }

  ngOnInit() {
    this.pollService.getPolls().subscribe(polls => {
      this.polls = polls;
      this.buildFormComponents();
    });
  }

  buildFormComponents() {
    this.pollForm = this.formBuilder.group({
      pollNameControl: [{ value: '', disabled: true },
      [
        Validators.required,
        Validators.maxLength(this.constants.POLL_NAME_MAX_LENGTH)
      ]],
      descriptionControl: [{ value: '', disabled: true },
      [
        Validators.required,
        Validators.maxLength(this.constants.POLL_DESCRIPTION_NAME_MAX_LENGTH)
      ]]
    });
  }

  onClear() {
    this.showMessageBox(0, '');
    this.pollForm.reset();
    this.formState = 0;
    this.enableFormControls();
  }

  enableFormControls() {
    if (this.formState === 0 || this.formState === 1) {//initial state or user found
      this.pollForm.controls['pollNameControl'].disable();
      this.pollForm.controls['descriptionControl'].disable();

    } else if (this.formState === 2 || this.formState === 3) {//edit or new
      this.pollForm.controls['pollNameControl'].enable();
      this.pollForm.controls['descriptionControl'].enable();
    }
  }

  showMessageBox(msgType, msgMessage) {
    this.msgBoxMessage = msgMessage;
    this.msgBoxType = msgType;
  }

  deletePoll(poll:Poll) {
    // Remove From UI
    this.polls = this.polls.filter(t => t.id !== poll.id);
    // Remove from server
    this.pollService.deletePoll(poll).subscribe();
  }

  addPoll(poll:Poll) {
    this.pollService.addPoll(poll).subscribe(poll => {
      this.polls.push(poll);
    });
  }

}
