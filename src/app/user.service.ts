import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  private isUserLoggedIn: boolean;
  private username: string;

  constructor() {
    this.isUserLoggedIn = false;
  }

  setUserLoggedIn(b:boolean) {
    this.isUserLoggedIn = b;
  }

  getUserLoggedIn() {
    return this.isUserLoggedIn;
  }

}
