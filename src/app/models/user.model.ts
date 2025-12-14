export type RolUsuario = 'admin' | 'cliente';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  edad: number;
  direccion?: string;
  password: string;
  rol: RolUsuario;
}
