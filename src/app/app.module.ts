import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppComponent } from './app.component';
import { PainelComponent } from './painel/painel.component';
import { PerfilComponent } from './perfil/perfil.component';
import { LoginComponent } from './login/login.component';
import { NoticiaComponent } from './noticia/noticia.component';
import { VideosComponent } from './videos/videos.component';

import { RouterModule, Routes } from '@angular/router';

import { UserService } from './user.service';
import { AuthGuard } from './auth.guard';
import { SiteComponent } from './site/site.component';
import { ContatoComponent } from './contato/contato.component';
import { AlbunsComponent } from './albuns/albuns.component';
import { MensagensComponent } from './mensagens/mensagens.component';
import { AlbumComponent } from './album/album.component';
import { NguCarouselModule } from '@ngu/carousel';

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
    AlbumComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    NguCarouselModule,
    RouterModule.forRoot([
      {path: '', component: SiteComponent, pathMatch: 'full'},
      {path: 'login', component: LoginComponent},
      {path: 'painel', component: PainelComponent, canActivate: [AuthGuard]},
      {path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard]},
      {path: 'contato', component: ContatoComponent, canActivate: [AuthGuard]},
      {path: 'videos', component: VideosComponent, canActivate: [AuthGuard]},
      {path: 'albuns', component: AlbunsComponent, canActivate: [AuthGuard]},
      {path: 'mensagens', component: MensagensComponent, canActivate: [AuthGuard]},
      {path: 'album/:albumId/:albumLocal/:albumData', component: AlbumComponent, canActivate: [AuthGuard]},
      {path: '**', redirectTo: '' }
    ])
  ],
  providers: [
    UserService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
