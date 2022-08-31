import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserCredential } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { IUser } from '../interfaces/user.interface';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(null);

  constructor(private auth: Auth, private userService: UserService, private navCtrl: NavController) { }

  /**
   * Realiza el registro en
   * firebase authentication y
   * persiste genera un nuevo registro en la
   * collección de usuarios.
   * 
   * @param userData 
   * @param password 
   * @returns 
   */
  async register(userData: IUser, password: string): Promise<boolean> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(this.auth, userData.email, password)
      const { uid } = userCredential?.user
      if (!uid) return null
      const user: IUser = { ...userData, id: uid }
      await this.userService.add(user)
      this.currentUser.next(user)
      return true
    } catch (error) { return false }
  }

  /**
   * Verifica las credenciales del usuario,
   * De ser correctas recupera la información del usuario.
   * 
   * @param param0 
   * @returns 
   */
  async login(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(this.auth, email, password)
      const user = await lastValueFrom(this.userService.getById(userCredential.user.uid))
      this.currentUser.next(user)
      return userCredential
    } catch (error) { return null }
  }

  logout(): Promise<void> { 
    this.currentUser.next(null)
    return signOut(this.auth) 
  }
}
