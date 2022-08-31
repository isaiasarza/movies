import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { IonicRatingComponentModule } from 'ionic-rating-component';
import { MovieDetailComponent } from './components/movie-detail/movie-detail.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    IonicRatingComponentModule,
    ReactiveFormsModule
  ],
  declarations: [HomePage, ]
})
export class HomePageModule {}
