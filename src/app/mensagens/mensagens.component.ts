import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { UserService } from '../user.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-mensagens',
  templateUrl: './mensagens.component.html',
  styleUrls: ['./mensagens.component.css']
})
export class MensagensComponent implements OnInit {
  
  App: AppComponent;
  public mensagens: Array<any> = [{id: '', nome: '', assunto: '', email: '', mensagem: ''}];

  constructor(App: AppComponent, private user: UserService) {
    this.App = App;
    this.mensagens = this.App.countmessages;
  }

  ngOnInit() {
    this.App.socket.on('waitingMensagemResponse', (data: any) => {
      this.App.socket.emit('getCountMessagens');
    });
    this.App.socket.on('countMensagemResponse', (data: any) => {
      this.mensagens = data.descricao;
    });
    this.App.socket.emit('getCountMessagens');
  }

  deleteMensagem(id: string) {
    swal({
      title: 'Confirmação!',
      text: "Deseja apagar essa mensagem?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.App.socket.emit('deleteMensagem', {id: id});
      }
    });
  }

}
