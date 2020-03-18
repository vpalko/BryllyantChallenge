import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-poll',
  templateUrl: './add-poll.component.html',
  styleUrls: ['./add-poll.component.css']
})
export class AddPollComponent implements OnInit {

  @Output() addPoll: EventEmitter<any> = new EventEmitter();

  title: string;
  description: string;

  constructor(private userservice: UserService) { }

  ngOnInit() {
  }

  onSubmit() {
    const poll = {
      name: this.title,
      description: this.description,
      authorid: this.userservice.getUserInfo().id
    }

    this.addPoll.emit(poll);
  }

}
