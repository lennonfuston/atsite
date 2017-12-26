import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { AppComponent } from '../app.component';
import { UserService } from '../user.service';

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.css']
})
export class NoticiaComponent implements OnInit {
  
  App: AppComponent;

  constructor(App: AppComponent, public user: UserService) {
    this.App = App;
  }

  ngOnInit() {}
}