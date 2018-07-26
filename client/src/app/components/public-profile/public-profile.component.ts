import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {

  currentUrl;
  user;
  username;
  email;
  foundProfile= false;
  message;
  messageClass;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.authService.getPublicProfile(this.currentUrl.username).subscribe(data => {
           if(!data.success){
             this.message = data.message;
             this.messageClass = 'alert alert-danger';
           } else{
            this.username = data.user.username;
            this.email = data.user.email;
            this.foundProfile = true;
            console.log(data);
           }
    });
  }

}
