import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from 'src/service/authenticate.service';
import { AppLoadService } from 'src/service/app-load.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  expanded: boolean = true;
  saveUsername:boolean = false;
  loggedIn_User = "User";
  constructor(private authenticateService: AuthenticateService, private _appLoadService: AppLoadService ) { 
     _appLoadService.initializeApp();
    this.loggedIn_User = this.authenticateService.getUserName()
    localStorage.setItem("user_name",this.loggedIn_User);
  }

  ngOnInit() {
  }

}
