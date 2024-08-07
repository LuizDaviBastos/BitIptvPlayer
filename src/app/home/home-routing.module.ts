import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { LiveTvComponent } from '../live-tv/live-tv.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'live',
    component: LiveTvComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
