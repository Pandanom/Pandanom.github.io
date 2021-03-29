import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../user';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html'
})
export class LeaderboardComponent implements OnInit{
  public users: User[] = [];

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
  }

  ngOnInit() {
    this.http.get<User[]>(this.baseUrl + 'api/Users/GetUsers').subscribe(result => {
      var CompareUsers = (u1: User, u2: User): number => {
        return u2.score - u1.score;
      }
      this.users = result;
      this.users.sort(CompareUsers);
      console.log("result log", result);
    }, error => console.error(error));
  }


}

