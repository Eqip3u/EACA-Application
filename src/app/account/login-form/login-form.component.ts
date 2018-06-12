import { Component, OnInit, OnDestroy } from '@angular/core';
import { Credentials } from '../../../shared/models/credentials.interface';
import { UserService } from '../../../shared/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/internal/operators/finalize';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  registrationSucceeded: string;
  brandNew: boolean;
  errors: string;
  isRequesting: boolean;
  submitted = false;
  credentials: Credentials = { email: '', password: '' };

  constructor(private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.subscription = this.activatedRoute.queryParams.subscribe(
      (param: any) => {
        this.brandNew = param['brandNew'];
        this.credentials.email = param['email'];
        this.registrationSucceeded = param['result'];
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  login({ value, valid }: { value: Credentials, valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    if (valid) {
      this.userService.login(value.email, value.password)
        .pipe(finalize(() => this.isRequesting = false))
        .subscribe(
          result => {
            if (result) {
              this.router.navigate(['/']);
            }
          },
          error => this.errors = error
        );
    }
  }

}
