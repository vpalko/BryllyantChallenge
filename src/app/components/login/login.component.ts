import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Constants } from '../../shared/constants';
// import { first } from 'rxjs/operators';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    loginError: boolean = false;
    msgBoxMessage: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private userservice: UserService,
        private constants: Constants
    ) {
        // redirect to home if already logged in
        if (this.userservice.isLoggedIn()) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],             //Validators.pattern(this.constants.EMAIL_PATTERN)
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.loginError = false;
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.userservice.login(this.f.email.value, this.f.password.value).subscribe(
            data => {
                this.userservice.setUserInfo(data);
                this.router.navigate(['/']);
            },
            err => {
                this.loading = false;
                this.loginError = true;
                this.msgBoxMessage = 'Unable to login';
            });
    }
}
