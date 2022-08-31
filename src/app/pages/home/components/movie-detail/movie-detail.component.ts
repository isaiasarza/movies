import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { IMovie } from 'src/app/interfaces/movie.interface';
import { IReview } from 'src/app/interfaces/review.interface';
import { AuthService } from 'src/app/services/auth.service';
import { ReviewsService } from 'src/app/services/reviews.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss'],
})
export class MovieDetailComponent implements OnInit {
  private readonly DEFAULT_REVIEW: IReview = { description: 'Ingresa tu opinión...', rate: 0 }
  movie: IMovie
  otherReviews: IReview[]
  userReview: IReview;
  loadingReviews: boolean = true
  userId: string
  userReviewForm: FormGroup
  constructor(
    private reviewsService: ReviewsService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
  ) {

    this.authService.currentUser.subscribe((user) => this.userId = user?.id)
    this.userReviewForm = this.formBuilder.group({
      description: ['', Validators.required],
      rate: ['', Validators.required]
    })
  }

  ngOnInit() {

    if (this.movie?.id)
      this.reviewsService.getByMovieId(this.movie.id)
        .subscribe((reviews) => {
          this.loadingReviews = false
          this.userReview = this.getUserReview(reviews, this.userId)
          this.otherReviews = this.getOtherReview(reviews, this.userId)
        })
  }

  /**
   * Retorna la opinión del usuario actual.
   * 
   * @param reviews 
   * @param userId 
   * @returns 
   */
  private getUserReview(reviews: IReview[], userId: string): IReview {
    return reviews.find(review => review.userId == userId) || { ...this.DEFAULT_REVIEW, movieId: this.movie?.id }
  }

  /**
   * Obtiene las opiniones que no son del usuario actual.
   * 
   * @param reviews 
   * @param userId 
   * @returns 
   */
  private getOtherReview(reviews: IReview[], userId: string): IReview[] {
    return reviews.filter(review => review.userId != userId)
  }

  /**
   * Retorna verdadero si el usuario ya registró
   * su opinión.
   *
   * @readonly
   * @type {boolean}
   * @memberof MovieDetailComponent
   */
  get userReviewUploaded(): boolean { return !!this.userReview?.userId }

  set description(_description: string) { this.userReview.description = _description }

  set rate(_rate: number) { this.userReview.rate = _rate }

  async uploadReview() {
    const valid: boolean = this.isValidReview(this.userReview)
    if (valid) this.showPreventDialog()
    else this.showInvalidPreviewDialog()
  }

  private isValidReview(review: IReview): boolean {
    return review.description?.length > 10 && review.rate > 0
  }

  private async showPreventDialog() {
    const alert = await this.alertCtrl.create({
      header: 'Estamos por subir tu opinión...',
      message: 'Estás Seguro? Recordá que no podrás modificarla.',
      buttons: [
        {
          text: 'No, la voy a subir más tarde!',
          role: 'cancel',
          handler: () => { this.userReview.description = '', this.userReview.rate = 0 }
        },
        {
          text: 'Si, estoy hiper seguro!',
          role: 'confirm',
          handler: async () => {
            const loader = await this.loadingCtrl.create({ message: 'Estamos subiendo tu opinión...' })
            loader.present()
            try {
              await this.reviewsService.add({ ...this.userReview, userId: this.userId })
            } catch (error) {}
            loader.dismiss()
          },
        }
      ]
    })
    alert.present()
  }

  private async showInvalidPreviewDialog() {
    const alert = await this.alertCtrl.create({
      header: 'Opinión inválida',
      message: 'La descripción debe tener al menos 10 caractéres, y la puntuación debe ser mayor a 0.',
    })
    alert.present()
  }



}
