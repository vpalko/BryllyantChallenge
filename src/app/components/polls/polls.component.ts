import { Component, OnInit } from '@angular/core';
import { PollService } from '../../services/poll.service';

import { Poll } from '../../models/Poll';

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.css']
})
export class PollsComponent implements OnInit {
  polls:Poll[];

  constructor(private pollService:PollService) { }

  ngOnInit() {
    this.pollService.getPolls().subscribe(polls => {
      this.polls = polls;
    });
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
