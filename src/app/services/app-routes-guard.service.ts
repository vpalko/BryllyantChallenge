
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';

// const MASS_ENROLL_DETAIL_URL = 'groups/massEnrollment/applicationDetail';


@Injectable({
  providedIn: 'root'
})
export class AppRoutesGuardService implements CanActivate {
  constructor(private router: Router, private userService: UserService ) {}

  canActivate(
    next: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ) {
    console.log("next", next);
    console.log("state", state);

    if(this.userService.isLoggedIn()){
      if(state.url.startsWith("/pollreport") && !this.userService.isAdmin()) {
        return false;
      }
      return true;
    } else {
      return this.router.parseUrl('/login');
    }
  }
}
