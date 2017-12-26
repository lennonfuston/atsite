import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { AppComponent } from '../app.component';
import { UserService } from '../user.service';
import swal from 'sweetalert2';
import { FormControl } from '@angular/forms/src/model';

@Component({
  selector: 'app-painel',
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.css'],
})
export class PainelComponent implements OnInit {
  
  rForm: ElementRef;

  canSave: boolean = true;
  App: AppComponent;

  cabecalho: any = {
    text: ''
  }

  biografia: any = {
    text: ''
  }

  redesocial: Array<any> = [
    {'text': '', 'tipo': 'y'},
    {'text': '', 'tipo': 'f'},
    {'text': '', 'tipo': 's'},
    {'text': '', 'tipo': 'i'},
    {'text': '', 'tipo': 't'}
  ]

  public agenda: Array<any> = [{data: '', localizacao: ''}];

  constructor(App: AppComponent, private user: UserService) {
    this.App = App;
  }

  createDate() {
    this.agenda.push({id: null, data: '', localizacao: ''});
  }

  deleteDate(dateArray) {
    swal({
      title: 'Confirmação!',
      text: "Deseja apagar esse dia?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.agenda.splice(dateArray, 1);
      }
    });
  }

  eventsCabecalho() {
    this.App.socket.on('checkCabecalhoResponse', (data: any) => {
      this.cabecalho['text'] = data.descricao.text;
    });
    this.App.socket.on('cabecalhoResponse', (data: any) => {
      this.App.responses(data);
      this.canSave = true;
      this.App.socket.emit('checkCabecalho');
    });
    this.App.socket.emit('checkCabecalho');
  }

  eventsBiografia() {
    this.App.socket.on('checkBiografiaResponse', (data: any) => {
      this.biografia['text'] = data.descricao.text;
    });
    this.App.socket.on('biografiaResponse', (data: any) => {
      this.App.responses(data);
      this.canSave = true;
      this.App.socket.emit('checkBiografia');
    });
    this.App.socket.emit('checkBiografia');
  }

  eventsAgenda() {
    this.App.socket.on('checkAgendaResponse', (data: any) => {
      this.agenda = data.descricao;
    });
    this.App.socket.on('agendaResponse', (data: any) => {
      this.App.responses(data);
      this.canSave = true;
      this.App.socket.emit('checkAgenda');
    });
    this.App.socket.emit('checkAgenda');
  }

  eventsRedesocial() {
    this.App.socket.on('checkRedesocialResponse', (data: any) => {
      this.redesocial = data.descricao;
    });
    this.App.socket.on('redesocialResponse', (data: any) => {
      this.App.responses(data);
      this.canSave = true;
      this.App.socket.emit('checkRedesocial');
    });
    this.App.socket.emit('checkRedesocial');
  }

  ngOnInit() {
    this.eventsCabecalho();
    this.eventsBiografia();
    this.eventsAgenda();
    this.eventsRedesocial();
  }

  salvarCabecalho() {
    swal({
      title: 'Confirmação!',
      text: "Deseja salvar cabeçalho?",
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
          text: 'Salvando Cabeçalho...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          onOpen: () => {
            swal.showLoading()
          }
        });
        this.App.socket.emit('saveCabecalho', this.cabecalho['text']);
      }
    });
  }

  salvarBiografia() {
    swal({
      title: 'Confirmação!',
      text: "Deseja salvar biografia?",
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
          text: 'Salvando Biografia...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          onOpen: () => {
            swal.showLoading()
          }
        });
        this.App.socket.emit('saveBiografia', this.biografia['text']);
      }
    });
  }

  salvarRedeSocial() {
    swal({
      title: 'Confirmação!',
      text: "Deseja salvar redes sociais?",
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
          text: 'Salvando Biografia...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          onOpen: () => {
            swal.showLoading()
          }
        });
        this.App.socket.emit('saveRedesocial', this.redesocial);
      }
    });
  }

  salvarAgenda(form: NgForm) {
    swal({
      title: 'Confirmação!',
      text: "Deseja salvar agenda?",
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
          text: 'Salvando Agenda...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          onOpen: () => {
            swal.showLoading()
          }
        });
        this.App.socket.emit('saveAgenda', this.agenda);
      }
    });
  }
  
}