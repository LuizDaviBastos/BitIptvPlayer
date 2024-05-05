import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
const { CapacitorVideoPlayerWeb, Device } = Plugins;
import { AlertController, Platform } from '@ionic/angular';
import { CapacitorVideoPlayer, CapacitorVideoPlayerPlugin, capVideoPlayerOptions } from 'capacitor-video-player';
import { Conta } from 'src/model/Conta.model';
import { FireBaseService } from 'src/services/firebase-service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public conta: Conta = new Conta;
  public searchMode = false;

  constructor(public fb: FireBaseService<Conta>, private route: Router, public alertController: AlertController, private platform: Platform) {
    fb.configure(() => new Conta());
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.route.navigate(['tabs/tab1']);
    });
  }

  public delete(id: any) {
    if (id) {
      this.fb.delete(id);
    }
  }
  public showPanel(id: any) {
    this.route.navigate(['tabs/tab2']);
    let account = this.fb.list.find(x => x.id == id);
    this.fb.edit = true;
    this.fb.id = id;
    localStorage.setItem('edit', JSON.stringify(account));
  }

  public newAccount(){
    this.route.navigate(['tabs/tab2']);
    this.fb.edit = false;
    localStorage.setItem('edit', 'false');
  }

  async presentAlert(id: any) {
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      header: 'Atenção',
      message: 'Tem certeza que deseja excluir?',
      buttons: [{ text: 'Faça!', role: 'ok' }, { text: 'Espera, Não', role: 'cancel' }]
    });

    await alert.present();

    alert.onDidDismiss().then(response => {
      if(response.role == 'ok'){
        this.fb.delete(id);
      }
    });
  }

  public search(text: string){
    console.log(text);
    this.fb.search('nome', text);
  }

  public doRefresh(event: any) {
    this.fb.refreshList(event);
  }

  public searchModeToggle(){
    this.searchMode = !this.searchMode;
  }

}
