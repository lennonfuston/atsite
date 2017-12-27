import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as io from 'socket.io-client';
import { LoginComponent } from './login/login.component';
import swal from 'sweetalert2';
import { UserService } from './user.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public serverNode: string = '149.56.74.5:3000';
  public socket: SocketIOClient.Socket;

  yearDate: any = new Date().getFullYear();
  title: string;
  messageText: string;
  currentUrl: string;
  public countmessages: any;

  constructor(private router:Router, public user: UserService) {
   this.title = 'Angelo&Thiago';
   this.currentUrl = '';
   this.countmessages = '';
  }

  goTo(url:Array<any>, name:string = null){
    this.currentUrl = name;
    this.title = name;
    this.router.navigate(url);
  }

  deslogar() {
    this.user.setUserLoggedIn(false);
    this.goTo(['login'], 'Login');
  }

  responses(data){
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
    });
  }

  ngOnInit() {
    this.socket = io.connect(this.serverNode);
    this.socket.on('waitingMensagemResponse', (data: any) => {
      this.socket.emit('getCountMessagens');
    });
    this.socket.on('countMensagemResponse', (data: any) => {
      this.countmessages = data.descricao;
    });
    this.socket.emit('getCountMessagens');
  }
}