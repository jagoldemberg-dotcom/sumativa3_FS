import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  enviado = false;
  mensajeExito = '';
  mensajeError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        nombre: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        edad: ['', [Validators.required, Validators.min(13)]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(18),
            Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9]).*$/)
          ]
        ],
        password2: ['', Validators.required],
        direccion: ['']
      },
      {
        validators: this.passwordsIgualesValidator
      }
    );
  }

  passwordsIgualesValidator(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const pass2 = group.get('password2')?.value;

    if (!pass || !pass2) {
      return null;
    }

    return pass === pass2 ? null : { passwordsNoCoinciden: true };
  }

  get f() {
    return this.registerForm.controls;
  }

  campoInvalido(campo: string): boolean {
    const control = this.registerForm.get(campo);
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || this.enviado)
    );
  }

  onSubmit(): void {
    this.enviado = true;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { nombre, email, edad, password, direccion } = this.registerForm.value;

    const resultado = this.authService.registrar({
      nombre,
      email,
      edad,
      password,
      direccion
    });

    if (!resultado.exito) {
      this.mensajeExito = '';
      this.mensajeError = resultado.mensaje;
      return;
    }

    this.mensajeError = '';
    this.mensajeExito = resultado.mensaje;
    // Si quieres redirigir automáticamente:
    // this.router.navigate(['/products']);
  }

  onReset(): void {
    this.enviado = false;
    this.mensajeExito = '';
    this.mensajeError = '';
    this.registerForm.reset();
  }
}
