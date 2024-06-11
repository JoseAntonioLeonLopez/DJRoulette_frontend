import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './pages/admin/admin.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { provideHttpClient } from '@angular/common/http';
import { LandingComponent } from './pages/landing/landing.component';
import { SongService } from './service/song.service';
import { RouletteComponent } from './components/roulette/roulette.component';
import { SongModalComponent } from './components/song-modal/song-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    AdminComponent,
    NotFoundComponent,
    RouletteComponent,
    SongModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    provideHttpClient(),
    SongService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
