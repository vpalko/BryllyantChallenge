
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';

// const MASS_ENROLL_DETAIL_URL = 'groups/massEnrollment/applicationDetail';


@Injectable({
  providedIn: 'root'
})
export class AppRoutesGuardService implements CanActivate {
  constructor(private router: Router, private userservice: UserService ) {}

  canActivate(
    next: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ) {
    console.log("next", next);
    console.log("state", state);

    if(this.userservice.isLoggedIn()){
      return true;
    } else {
      // this.router.navigateByUrl('/notauthorized');
      // return false;
      return this.router.parseUrl('/login');
    }
  }
}
