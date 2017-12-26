import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import swal from 'sweetalert2';
import { AppComponent } from '../app.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit {

  urlCache = new Map<string, SafeResourceUrl>();

  canSave: boolean = true;
  App: AppComponent;

  video: any = {
    titulo: '',
    data: '',
    link: ''
  }

  videos: Array<any> = [];

  constructor(App: AppComponent, private user: UserService, private sanitizer: DomSanitizer) {
    this.App = App;
  }

  ngOnInit() {
    this.App.socket.on('videoResponse', (data: any) => {
      this.App.responses(data);
      this.canSave = true;
      this.App.socket.emit('checkVideos');
    });
    this.App.socket.on('checkVideosResponse', (data: any) => {
      this.videos = data.descricao;
    });
    this.App.socket.emit('checkVideos');
  }

  domSanitizer(link: string): SafeResourceUrl {
    link = link.replace("watch?v=", "embed/");
    var url = this.urlCache.get(link);
    if (!url) {
      url = this.sanitizer.bypassSecurityTrustResourceUrl(link+"?enablejsapi=1");
      this.urlCache.set(link, url);
    }
    return url;
  }

  deleteVideo(videoId: any, midiaId: any) {
    swal({
      title: 'Confirmação!',
      text: "Deseja apagar esse vídeo?",
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
          text: 'Deletando Vídeo...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          onOpen: () => {
            swal.showLoading()
          }
        });
        this.App.socket.emit('deleteVideo', {videoId: videoId, midiaId: midiaId});
      }
    });
  }

  salvarVideo() {
    swal({
      title: 'Confirmação!',
      text: "Deseja salvar vídeo?",
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
          text: 'Salvando Novo Vídeo...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          onOpen: () => {
            swal.showLoading()
          }
        });
        this.App.socket.emit('saveVideo', this.video);
      }
    });
  }
}
