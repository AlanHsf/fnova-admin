import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-Notespace',
  templateUrl: './Notespace.component.html',
  styleUrls: ['./Notespace.component.scss']
})
export class NotespaceComponent implements OnInit {

  constructor(
    public authServ: AuthService,
    private router: Router
 
  ) { }

  ngOnInit() {
  }
  logOut(){
    this.authServ
    .logout()
    this.router.navigate(['/note-login']);

  }
}
