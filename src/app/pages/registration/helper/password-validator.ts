import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export function ConfirmedValidator(group: AbstractControl): ValidationErrors | null {
        const control = group.get('password');
        const matchingControl = group.get('repeatPassword');
        if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
            return null
        }
        if (control.value !== matchingControl.value) {
            return { confirmedValidator: true }
        } else {
            return null;
        }
}

export const WeakPassword = (control: AbstractControl): ValidationErrors | null => {
    const password: string = control?.value
    if(!password) return null
    if (PasswordStrengthChecker(password) != PasswordStrengh.WEAK) return null
    return { weakPassword: true }
}

export const strongRegex = /^([a-zA-Z]).{8,}$/gm
export const mediumRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/gm

export const PasswordStrengthChecker = (password: string): PasswordStrengh => {
    if (password.length >= 8) return PasswordStrengh.STRONG
    if (password.length >= 6 && password.length < 8) return PasswordStrengh.MEDIUM
    return PasswordStrengh.WEAK
}

export enum PasswordStrengh {
    WEAK = 1,
    MEDIUM = 2,
    STRONG = 3,
}