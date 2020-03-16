import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../shared/constants';
// import * as lodash from 'lodash';
// import { map } from 'rxjs/operators';

@Injectable()
export class UserService {
    constructor(private httpClient: HttpClient, private constants: Constants,) { }

    userInfo ={
        id: '',
        email: '',
        firstname: '',
        lastname: '',
        phone: '',
        pwd: '',
        isadmin: false,
        token: ''
    };

    getUserInfo() {
        return this.userInfo;
    }

    setUserInfo(user) {
        if (user.id)
            this.userInfo.id = user.id;
        if (user.email)
            this.userInfo.email = user.email;
        if (user.firstname)
            this.userInfo.firstname = user.firstname;
        if (user.lastname)
            this.userInfo.lastname = user.lastname;
        if (user.phone)
            this.userInfo.phone = user.phone;
        if (user.pwd)
            this.userInfo.pwd = user.pwd;
        if (user.isadmin)
            this.userInfo.isadmin = user.isadmin;
        if (user.token)
            this.userInfo.token = user.token;
    }

    isLoggedIn(): boolean {
        if (this.userInfo && this.userInfo.token) {
            return true;
        } else {
            return false;
        }
    }

    // logout() {
    //     // remove user from local storage and set current user to null
    //     localStorage.removeItem('currentUser');
    //     this.currentUserSubject.next(null);
    // }


    login(email, password) {
        this.httpClient.post(this.constants.REQRES_API_BASE_URL + this.constants.REQRES_API_USER_URL + '/login',
          {
            "email": email,
            "pwd": password
          })
          .subscribe(
            res => {
                if (res['id'])
                    this.userInfo.id = res['id'];
                if (res['email'])
                    this.userInfo.email = res['email'];
                if (res['firstname'])
                    this.userInfo.firstname =res['firstname'];
                if (res['lastname'])
                    this.userInfo.lastname = res['lastname'];
                if (res['phone'])
                    this.userInfo.phone = res['phone'];
                if (res['pwd'])
                    this.userInfo.pwd = res['pwd'];
                if (res['isadmin'])
                    this.userInfo.isadmin = res['isadmin'];
                if (res['token'])
                    this.userInfo.token = res['token'];
            },
            error => {
            //   this.showMessageBox(4, 'Unable to save new user');
            }
          );
      }


}
