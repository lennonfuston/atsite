import { Component, OnInit, OnDestroy, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import swal from 'sweetalert2';
import { AppComponent } from '../app.component';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit, OnDestroy {

  @ViewChild("inputAlbumFoto") inputAlbumFoto;

  album: any = [];
  albumId: any;
  albumLocal: any;
  albumData: any;
  canSave: boolean = true;
  private sub: any;

  App: AppComponent;

  constructor(private http: Http, private el: ElementRef, App: AppComponent, private user: UserService, private route: ActivatedRoute, private sanitizer: DomSanitizer) {
    this.App = App;
  }

  domSanitizer(link: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(link);
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.albumId = params['albumId']; 
      this.albumLocal = params['albumLocal'];
      this.albumData = this.App.formatDate(params['albumData']);
    });

    this.App.socket.on('checkFotoResponse', (data: any) => {
      this.App.responses(data);
      this.canSave = true;
      this.App.socket.emit('checkAlbum', {albumId: this.albumId});
    });
    this.App.socket.on('checkAlbumResponse', (data: any) => {
      this.album = data.descricao;
    });
    this.App.socket.emit('checkAlbum', {albumId: this.albumId});
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  deleteFoto(idFoto: any) {
    swal({
      title: 'Confirmação!',
      text: "Deseja apagar essa foto?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.App.socket.emit('deleteFoto', {idFoto: idFoto});
      }
    });
  }

  editarAlbum(idAlbum: any) {
    swal({
      title: 'Confirmação!',
      text: "Deseja editar esse álbum?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.App.socket.emit('editarAlbum', {idAlbum: idAlbum, albumLocal: this.albumLocal, albumData: this.albumData});
      }
    });
  }

  salvarFoto() {
    swal({
      title: 'Confirmação!',
      text: "Deseja salvar essa foto?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#foto');
        let fileCount: number = inputEl.files.length;
        let formData = new FormData();
        if (fileCount > 0) {
          formData.append('foto', inputEl.files.item(0));
          formData.append('albumId', this.albumId );
          swal({
            title: 'UPLOAD!',
            text: "Subindo foto!",
            type: 'info',
            showConfirmButton: false,
            showCancelButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
          this.http.post(this.App.serverNode+"/upload/foto", formData).subscribe(
            (data) => {},
            (err) => {console.error(err);}
          )
        } else {
          swal("Informação","É necessário pelo menos uma foto!","info");
        }
      }
    });
  }

}
