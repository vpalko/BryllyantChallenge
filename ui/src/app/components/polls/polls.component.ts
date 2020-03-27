import { Component, OnInit } from '@angular/core';
import { Constants } from '../../shared/constants';
import { PollService } from '../../services/poll.service';
import { Router } from '@angular/router';
import { Poll } from '../../models/Poll';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import * as lodash from 'lodash';

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.css']
})
export class PollsComponent implements OnInit {
  polls: Poll[];
  title = 'appBootstrap';
  closeResult: string;
  users = [];
  usersLoaded: boolean = false;
  isUserSelected: boolean = true;
  msgBoxType = 0; // 0 - no message; 1 - success; 2 - info; 3 - warning; 4 - error
  msgBoxMessage = '';

  constructor(
    private pollService: PollService,
    private constants: Constants,
    private router: Router,
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private userService: UserService) { }

  ngOnInit() {
    this.pollService.getPolls().subscribe(polls => {
      this.polls = polls;
    });
  }

  showMessageBox(msgType, msgMessage) {
    this.msgBoxMessage = msgMessage;
    this.msgBoxType = msgType;
  }

  onClear() {
    this.showMessageBox(0, '');
  }

  navigateQuestions(poll: Poll) {
    this.router.navigateByUrl(`/pollquestions/${poll.id}`);
  }


  deletePoll(poll: Poll) {
    this.onClear();

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
  }

  addPoll(poll: Poll) {
    this.onClear();

    this.pollService.addPoll(poll).subscribe(res => {
      let newPoll = {
        id: res['id'],
        name: res['name'],
        description: res['description'],
        authorid: res['authorid'],
        authorname: res['authorname']
      }

      if (!this.polls) {
        this.polls = [newPoll];
      } else {
        this.polls.push(newPoll);
      }
    });
  }

  openModal(content, poll: Poll) {
    this.onClear();
    this.loadUsers();

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log(`Closed with: ${result}`);

      //send emails....
      if (result === "Send click") {
        let pollRequest = {
          pollid: poll.id,
          sentby: this.userService.getUserInfo().id,
          userid: lodash.chain(this.users)
            .filter(usr => usr.checked)
            .map(function (object) {
              return { 
                id: object.id, 
                email: object.email, 
                phone: object.phone, 
                firstname: object.firstname, 
                lastname: object.lastname, 
                isadmin: object.isadmin };
            })
            .value()
        }

        this.pollService.sendInvitation(pollRequest).subscribe(res => {
          let msg = '';
          for (let i = 0; i < res['url'].length; i++) {
            msg += `${window.location.protocol}//${window.location.hostname}`;

            if(window.location.port){
              msg += `:${window.location.port}`;
            }

            msg += `${this.constants.REQRES_API_VOTE_URL}/${res['url'][i]}\n`
          }

          this.showMessageBox(2, `Users notified: \n ${msg}`);
        });
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log(`Dismissed ${this.getDismissReason(reason)}`);
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      console.log('by pressing ESC');
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      console.log('by clicking on a backdrop');
      return 'by clicking on a backdrop';
    } else {
      console.log(`with: ${reason}`);
      return `with: ${reason}`;
    }
  }

  loadUsers() {
    this.onClear();
    if (this.users.length != 0) return;

    this.usersLoaded = false;
    this.httpClient.get(`${this.constants.REQRES_API_BASE_URL}${this.constants.REQRES_API_USER_URL}`).subscribe((res) => {

      // this.users = res;
      if (Object.keys(res).length != 0) {
        for (let i = 0; i < Object.keys(res).length; i++) {
          res[i].checked = true;
          this.users.push(res[i]);
        }
      }
      this.usersLoaded = true;
    },
      (error) => {
        this.usersLoaded = true;
      });
  }

  onCheckboxChange(id, event) {
    this.users[id].checked = !this.users[id].checked;
    this.isUserSelected = lodash.some(this.users, { "checked": true }); //enable Send button if at least one user selected
  }
}
