import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PollService } from '../../services/poll.service';

import { Poll } from 'src/app/models/Poll';

@Component({
  selector: 'app-poll-item',
  templateUrl: './poll-item.component.html',
  styleUrls: ['./poll-item.component.css']
})
export class PollItemComponent implements OnInit {
  @Input() poll: Poll;
  @Output() deletePoll: EventEmitter<Poll> = new EventEmitter();

  constructor(private pollService:PollService) { }

  ngOnInit() {
  }

  onToggle(poll) {
    // Toggle in UI
    poll.completed = !poll.completed;
    // Toggle on server
    this.pollService.toggleCompleted(poll).subscribe(poll => console.log(poll));
  }

  onDelete(poll) {
    this.deletePoll.emit(poll);
  }

}
