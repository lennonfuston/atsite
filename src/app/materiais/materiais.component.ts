import { Component, OnInit, OnDestroy, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import swal from 'sweetalert2';
import { AppComponent } from '../app.component';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-materiais',
  templateUrl: './materiais.component.html',
  styleUrls: ['./materiais.component.css']
})
export class MateriaisComponent implements OnInit {
  @ViewChild("inputMaterial") inputAlbumFoto;

  canSave: boolean = true;
  materials: Array<any> = [];

  App: AppComponent;

  constructor(private http: Http, private el: ElementRef, App: AppComponent, private user: UserService, private route: ActivatedRoute, private sanitizer: DomSanitizer) {
    this.App = App;
  }
  

  domSanitizer(link: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(link);
  }

  ngOnInit() {
    this.App.socket.on('materialResponse', (data: any) => {
      this.App.responses(data);
      this.canSave = true;
      this.App.socket.emit('checkMaterial');
    });
    this.App.socket.on('checkMaterialResponse', (data: any) => {
      this.materials = data.descricao;
    });
    this.App.socket.emit('checkMaterial');
  }

  deleteMaterial(idMaterial: any) {
    swal({
      title: 'Confirmação!',
      text: "Deseja apagar esse material?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.App.socket.emit('deleteMaterial', {idMaterial: idMaterial});
      }
    });
  }

  salvarMaterial() {
    swal({
      title: 'Confirmação!',
      text: "Deseja salvar esse material?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        let inputElNome: HTMLInputElement = this.el.nativeElement.querySelector('#nome');
        let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#material');
        let fileCount: number = inputEl.files.length;
        let formData = new FormData();
        if (fileCount > 0) {
          formData.append('materialNome', inputElNome.value);
          formData.append('material', inputEl.files.item(0));
          swal({
            title: 'UPLOAD!',
            text: "Subindo arquivo!",
            type: 'info',
            showConfirmButton: false,
            showCancelButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
          this.http.post(this.App.serverNode+"/upload/material", formData).subscribe(
            (data) => {},
            (err) => {console.error(err);}
          )
        } else {
          swal("Informação","É necessário pelo menos um material!", "info");
        }
      }
    });
  }

}
