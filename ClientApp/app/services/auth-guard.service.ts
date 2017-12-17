import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuardService implements CanActivate {
  
  constructor(protected auth: AuthService) { }

  canActivate(): boolean {
    if (this.auth.isAuthenticated())
      return true;
    
    window.location.href = 'https://veganew.auth0.com/login?client=MWFEOJEznt7VApnQAxZWpTQfTqRVqUK4';
    return false;
  }

}
