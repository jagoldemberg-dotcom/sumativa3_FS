import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Proveedor } from '../../models/proveedor.model';
import { ProveedorService } from '../../services/proveedor.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html'
})
export class ProveedoresComponent implements OnInit {
  proveedores: Proveedor[] = [];
  form!: FormGroup;

  cargando = true;
  error = '';
  exito = '';

  modoEdicion = false;
  idEditando: number | null = null;

  mostrarJson = false;

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      contacto: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.minLength(6)]],
      direccion: [''],
      activo: [true, [Validators.required]],
      categorias: [''] // string separada por comas
    });

    this.proveedorService.getAll().subscribe({
      next: (data) => {
        this.proveedores = data ?? [];
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar la lista de proveedores.';
        this.cargando = false;
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    this.error = '';
    this.exito = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;
    const categorias = (raw.categorias ?? '')
      .split(',')
      .map((x: string) => x.trim())
      .filter((x: string) => x.length > 0);

    const payload = {
      nombre: raw.nombre,
      contacto: raw.contacto,
      email: raw.email,
      telefono: raw.telefono,
      direccion: raw.direccion || undefined,
      activo: !!raw.activo,
      categorias: categorias.length ? categorias : undefined
    };

    if (this.modoEdicion && this.idEditando !== null) {
      this.proveedorService.update(this.idEditando, payload).subscribe((resp) => {
        if (!resp) {
          this.error = 'No se encontró el proveedor para actualizar.';
          return;
        }
        this.exito = 'Proveedor actualizado.';
        this.cancelarEdicion();
      });
      return;
    }

    this.proveedorService.create(payload as any).subscribe(() => {
      this.exito = 'Proveedor creado.';
      this.form.reset({ activo: true, categorias: '' });
    });
  }

  editar(p: Proveedor): void {
    this.exito = '';
    this.error = '';
    this.modoEdicion = true;
    this.idEditando = p.id;

    this.form.patchValue({
      nombre: p.nombre,
      contacto: p.contacto,
      email: p.email,
      telefono: p.telefono,
      direccion: p.direccion ?? '',
      activo: p.activo,
      categorias: (p.categorias ?? []).join(', ')
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.idEditando = null;
    this.form.reset({ activo: true, categorias: '' });
  }

  eliminar(p: Proveedor): void {
    this.exito = '';
    this.error = '';

    const ok = confirm(`¿Eliminar proveedor "${p.nombre}"?`);
    if (!ok) return;

    this.proveedorService.delete(p.id).subscribe((deleted) => {
      if (!deleted) {
        this.error = 'No se pudo eliminar (id no existe).';
        return;
      }
      this.exito = 'Proveedor eliminado.';
      if (this.modoEdicion && this.idEditando === p.id) {
        this.cancelarEdicion();
      }
    });
  }

  reseed(): void {
    this.exito = '';
    this.error = '';
    this.cargando = true;

    this.proveedorService.resetToSeed().subscribe({
      next: () => {
        this.exito = 'Seed recargado (se restauró la lista desde JSON).';
        this.cargando = false;
        this.cancelarEdicion();
      },
      error: () => {
        this.error = 'No se pudo recargar el seed.';
        this.cargando = false;
      }
    });
  }
}
