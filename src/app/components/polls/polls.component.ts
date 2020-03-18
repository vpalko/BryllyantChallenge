import { Component, OnInit } from '@angular/core'; 
import { Constants } from '../../shared/constants';
import { PollService } from '../../services/poll.service';
import { Router } from '@angular/router';
import { Poll } from '../../models/Poll';

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.css']
})
export class PollsComponent implements OnInit {
  polls:Poll[];

  constructor(private pollService:PollService, private constants: Constants, private router: Router) { }

  ngOnInit() {
    this.pollService.getPolls().subscribe(polls => {
      this.polls = polls;
    });
  }

  navigateQuestions(poll:Poll){
    this.router.navigateByUrl(`/pollquestions/${poll.id}`);
  }

  deletePoll(poll:Poll) {
    // Remove From UI
    this.polls = this.polls.filter(t => t.id !== poll.id);
    // Remove from server
    this.pollService.deletePoll(poll.id).subscribe(
      data => {
          console.log("poll deleted");
      },
      error => {
        console.log("undable to delete poll");
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

  addPoll(poll:Poll) {
    this.pollService.addPoll(poll).subscribe(res => {
      let newPoll = {
        id: res['id'],
        name: res['name'],
        description: res['description'],
        authorid: res['authorid'],
        authorname: res['authorname']
      }

      if (!this.polls){
        this.polls = [newPoll];
      } else {
        this.polls.push(newPoll);
      }
    });
  }
}
