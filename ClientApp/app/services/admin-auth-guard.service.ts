import { Injectable } from '@angular/core';
import { AuthGuardService } from './auth-guard.service';
import { AuthService } from './auth.service';

@Injectable()
export class AdminAuthGuardService extends AuthGuardService {

  constructor(auth: AuthService) {
    super(auth);
  }

  canActivate(): boolean {
    var isAuthenticated = super.canActivate();
    
    return isAuthenticated ? this.auth.isInRole('Admin') : false;
  }

}
