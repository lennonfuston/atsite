import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

import swal from 'sweetalert2';
import { AppComponent } from '../app.component';
import { UserService } from '../user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import SocketIOFileClient from 'socket.io-file-client';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-albuns',
  templateUrl: './albuns.component.html',
  styleUrls: ['./albuns.component.css']
})
export class AlbunsComponent implements OnInit {
  
  @ViewChild("inputAlbumLocal") inputAlbumLocal;
  @ViewChild("inputAlbumData") inputAlbumData;

  album: Object = {data: '', local: ''};
  canSave: boolean = true;
  App: AppComponent;
  uploader: SocketIOFileClient;

  albuns: Array<any> = [];

  constructor(private el: ElementRef, private http: Http, App: AppComponent, private user: UserService, private sanitizer: DomSanitizer) {
    this.App = App;
  }

  ngOnInit() {
    this.App.socket.on('albunsResponse', (data: any) => {
      this.App.responses(data);
      this.canSave = true;
      this.album['local'] = null;
      this.album['data'] = null;
      this.App.socket.emit('checkAlbuns');
    });
    this.App.socket.on('checkAlbunsResponse', (data: any) => {
      this.albuns = data.descricao;
    });
    this.App.socket.emit('checkAlbuns');
  }

  domSanitizer(link: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(link);
  }

  verAlbum(albumId: any, albumLocal: any, albumData: any) {
    this.App.goTo(['album', albumId, albumLocal, albumData], 'Álbum');
  }

  deleteAlbum(albumId: any, midiaId: any) {
    swal({
      title: 'Confirmação!',
      text: "Deseja apagar esse álbum?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.canSave = false;
        swal({
          title: 'Deletar!',
          text: 'Deletando Álbum...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          onOpen: () => {
            swal.showLoading()
          }
        });
        this.App.socket.emit('deleteAlbum', {albumId: albumId, midiaId: midiaId});
      }
    });
  }

  salvarAlbum() {
    swal({
      title: 'Confirmação!',
      text: "Deseja salvar álbum?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        var local = this.inputAlbumLocal.nativeElement.value;
        var data = this.inputAlbumData.nativeElement.value;
        if((local === "" || !local) || (data === "" || !data)) {
          swal("Erro!", "Preencha todos os campos!", "info");
          return;
        }
        this.canSave = false;
        swal({
          title: 'Carregando!',
          text: 'Salvando Novo Álbum...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          onOpen: () => {
            swal.showLoading()
          }
        });
        this.album['local'] = local;
        this.album['data'] = data;
        this.App.socket.emit('saveAlbum', this.album);
      }
    });
  }

}
