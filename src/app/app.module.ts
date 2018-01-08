import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PainelComponent } from './painel/painel.component';
import { PerfilComponent } from './perfil/perfil.component';
import { LoginComponent } from './login/login.component';
import { NoticiaComponent } from './noticia/noticia.component';
import { MateriaisComponent } from './materiais/materiais.component';
import { VideosComponent } from './videos/videos.component';

import { RouterModule, Routes } from '@angular/router';

import { UserService } from './user.service';
import { AuthGuard } from './auth.guard';
import { SiteComponent } from './site/site.component';
import { ContatoComponent } from './contato/contato.component';
import { AlbunsComponent } from './albuns/albuns.component';
import { MensagensComponent } from './mensagens/mensagens.component';
import { AlbumComponent } from './album/album.component';
import { OwlModule } from 'ngx-owl-carousel';
import { NguCarouselModule } from '@ngu/carousel';

import { NgxGalleryModule } from 'ngx-gallery';

import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
registerLocaleData(ptBr)

@NgModule({
  declarations: [
    AppComponent,
    PainelComponent,
    PerfilComponent,
    LoginComponent,
    NoticiaComponent,
    VideosComponent,
    SiteComponent,
    ContatoComponent,
    AlbunsComponent,
    MensagensComponent,
    AlbumComponent,
    MateriaisComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NguCarouselModule,
    NgxGalleryModule,
    OwlModule,
    RouterModule.forRoot([
      {path: '', component: SiteComponent, pathMatch: 'full'},
      {path: 'login', component: LoginComponent},
      {path: 'painel', component: PainelComponent, canActivate: [AuthGuard]},
      {path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard]},
      {path: 'contato', component: ContatoComponent, canActivate: [AuthGuard]},
      {path: 'videos', component: VideosComponent, canActivate: [AuthGuard]},
      {path: 'albuns', component: AlbunsComponent, canActivate: [AuthGuard]},
      {path: 'mensagens', component: MensagensComponent, canActivate: [AuthGuard]},
      {path: 'materiais', component: MateriaisComponent, canActivate: [AuthGuard]},
      {path: 'album/:albumId/:albumLocal/:albumData', component: AlbumComponent, canActivate: [AuthGuard]},
      {path: '**', redirectTo: '' }
    ])
  ],
  providers: [
    UserService,
    AuthGuard,
    { provide: LOCALE_ID, useValue: 'pt-PT' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
