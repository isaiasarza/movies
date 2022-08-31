import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { IMovie } from 'src/app/interfaces/movie.interface';
import { AuthService } from 'src/app/services/auth.service';
import { MoviesService } from 'src/app/services/movies.service';
import { MovieDetailComponent } from './components/movie-detail/movie-detail.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  movies: IMovie[]
  constructor(
    private authService: AuthService, 
    private navCtrl: NavController, 
    private moviesService: MoviesService,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit(): void {
    this.moviesService.getAll()
    .subscribe((movies: IMovie[]) => this.movies = movies)
  }

  async logout() {
    await this.authService.logout()
    this.navCtrl.navigateForward(['login'])
  }

  async goToMovieDetail(movie: IMovie){
    const modal = await this.modalCtrl.create({component: MovieDetailComponent, componentProps: {movie: movie}, cssClass: 'example-modal'})
    modal.present().catch((error) => console.error(error))
  }

}
