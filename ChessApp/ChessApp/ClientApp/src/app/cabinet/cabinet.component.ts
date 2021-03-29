import { Component, OnInit, Inject } from '@angular/core';
import { DataProviderService } from '../data-provider.service';
import { User } from '../user';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.css'],
  providers: [DataProviderService]
})
export class CabinetComponent implements OnInit {

  public user: User = {};
  public username: string;

  constructor(private _router: Router,
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    private dataService: DataProviderService) { }

  ngOnInit() {
    this.user = this.dataService.getCurentUser();
    this.username = this.dataService.getCurentUser().login;
  }

  signOutBtn() {
    this.dataService.logOut();
    window.location.reload();
  }

  deleteBtn() {
    this.dataService.logOut();
    this.http.delete(this.baseUrl + 'api/Users' + '/' + this.user.userId, { observe: 'response' }).subscribe((data: HttpResponse<string>) => {
      console.log(data);
      if (data.body != null) {
        window.location.reload();
      }
      else
        alert("Some problem occured, please try later");
    });
  }

}
