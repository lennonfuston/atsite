import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { UserService } from '../user.service';
import swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NguCarousel, NguCarouselStore } from '@ngu/carousel';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import 'hammerjs';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css']
})
export class SiteComponent implements OnInit {
  @ViewChild('sideMenu') sideMenu;
  
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  urlCache = new Map<string, SafeResourceUrl>();

  biografia: any = [{text: ''}];
  agenda: Array<any> = [];
  galeria: Array<any> = [];
  redesocial: Array<any> = [];
  emails: Array<any> = [];
  telefones: Array<any> = [];
  contato: any = {nome: '', email: '', assunto: '', mensagem: ''};
  materials: any = [];

  youtube: string;
  instagram: string;
  twitter: string;
  facebook: string;
  spotify: string;
  endereco: string;
  cabecalho: string;

  public carouselBanner: NguCarousel;
  public carouselBanner2: NguCarousel;
  
  App: AppComponent;
  constructor(App: AppComponent, private el: ElementRef, private user: UserService, private sanitizer: DomSanitizer) {this.App = App;}

  open() {
    this.App.socket.emit("checkMaterial");
    // ABRIR MODAL COM LINKS PARA DOWNLOAD DE MATERIAIS
  }

  enviaContato() {
    swal({
      title: 'Confirmação!',
      text: "Deseja enviar contato?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        if(!this.contato['nome']) { swal("Erro!", "Preencha o nome", "error"); return; }
        if(!this.contato['email']) { swal("Erro!", "Preencha o email", "error"); return; }
        if(!this.contato['assunto']) { swal("Erro!", "Preencha o assunto", "error"); return; }
        if(!this.contato['mensagem']) { swal("Erro!", "Preencha a mensagem", "error"); return; }
        this.App.socket.emit("enviaContato", this.contato);
      }
    });
  }

  openMenu(event?) {
    if(event) event.stopPropagation();
    
    if(this.sideMenu.nativeElement.className == 'mobile open') {
      this.sideMenu.nativeElement.className = 'mobile';
    } else if(this.sideMenu.nativeElement.className == 'mobile'){
      this.sideMenu.nativeElement.className = 'mobile open';
    } else if(this.sideMenu.nativeElement.className == 'mobile scrolled'){
      this.sideMenu.nativeElement.className = 'mobile open scrolled';
    } else if(this.sideMenu.nativeElement.className == 'mobile open scrolled'){
      this.sideMenu.nativeElement.className = 'mobile scrolled';
    }
  }

  closeMenu() {
    if(this.sideMenu.nativeElement.className == 'mobile open') {
      this.sideMenu.nativeElement.className = 'mobile';
    } else if(this.sideMenu.nativeElement.className == 'mobile open scrolled'){
      this.sideMenu.nativeElement.className = 'mobile scrolled';
    }
  }

  eventsJquery() {
    $( document ).ready(() => {
      $('.body-site').click((e) => {
        let mobileNav = $('.body-site nav[_ngcontent-c1].mobile');
        if(mobileNav.attr('class') == 'mobile open' || mobileNav.attr('class') == 'mobile open scrolled') {
          this.closeMenu();
        }
      });
      $(window).scroll(function (event) {
        if($(window).scrollTop() > 0) {
          $('nav').addClass("scrolled");
        } else {
          $('nav').removeClass("scrolled");
        }
      });
      $("#goTop").click(function(e){
        e.preventDefault();
        var togo = $('.header-nav')[0];
        togo.scrollIntoView({behavior:"smooth"});
      });
      $(".inicio-anchor").click(function(e){
        e.preventDefault();
        var togo = $('.header-nav')[0];
        togo.scrollIntoView({behavior:"smooth"});
      });
      $(".biografia-anchor").click(function(e){
        e.preventDefault();
        var togo = $('.biografia')[0];
        togo.scrollIntoView({behavior:"smooth"});
      });
      $(".musica-anchor").click(function(e){
        e.preventDefault();
        var togo = $('.musica')[0];
        togo.scrollIntoView({behavior:"smooth"});
      });
      $(".galeria-anchor").click(function(e){
        e.preventDefault();
        var togo = $('.galeria')[0];
        togo.scrollIntoView({behavior:"smooth"});
      });
      $(".agenda-anchor").click(function(e){
        e.preventDefault();
        var togo = $('.agenda')[0];
        togo.scrollIntoView({behavior:"smooth"});
      });
      $(".contato-anchor").click(function(e){
        e.preventDefault();
        var togo = $('.contato')[0];
        togo.scrollIntoView({behavior:"smooth"});
      });
      if($(window).scrollTop() > 0) {
        $('nav').addClass("scrolled");
      } else {
        $('nav').removeClass("scrolled");
      }
    });
  }

  domSanitizerYoutube(link: string): SafeResourceUrl {
    link = link.replace("watch?v=", "embed/");
    var url = this.urlCache.get(link);
    if (!url) {
      url = this.sanitizer.bypassSecurityTrustResourceUrl(link+"?enablejsapi=1");
      this.urlCache.set(link, url);
    }
    return url;
  }

  domSanitizer(link: string) {
    var url = this.urlCache.get(link);
    if (!url) {
      url = this.sanitizer.bypassSecurityTrustResourceUrl(link);
      this.urlCache.set(link, url);
    }
    return url;
  }

  public onmoveFn(event: Event) {
    // carouselLoad will trigger this funnction when your load value reaches
    // it is helps to load the data by parts to increase the performance of the app
    // must use feature to all carousel
  }

  domSanitizerUrlGaleria(arr) {
    let serv = this.App.serverNode+'/static/';
    for(let i = 0; i < arr.length; i++) {
      arr[i].small = serv+''+arr[i].small;
      arr[i].medium = serv+''+arr[i].medium;
      arr[i].big = serv+''+arr[i].big;
    }
    return arr;
  }

  ngOnInit() {
    this.galleryOptions = [
      {
        "previewCloseOnClick": false,
        "previewCloseOnEsc": true,
        "previewZoom": true,
        "previewFullscreen": true,
        "previewKeyboardNavigation": true,
        "imageAutoPlay": true,
        "imageAutoPlayPauseOnHover": true,
        "thumbnails": false,
        "width": "100%",
        "height": "300px",
        "imageArrows": false,
        "imageSwipe": true,
        "thumbnailsArrows": false,
        "thumbnailsSwipe": true,
        "previewSwipe": true
      }
    ];

    this.carouselBanner = {
      grid: {xs: 1, sm: 2, md: 3, lg: 3, all: 0},
      slide: 2,
      speed: 400,
      custom: 'banner',
      easing: 'ease-out',
      point: {
        visible: false,
        pointStyles: `
          .ngucarouselPoint {
            list-style-type: none;
            text-align: center;
            padding: 12px;
            margin: 0;
            white-space: nowrap;
            overflow: auto;
            position: absolute;
            width: 100%;
            bottom: 20px;
            left: 0;
            box-sizing: border-box;
          }
          .ngucarouselPoint li {
            display: inline-block;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.55);
            padding: 5px;
            margin: 0 3px;
            transition: .4s ease all;
          }
          .ngucarouselPoint li.active {
              background: white;
              width: 10px;
          }
        `
      },
      load: 2,
      loop: true,
      touch: true,
      animation: 'lazy'
    }

    this.App.socket.on('contatoResponse', (data: any) => {
      this.App.responses(data);
    });
    this.App.socket.on('checkGaleriaResponse', (data: any) => {
      this.galeria = data.descricao;
    });
    this.App.socket.emit('checkGaleria');

    this.App.socket.on('checkAgendaResponse', (data: any) => {
      this.agenda = data.descricao;
    });
    this.App.socket.emit('checkAgenda');

    this.App.socket.on('checkBiografiaResponse', (data: any) => {
      this.biografia['text'] = data.descricao.text;
    });
    this.App.socket.emit('checkBiografia');

    this.App.socket.on('checkCabecalhoResponse', (data: any) => {
      this.cabecalho = data.descricao.text;
    });
    this.App.socket.emit('checkCabecalho');

    this.App.socket.on('checkRedesocialResponse', (data: any) => {
      this.redesocial = data.descricao;
      for(let i = 0; i < this.redesocial.length; i++) {
        if(this.redesocial[i].tipo == 'i') {this.instagram = this.redesocial[i].text;}
        if(this.redesocial[i].tipo == 't') {this.twitter = this.redesocial[i].text;}
        if(this.redesocial[i].tipo == 'y') {this.youtube = this.redesocial[i].text;}
        if(this.redesocial[i].tipo == 'f') {this.facebook = this.redesocial[i].text;}
        if(this.redesocial[i].tipo == 's') {this.spotify = this.redesocial[i].text;}
      }
    });
    this.App.socket.emit('checkRedesocial');

    this.App.socket.on('checkEnderecoResponse', (data: any) => {
      this.endereco = data.descricao.endereco;
    });
    this.App.socket.emit('checkEndereco');

    this.App.socket.on('checkEmailsResponse', (data: any) => {
      this.emails = data.descricao;
    });
    this.App.socket.emit('checkEmails');

    this.App.socket.on('checkTelefonesResponse', (data: any) => {
      this.telefones = data.descricao;
    });
    this.App.socket.emit('checkTelefones');

    this.App.socket.on('checkMaterialResponse', (data: any) => {
      this.materials = data.descricao;
      if(this.materials.length > 0) {
        $('#modal-1').nifty("show");
      } else {
        swal("Informativo", "Não existe no momento materiais para download!", "info");
      }
    });

    this.eventsJquery();
  }

}