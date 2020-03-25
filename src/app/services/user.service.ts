import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../shared/constants';
import { Router } from '@angular/router';

@Injectable()
export class UserService {
    constructor(private httpClient: HttpClient, private constants: Constants, private router: Router) { }

    // userInfo ={
    //     id: '',
    //     email: '',
    //     firstname: '',
    //     lastname: '',
    //     phone: '',
    //     pwd: '',
    //     isadmin: false,
    //     token: ''
    // };

    getUserInfo() {
        return JSON.parse(sessionStorage.getItem(this.constants.USER_INFO_SESSION_STORAGE));
    }

    isAdmin(){
        return JSON.parse(sessionStorage.getItem(this.constants.USER_INFO_SESSION_STORAGE)).isadmin;
    }

    setUserInfo(user) {
        sessionStorage.setItem(this.constants.USER_INFO_SESSION_STORAGE, JSON.stringify(user));

        // if (user.id)
        //     this.userInfo.id = user.id;
        // if (user.email)
        //     this.userInfo.email = user.email;
        // if (user.firstname)
        //     this.userInfo.firstname = user.firstname;
        // if (user.lastname)
        //     this.userInfo.lastname = user.lastname;
        // if (user.phone)
        //     this.userInfo.phone = user.phone;
        // if (user.pwd)
        //     this.userInfo.pwd = user.pwd;
        // if (user.isadmin)
        //     this.userInfo.isadmin = user.isadmin;
        // if (user.token)
        //     this.userInfo.token = user.token;
    }

    isLoggedIn(): boolean {
        let currentUser = this.getUserInfo();
        if (currentUser && currentUser.token) {
            return true;
        } else {
            return false;
        }
    }

    logout() {
        sessionStorage.removeItem(this.constants.USER_INFO_SESSION_STORAGE);
        this.router.navigate(['/login']);
    }

    login(email, pwd) {
        return this.httpClient.post(`${this.constants.REQRES_API_BASE_URL}${this.constants.REQRES_API_USER_URL}/login`, { email, pwd });
    }

    logintoken(token) {
        return this.httpClient.get(`${this.constants.REQRES_API_BASE_URL}${this.constants.REQRES_API_USER_URL}/login/${token}`);
    }
}
