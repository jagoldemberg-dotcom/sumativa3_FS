import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html'
})
export class ForgotComponent implements OnInit {

  forgotForm!: FormGroup;
  enviado = false;
  mensaje = '';
  passwordTemporal?: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() {
    return this.forgotForm.controls;
  }

  campoInvalido(campo: string): boolean {
    const control = this.forgotForm.get(campo);
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || this.enviado)
    );
  }

  onSubmit(): void {
    this.enviado = true;

    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    const { email } = this.forgotForm.value;
    const resultado = this.authService.recuperarPassword(email);

    this.mensaje = resultado.mensaje;
    this.passwordTemporal = resultado.passwordTemporal;
  }

  onReset(): void {
    this.enviado = false;
    this.mensaje = '';
    this.passwordTemporal = undefined;
    this.forgotForm.reset();
  }
}
