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
import { Usuario } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  perfilForm!: FormGroup;
  usuario!: Usuario;
  mensajeExito: string | null = null;
  mensajeErrorPassword: string | null = null;
  enviado = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const usuarioActual = this.authService.getUsuarioActual();

    // Si no hay usuario autenticado, lo mandamos a login
    if (!usuarioActual) {
      this.router.navigate(['/login']);
      return;
    }

    this.usuario = usuarioActual;

    this.perfilForm = this.fb.group(
      {
        nombre: [
          this.usuario.nombre,
          [Validators.required, Validators.minLength(3)]
        ],
        email: [
          { value: this.usuario.email, disabled: true },
          [Validators.required, Validators.email]
        ],
        edad: [
          this.usuario.edad,
          [Validators.required, Validators.min(13)]
        ],
        direccion: [this.usuario.direccion ?? ''],

        // Campos para cambio de contraseña (opcionales)
        passwordActual: [''],
        passwordNueva: [
          '',
          [
            Validators.minLength(6),
            Validators.maxLength(18),
            // misma regla que en el registro: 1 mayúscula + 1 número
            Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9]).*$/)
          ]
        ],
        passwordNuevaConfirmacion: ['']
      },
      {
        validators: this.passwordsIgualesSiSeIngresan
      }
    );
  }

  get f() {
    return this.perfilForm.controls;
  }

  /**
   * Si el usuario no quiere cambiar la contraseña, no valida nada.
   * Si ingresa nueva contraseña, verifica que passwordNueva y
   * passwordNuevaConfirmacion coincidan.
   */
  passwordsIgualesSiSeIngresan(
    group: AbstractControl
  ): ValidationErrors | null {
    const nueva = group.get('passwordNueva')?.value;
    const confirm = group.get('passwordNuevaConfirmacion')?.value;

    if (!nueva && !confirm) {
      return null; // no se está cambiando la contraseña
    }

    if (nueva && confirm && nueva === confirm) {
      return null;
    }

    return { passwordsNoCoinciden: true };
  }

  onSubmit(): void {
    this.enviado = true;
    this.mensajeExito = null;
    this.mensajeErrorPassword = null;

    if (this.perfilForm.invalid) {
      return;
    }

    if (!this.usuario) {
      return;
    }

    const raw = this.perfilForm.getRawValue();

    // Datos generales del perfil
    const cambios: Partial<Usuario> = {
      nombre: raw.nombre,
      edad: raw.edad,
      direccion: raw.direccion
    };

    // ¿Quiere cambiar la contraseña?
    const passwordActual = raw.passwordActual;
    const passwordNueva = raw.passwordNueva;
    const passwordNuevaConfirmacion = raw.passwordNuevaConfirmacion;

    if (passwordActual || passwordNueva || passwordNuevaConfirmacion) {
      // Todos los campos deben estar llenos
      if (!passwordActual || !passwordNueva || !passwordNuevaConfirmacion) {
        this.mensajeErrorPassword =
          'Debes completar todos los campos de contraseña.';
        return;
      }

      // Verificar contraseña actual
      if (passwordActual !== this.usuario.password) {
        this.mensajeErrorPassword = 'La contraseña actual no es correcta.';
        return;
      }

      // El validador de grupo ya se aseguró de que coincidan,
      // pero por seguridad lo verificamos igual.
      if (passwordNueva !== passwordNuevaConfirmacion) {
        this.mensajeErrorPassword = 'Las nuevas contraseñas no coinciden.';
        return;
      }

      cambios.password = passwordNueva;
    }

    const actualizado = this.authService.actualizarPerfil(cambios);

    if (!actualizado) {
      this.mensajeErrorPassword =
        'No fue posible actualizar el perfil. Intenta nuevamente.';
      return;
    }

    this.usuario = actualizado;

    // Limpiamos los campos de contraseña para que no queden en memoria
    this.perfilForm.patchValue({
      passwordActual: '',
      passwordNueva: '',
      passwordNuevaConfirmacion: ''
    });
    this.perfilForm.markAsPristine();
    this.perfilForm.markAsUntouched();

    this.mensajeExito = 'Perfil actualizado correctamente.';
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
