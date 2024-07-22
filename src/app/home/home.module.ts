import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { FireBaseService } from 'src/services/firebase-service';
import { StreamFileManager } from 'src/services/stream-file-manager-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DatabaseService } from 'src/services/database-service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    HttpClientModule
  ],
  declarations: [HomePage],
  providers: [HttpClient, FireBaseService, StreamFileManager, HttpClient,
    DatabaseService
  ]
})
export class HomePageModule {}
