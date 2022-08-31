import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmedValidator, PasswordStrengh, PasswordStrengthChecker, WeakPassword } from './helper/password-validator';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  registrationForm: FormGroup;
  _passwordStrength: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  _passwordStrengthLabel: BehaviorSubject<string> = new BehaviorSubject<string>('');
  
  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
  ) {
    this.registrationForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, WeakPassword]],
      repeatPassword: ['', [Validators.required, WeakPassword]],
    }, {
      validators: [ConfirmedValidator]
    })
  }

  ngOnInit() {
    this.registrationForm.controls.password.valueChanges.subscribe((value) => {
      
      const strength = PasswordStrengthChecker(value)
      this._passwordStrength.next(strength)
      this._passwordStrengthLabel.next(this.getPasswordStrengthLabel(strength))
    })
  }

  private get password(): string { return this.registrationForm.controls.password.value }

  private get repeatPassword(): string { return this.registrationForm.controls.repeatPassword.value }

  get passwordStrength(): number{
    return this._passwordStrength.value
  }

  get passwordStrengthLabel(): string{
    return this._passwordStrengthLabel.value
  }

  async signUp(): Promise<void> {
    const loader = await this.loadingCtrl.create({message: 'Creando cuenta...'})
    loader.present()
    const { password, repeatPassword, ...userData } = this.registrationForm.value
    const registered: boolean = await this.authService.register(userData as IUser, password)
    loader.dismiss()
    if (registered) {
      this.navCtrl.navigateForward(['home']) 
      return 
    }
    await this.toastCtrl.create({color: 'danger', message:'Ups! Hubo un problema, intente nuevamente más tarde', duration:2000})
    this.navCtrl.navigateForward(['login'])
  }

  private getPasswordStrengthLabel(strength: number): string {
    if (strength == PasswordStrengh.STRONG) return 'Contraseña segura'
    if (strength == PasswordStrengh.MEDIUM) return 'Contraseña intermedia'
    return 'Contraseña insegura'
  }

  showProgressBar(): boolean { 
    return this.password.length > 0 
    && this.password == this.repeatPassword 
  }

}
