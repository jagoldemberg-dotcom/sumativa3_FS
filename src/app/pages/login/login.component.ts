import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  enviado = false;
  mensajeError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  campoInvalido(campo: string): boolean {
    const control = this.loginForm.get(campo);
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || this.enviado)
    );
  }

  onSubmit(): void {
    this.enviado = true;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    const resultado = this.authService.login(email, password);

    if (!resultado.exito) {
      this.mensajeError = resultado.mensaje ?? 'Error al iniciar sesión.';
      return;
    }

    this.mensajeError = '';

    const usuario = this.authService.getUsuarioActual();
    if (usuario?.rol === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/products']);
    }
  }

  onReset(): void {
    this.enviado = false;
    this.mensajeError = '';
    this.loginForm.reset();
  }
}
