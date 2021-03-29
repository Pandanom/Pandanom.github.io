import { Injectable} from '@angular/core';
import { User } from './user';

@Injectable()
export class DataProviderService {
 
  userKey: string = 'user';

  constructor() { }

  getCurentUser() {
    var user = {} as User;
    if (localStorage.getItem(this.userKey) != null)
      user = JSON.parse(localStorage.getItem(this.userKey));
    else {
      user.email = '';
      user.login = '';
      user.password = 0;
      user.score = 0;
      user.userId = 0;
    }
    return user;
  }

  saveUser(user : User) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  logOut() {
    var user = {} as User;
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

}
