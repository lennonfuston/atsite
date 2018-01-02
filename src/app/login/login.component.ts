import { Component, OnInit, AfterViewInit, NgModule, VERSION, ViewChild, ElementRef } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser'
import { AppComponent } from '../app.component';
import swal from 'sweetalert2';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild("inputUsuario") inputEl: ElementRef;

  login: any;
  App: AppComponent;

  constructor(App: AppComponent, private user: UserService) {
    this.App = App;
    this.login = {
      usuario: '',
      senha: ''
    }
  }

  ngOnInit() {
    this.user.setUserLoggedIn(false);
    this.App.socket.on('loginResponse', (data: any) => {
      if(!data) {
        swal({
          title: 'Erro!',
          text: 'Erro de conexão com o servidor.',
          type: 'error',
          allowOutsideClick: false,
          allowEscapeKey: false,
          onOpen: () => {
            swal.hideLoading()
          }
        });
        return;
      }
      if(data.error){
        swal({
          title: 'Erro!',
          text: data.descricao,
          type: 'error',
          allowOutsideClick: false,
          allowEscapeKey: false,
          onOpen: () => {
            swal.hideLoading()
          }
        });
        return;
      }
      swal({
        title: 'Sucesso!',
        text: data.descricao,
        type: 'success',
        allowOutsideClick: false,
        allowEscapeKey: false,
        onOpen: () => {
          swal.hideLoading()
        }
      }).then(() => {
        
        this.user.setUserLoggedIn(true);
        this.App.goTo(['painel'], 'Painel');

      });
    });

    if(!this.user.getUserLoggedIn()){
      this.App.goTo(['login'], 'Login');
    }
  }

  ngAfterViewInit() {
    this.inputEl.nativeElement.focus();
  }

  register () {
    swal({
      title: 'Carregando!',
      text: 'Logando...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      onOpen: () => {
        swal.showLoading()
      }
    });
    this.App.socket.emit('tryLogin', this.login);
  }

}
