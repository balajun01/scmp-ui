import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor() { }

  
  private userName: string;
  public domain: string;

  setUserDetails(uDetails: any) {
      if (uDetails) {
          this.userName = uDetails.user_name;
      }
  }

  getUserName(): string {
      return this.userName;
  }

  isAuthenticated(): boolean {
      return (this.userName && this.userName !== '');
  }

}
