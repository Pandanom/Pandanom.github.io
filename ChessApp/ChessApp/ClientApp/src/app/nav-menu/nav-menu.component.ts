import { Component, OnInit} from '@angular/core';
import { DataProviderService } from '../data-provider.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css'],
  providers: [DataProviderService]
})
export class NavMenuComponent implements OnInit {

  public username: string;

  constructor(private dataService: DataProviderService) {   
  }


  ngOnInit() {
    this.username = this.dataService.getCurentUser().login;
  }

}
