import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario, RolUsuario } from '../models/user.model';

const STORAGE_USUARIOS = 'tdr_usuarios';
const STORAGE_USUARIO_ACTUAL = 'tdr_usuario_actual';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.ensureDefaultAdmin();
    this.cargarUsuarioActual();
  }

  private ensureDefaultAdmin(): void {
    const usuarios = this.obtenerUsuariosInterno();
    const existeAdmin = usuarios.some(u => u.rol === 'admin');
    if (!existeAdmin) {
      usuarios.push({
        id: 1,
        nombre: 'Admin Tienda de Ratas',
        email: 'admin@tiendaderatas.cl',
        edad: 25,
        direccion: 'Santiago',
        password: 'Admin123*',
        rol: 'admin'
      });
      this.guardarUsuariosInterno(usuarios);
    }
  }

  private cargarUsuarioActual(): void {
    try {
      const raw = localStorage.getItem(STORAGE_USUARIO_ACTUAL);
      if (raw) {
        const usuario: Usuario = JSON.parse(raw);
        this.currentUserSubject.next(usuario);
      }
    } catch {
      this.currentUserSubject.next(null);
    }
  }

  private obtenerUsuariosInterno(): Usuario[] {
    try {
      const raw = localStorage.getItem(STORAGE_USUARIOS);
      if (!raw) {
        return [];
      }
      return JSON.parse(raw) as Usuario[];
    } catch {
      return [];
    }
  }

  private guardarUsuariosInterno(usuarios: Usuario[]): void {
    localStorage.setItem(STORAGE_USUARIOS, JSON.stringify(usuarios));
  }

  private guardarUsuarioActual(usuario: Usuario | null): void {
    if (usuario) {
      localStorage.setItem(STORAGE_USUARIO_ACTUAL, JSON.stringify(usuario));
    } else {
      localStorage.removeItem(STORAGE_USUARIO_ACTUAL);
    }
  }

  getUsuarioActual(): Usuario | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): { exito: boolean; mensaje?: string } {
    const usuarios = this.obtenerUsuariosInterno();
    const usuario = usuarios.find(u => u.email === email);

    if (!usuario || usuario.password !== password) {
      return { exito: false, mensaje: 'Correo o contraseña incorrectos.' };
    }

    this.currentUserSubject.next(usuario);
    this.guardarUsuarioActual(usuario);
    return { exito: true };
  }

  registrar(datos: {
    nombre: string;
    email: string;
    edad: number;
    direccion?: string;
    password: string;
    rol?: RolUsuario;
  }): { exito: boolean; mensaje: string } {
    const usuarios = this.obtenerUsuariosInterno();
    const existente = usuarios.find(u => u.email === datos.email);

    if (existente) {
      return { exito: false, mensaje: 'El correo ya se encuentra registrado.' };
    }

    const nuevoId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;

    const nuevoUsuario: Usuario = {
      id: nuevoId,
      nombre: datos.nombre,
      email: datos.email,
      edad: datos.edad,
      direccion: datos.direccion,
      password: datos.password,
      rol: datos.rol ?? 'cliente'
    };

    usuarios.push(nuevoUsuario);
    this.guardarUsuariosInterno(usuarios);

    this.currentUserSubject.next(nuevoUsuario);
    this.guardarUsuarioActual(nuevoUsuario);

    return { exito: true, mensaje: 'Usuario registrado correctamente.' };
  }

  actualizarPerfil(parcial: Partial<Usuario>): Usuario | null {
    const actual = this.getUsuarioActual();
    if (!actual) {
      return null;
    }

    const usuarios = this.obtenerUsuariosInterno();
    const indice = usuarios.findIndex(u => u.id === actual.id);
    if (indice === -1) {
      return null;
    }

    const actualizado: Usuario = {
      ...actual,
      ...parcial,
      id: actual.id,
      rol: actual.rol
    };

    usuarios[indice] = actualizado;
    this.guardarUsuariosInterno(usuarios);
    this.currentUserSubject.next(actualizado);
    this.guardarUsuarioActual(actualizado);

    return actualizado;
  }

  recuperarPassword(email: string): { exito: boolean; mensaje: string; passwordTemporal?: string } {
    const usuarios = this.obtenerUsuariosInterno();
    const usuario = usuarios.find(u => u.email === email);

    if (!usuario) {
      return { exito: false, mensaje: 'No existe un usuario con ese correo.' };
    }

    const passwordTemporal = 'Temp' + Math.floor(100000 + Math.random() * 900000).toString();

    usuario.password = passwordTemporal;
    this.guardarUsuariosInterno(usuarios);

    if (this.currentUserSubject.value?.id === usuario.id) {
      this.currentUserSubject.next(usuario);
      this.guardarUsuarioActual(usuario);
    }

    return {
      exito: true,
      mensaje: 'Se generó una contraseña temporal. Usa esta clave para iniciar sesión y luego cámbiala en tu perfil.',
      passwordTemporal
    };
  }

  cerrarSesion(): void {
    this.currentUserSubject.next(null);
    this.guardarUsuarioActual(null);
  }

  tieneRol(roles: RolUsuario[]): boolean {
    const usuario = this.getUsuarioActual();
    if (!usuario) {
      return false;
    }
    return roles.includes(usuario.rol);
  }
}
