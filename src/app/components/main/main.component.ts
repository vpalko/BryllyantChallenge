import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../shared/constants';
import { User } from './services/user.model';
import * as moment from 'moment';
import * as lodash from 'lodash';

@Component({ 
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  users: User[] = [];

  @ViewChild('f') gbForm: NgForm;
  userForm: FormGroup;
  phoneMask = this.constants.PHONE_MASK;
  dateMask = this.constants.DATE_MASK;
  formState = 0; //0 - initial (Find User), 1 - veiw user, 2 - edit user, 3 - new user
  msgBoxType = 0; // 0 - no message; 1 - success; 2 - info; 3 - warning; 4 - error
  msgBoxMessage = '';
  userIsValid: boolean = true;
  userInfo;

  userid: number;
  firstname: string;
  lastname: string;
  address: string;
  phone: number;
  email: string;
  pwd: string;
  isadmin: boolean;

  isAdminOptions = [
    {value: true, label: 'Yes'},
    {value: false, label: 'No'}
  ];

  constructor(
    private constants: Constants,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient
  ) { }

  ngOnInit() {
    this.loadUsers();
    this.buildFormComponents();
  }

  // countryForm: FormGroup;

  buildFormComponents() {
    this.userForm = this.formBuilder.group({
      firstNameControl: [{ value: '', disabled: true },
      [
        Validators.required,
        Validators.pattern(this.constants.NAME_PATTERN),
        Validators.maxLength(this.constants.FIRST_NAME_MAX_LENGTH)
      ]],
      lastNameControl: [{ value: '', disabled: true },
      [
        Validators.required,
        Validators.pattern(this.constants.NAME_PATTERN),
        Validators.maxLength(this.constants.LAST_NAME_MAX_LENGTH)
      ]],
      phoneControl: [{ value: '', disabled: true },
      [
        Validators.required,
        Validators.pattern(this.constants.PHONE_FORMAT_PATTERN),
        Validators.minLength(this.constants.PHONE_MIN_LENGTH)
      ]],
      emailControl: [{ value: '', disabled: true },
      [
        Validators.required,
        Validators.pattern(this.constants.EMAIL_PATTERN),
        // this.dateValidator
      ]],
      isAdminControl: [{ value: '', disabled: true },
      [
        Validators.required
      ]]
    });
  }

  dateValidator(control: FormControl) {
    let valueToCheck = control.value;

    var d = moment(valueToCheck, 'M/D/YYYY');
    if (d == null || !d.isValid()) {
      return { 'invalid': true };
    } else {
      return (valueToCheck.indexOf(d.format('M/D/YYYY')) >= 0
        || valueToCheck.indexOf(d.format('MM/DD/YYYY')) >= 0
        || valueToCheck.indexOf(d.format('M/D/YY')) >= 0
        || valueToCheck.indexOf(d.format('MM/DD/YY')) >= 0) ? null : { 'invalid': true };
    }
  }

  onClear() {
    this.showMessageBox(0, '');
    this.gbForm.reset();
    this.formState = 0;
    this.enableFormControls();
  }


  enableFormControls() {
    if (this.formState === 0 || this.formState === 1) {//initial state or user found
      this.userForm.controls['firstNameControl'].disable();
      this.userForm.controls['lastNameControl'].disable();
      this.userForm.controls['phoneControl'].disable();
      this.userForm.controls['emailControl'].disable();
      this.userForm.controls['isAdminControl'].disable();

    } else if (this.formState === 2 || this.formState === 3) {//edit or new
      this.userForm.controls['firstNameControl'].enable();
      this.userForm.controls['lastNameControl'].enable();
      this.userForm.controls['phoneControl'].enable();
      this.userForm.controls['emailControl'].enable();
      this.userForm.controls['isAdminControl'].enable();
    }
  }

  showMessageBox(msgType, msgMessage) {
    this.msgBoxMessage = msgMessage;
    this.msgBoxType = msgType;
  }

  newUser() {
    this.onClear();
    this.formState = 3;
    this.enableFormControls();
  }

  editUser() {
    this.formState = 2;
    this.enableFormControls();
  }

  loadUser(id){
    this.showMessageBox(0, '');
    this.formState = 1;
    
    this.userid = this.users[id].userid;
    this.email = this.users[id].email;
    this.firstname = this.users[id].firstname;
    this.lastname = this.users[id].lastname;
    this.phone = this.users[id].phone;
    this.pwd = this.users[id].pwd;
    this.isadmin = this.users[id].isadmin;
  }

  loadUsers() {
    this.httpClient.get(`${this.constants.REQRES_API_BASE_URL}${this.constants.REQRES_API_USER_URL}`).subscribe((res) => {

      if (Object.keys(res).length != 0) {
        for (let i = 0; i < Object.keys(res).length; i++) {
          this.users.push(new User(
            res[i].id, 
            res[i].email,
            res[i].firstname, 
            res[i].lastname,
            res[i].phone,
            res[i].pwd,
            res[i].isadmin
            ));
        }
      }
    },
      (error) => {

      });
  }

  deleteUser() {
    if (this.userid === 1){
      this.showMessageBox(3, 'You cannot delete root Administrator account');
    } else {
      this.httpClient.delete(`${this.constants.REQRES_API_BASE_URL}${this.constants.REQRES_API_USER_URL}/${this.userid}`)
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
    }
  }

  saveUser(){
    if(this.formState===2){//edit user
      this.updateUser();
    } else if(this.formState===3){//new user
      this.createUser();
    }
  }

  createUser() {
    this.httpClient.post(`${this.constants.REQRES_API_BASE_URL}${this.constants.REQRES_API_USER_URL}/new`,
      {
        "email": this.email,
        "pwd": this.pwd,
        "phone": this.phone,
        "firstname": this.firstname,
        "lastname": this.lastname,
        "isadmin": this.isadmin
      })
      .subscribe(
        res => {
          this.users.push(new User(
            res['id'], 
            res['email'],
            res['pwd'],
            res['phone'],
            res['firstname'], 
            res['lastname'],
            res['isadmin']
            ));

            this.userid = res['id'];
            this.email = res['email'];
            this.pwd = res['pwd'];
            this.phone = res['phone'];
            this.firstname = res['firstname'];
            this.lastname = res['lastname'];
            this.isadmin = res['isadmin'];

          this.formState = 1;
          this.enableFormControls();
          this.showMessageBox(1, 'User created successfully');
        },
        error => {
          this.showMessageBox(4, 'Unable to save new user');
        }
      );
  }

  unmask(val) {
    return val.replace(/[- )(]/g,'');
  }

  updateUser() {
    this.httpClient.put(`${this.constants.REQRES_API_BASE_URL}${this.constants.REQRES_API_USER_URL}/${this.userid}`,
      {
        "id": this.userid,
        "email": this.email,
        "pwd": this.pwd,
        "phone": this.unmask(this.phone),
        "firstname": this.firstname,
        "lastname": this.lastname,
        "isadmin": this.isadmin
      })
      .subscribe(
        data => {
          let userIdx = lodash.findIndex(this.users, {'userid': this.userid});
          if(userIdx!=-1){
            this.users[userIdx].email = this.email;
            this.users[userIdx].pwd = this.pwd;
            this.users[userIdx].phone = this.phone;
            this.users[userIdx].firstname = this.firstname;
            this.users[userIdx].lastname = this.lastname;
            this.users[userIdx].isadmin = this.isadmin;
          }

          this.formState = 1;
          this.enableFormControls();
          this.showMessageBox(1, 'User updated successfully');
        },
        error => {
          this.showMessageBox(4, 'Unable to update user info');
        }
      );
  }
}
