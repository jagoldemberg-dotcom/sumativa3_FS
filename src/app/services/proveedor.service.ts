import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { Proveedor } from '../models/proveedor.model';

/**
 * Proveedores:
 * - Seed inicial: JSON remoto (GitHub Pages). Si falla, cae a assets/data/proveedores.json
 * - CRUD: se realiza sobre LocalStorage (simulación de POST/PUT/DELETE).
 */
const STORAGE_PROVEEDORES = 'tdr_proveedores';
const STORAGE_PROVEEDORES_SEEDED = 'tdr_proveedores_seeded_v1';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  /**
   * URL del seed (GitHub Pages).
   * Ejemplo: https://<usuario>.github.io/<repo>/proveedores.json
   */
  private readonly seedUrl = 'https://jagoldemberg-dotcom.github.io/proveedoreseed/proveedores.json';

  private proveedoresSubject = new BehaviorSubject<Proveedor[]>([]);
  proveedores$ = this.proveedoresSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initSeed().subscribe();
  }

  /** READ */
  getAll(): Observable<Proveedor[]> {
    return this.proveedores$;
  }

  getById(id: number): Observable<Proveedor | undefined> {
    const lista = this.proveedoresSubject.value;
    return of(lista.find(p => p.id === id));
  }

  /** CREATE */
  create(nuevo: Omit<Proveedor, 'id'>): Observable<Proveedor> {
    const lista = [...this.proveedoresSubject.value];
    const nextId = this.getNextId(lista);
    const creado: Proveedor = { ...nuevo, id: nextId };
    lista.push(creado);
    this.persist(lista);
    return of(creado);
  }

  /** UPDATE */
  update(id: number, parcial: Partial<Omit<Proveedor, 'id'>>): Observable<Proveedor | null> {
    const lista = [...this.proveedoresSubject.value];
    const idx = lista.findIndex(p => p.id === id);
    if (idx === -1) return of(null);

    const actualizado: Proveedor = {
      ...lista[idx],
      ...parcial,
      id
    };

    lista[idx] = actualizado;
    this.persist(lista);
    return of(actualizado);
  }

  /** DELETE */
  delete(id: number): Observable<boolean> {
    const lista = [...this.proveedoresSubject.value];
    const filtrado = lista.filter(p => p.id !== id);
    const deleted = filtrado.length !== lista.length;
    if (deleted) {
      this.persist(filtrado);
    }
    return of(deleted);
  }

  /**
   * Re-seed manual (útil para demos):
   * - borra localStorage y vuelve a leer el JSON remoto/asset.
   */
  resetToSeed(): Observable<Proveedor[]> {
    localStorage.removeItem(STORAGE_PROVEEDORES);
    localStorage.removeItem(STORAGE_PROVEEDORES_SEEDED);
    return this.initSeed(true);
  }

  // ---- Internals ----

  private initSeed(force = false): Observable<Proveedor[]> {
    const seeded = localStorage.getItem(STORAGE_PROVEEDORES_SEEDED) === 'true';
    const local = this.readLocal();

    // Si ya hay datos locales, se usan de inmediato.
    if (!force && local.length > 0) {
      this.proveedoresSubject.next(local);
      return of(local);
    }

    // Si ya fue seeded antes, pero local estaba vacío, igualmente intentamos usar local.
    if (!force && seeded) {
      this.proveedoresSubject.next(local);
      return of(local);
    }

    // Intento 1: JSON remoto (GitHub Pages)
    return this.http.get<Proveedor[]>(this.seedUrl).pipe(
      tap(data => {
        const normalizado = (data ?? []).map(p => ({ ...p, activo: p.activo ?? true }));
        this.persist(normalizado);
        localStorage.setItem(STORAGE_PROVEEDORES_SEEDED, 'true');
      }),
      catchError(() => {
        // Intento 2: fallback local (assets)
        return this.http.get<Proveedor[]>('assets/data/proveedores.json').pipe(
          tap(data => {
            const normalizado = (data ?? []).map(p => ({ ...p, activo: p.activo ?? true }));
            this.persist(normalizado);
            localStorage.setItem(STORAGE_PROVEEDORES_SEEDED, 'true');
          }),
          catchError(() => {
            // Último recurso: lista vacía
            this.persist([]);
            localStorage.setItem(STORAGE_PROVEEDORES_SEEDED, 'true');
            return of([]);
          })
        );
      })
    );
  }

  private persist(lista: Proveedor[]): void {
    localStorage.setItem(STORAGE_PROVEEDORES, JSON.stringify(lista));
    this.proveedoresSubject.next(lista);
  }

  private readLocal(): Proveedor[] {
    const raw = localStorage.getItem(STORAGE_PROVEEDORES);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private getNextId(lista: Proveedor[]): number {
    const maxId = lista.reduce((max, p) => Math.max(max, p.id ?? 0), 0);
    return maxId + 1;
  }
}
