import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { UserService } from '../user.service';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms/src/directives/ng_form';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {

  canSave: boolean = true;
  App: AppComponent;
  public telefones: Array<any> = [{id: '', telefone: ''}];
  public emails: Array<any> = [{id: '', email: ''}];
  public endereco: string;
  // public endereco: Array<any> = [{endereco: ''}];

  constructor(App: AppComponent, private user: UserService) {
    this.App = App;
  }

  createTel() {
    this.telefones.push({id: null, telefone: ''});
  }
  deleteTel(telArray) {
    swal({
      title: 'Confirmação!',
      text: "Deseja apagar esse telefone?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.telefones.splice(telArray, 1);
      }
    });
  }
  eventsTelefones() {
    this.App.socket.on('checkTelefonesResponse', (data: any) => {
      this.telefones = data.descricao;
    });
    this.App.socket.on('telefonesResponse', (data: any) => {
      this.App.responses(data);
      this.canSave = true;
      this.App.socket.emit('checkTelefones');
    });
    this.App.socket.emit('checkTelefones');
  }


  createEmail() {
    this.emails.push({id: null, email: ''});
  }
  deleteEmail(emailArray) {
    swal({
      title: 'Confirmação!',
      text: "Deseja apagar esse email?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.emails.splice(emailArray, 1);
      }
    });
  }
  eventsEmails() {
    this.App.socket.on('checkEmailsResponse', (data: any) => {
      this.emails = data.descricao;
    });
    this.App.socket.on('emailsResponse', (data: any) => {
      this.App.responses(data);
      this.canSave = true;
      this.App.socket.emit('checkEmails');
    });
    this.App.socket.emit('checkEmails');
  }

  eventsEndereco() {
    this.App.socket.on('checkEnderecoResponse', (data: any) => {
      this.endereco = data.descricao.endereco;
    });
    this.App.socket.on('enderecoResponse', (data: any) => {
      this.App.responses(data);
      this.canSave = true;
      this.App.socket.emit('checkEndereco');
    });
    this.App.socket.emit('checkEndereco');
  }

  ngOnInit() {
    this.eventsTelefones();
    this.eventsEmails();
    this.eventsEndereco();
  }

  salvarTelefones(form: NgForm) {
    swal({
      title: 'Confirmação!',
      text: "Deseja salvar telefones?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.canSave = false;
        swal({
          title: 'Carregando!',
          text: 'Salvando Telefones...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          onOpen: () => {
            swal.showLoading()
          }
        });
        this.App.socket.emit('saveTelefones', this.telefones);
      }
    });
  }

  salvarEmails(form: NgForm) {
    swal({
      title: 'Confirmação!',
      text: "Deseja salvar emails?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.canSave = false;
        swal({
          title: 'Carregando!',
          text: 'Salvando Emails...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          onOpen: () => {
            swal.showLoading()
          }
        });
        this.App.socket.emit('saveEmails', this.emails);
      }
    });
  }

  salvarEndereco(form: NgForm) {
    swal({
      title: 'Confirmação!',
      text: "Deseja salvar endereço?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.canSave = false;
        swal({
          title: 'Carregando!',
          text: 'Salvando Endereço...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          onOpen: () => {
            swal.showLoading()
          }
        });
        this.App.socket.emit('saveEndereco', this.endereco);
      }
    });
  }

}
