import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { FireBaseService } from 'src/services/firebase-service';
import { StreamFileManager } from 'src/services/stream-file-manager-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DatabaseService } from 'src/services/database-service.mobile';
import { XtreamService } from 'src/services/xtream-service';
import { LiveTvComponent } from '../live-tv/live-tv.component';
import {
  FontAwesomeModule,
  FaStackComponent,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faSmile } from '@fortawesome/free-solid-svg-icons';
import { IconPack, faTv } from '@fortawesome/free-solid-svg-icons';
import { PlayerComponent } from '../player/player.component';
import { ContainerLoadingComponent } from '../container-loading/container-loading.component';
import { ChannelService } from 'src/services/channel-service';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
  ],
  declarations: [HomePage, LiveTvComponent, PlayerComponent, ContainerLoadingComponent],
  providers: [
    HttpClient,
    FireBaseService,
    StreamFileManager,
    DatabaseService,
    XtreamService,
    ChannelService
  ]
})
export class HomePageModule {
  constructor() {
    
    library.add([faTv])
  }
}
