import { Component, OnInit } from '@angular/core';
import { UserCredential } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup
  constructor(
    private navCtrl: NavController, 
    private authService: AuthService, 
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  ngOnInit() {
  }

  private get email(): string { return this.loginForm.controls?.email?.value }

  private get password(): string { return this.loginForm.controls?.password?.value }

  goToRegistrationPage() {
    this.navCtrl.navigateForward('/registration')
  }

  async signIn() {
    const loader = await this.loadingCtrl.create({message: 'Iniciando sesión...'})
    loader.present()
    const userCredential: UserCredential = await this.authService.login(this.email, this.password)
    loader.dismiss()
    if (userCredential) {
      this.navCtrl.navigateForward(['home'])
      return
    }
  }

}
