import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PollService } from '../../services/poll.service';
import { Poll } from 'src/app/models/Poll';
import { Router } from '@angular/router';

@Component({
  selector: 'app-poll-item',
  templateUrl: './poll-item.component.html',
  styleUrls: ['./poll-item.component.css']
})
export class PollItemComponent implements OnInit {
  @Input() poll: Poll;
  @Output() deletePoll: EventEmitter<Poll> = new EventEmitter();
  @Output() navigateQuestions: EventEmitter<Poll> = new EventEmitter();
  @Output() openModal: EventEmitter<Poll> = new EventEmitter();

  constructor(private pollService: PollService, private router: Router) { }

  ngOnInit() { 
  }

  onDelete(poll) {
    this.deletePoll.emit(poll);
  }

  onPollClick(poll){
    this.navigateQuestions.emit(poll);
  }

  onOpenInvitationDialog(poll){
    this.openModal.emit(poll);
  }

  openPollReportPage(poll){
    this.router.navigateByUrl(`/pollreport/${poll.id}`);
  }
}
