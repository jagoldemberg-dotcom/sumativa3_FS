import { Injectable } from '@angular/core';
import { CartItem } from './cart.service';
import { Order } from '../models/order.model';

const STORAGE_ORDENES = 'tdr_ordenes';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private obtenerOrdenesInterno(): Order[] {
    try {
      const raw = localStorage.getItem(STORAGE_ORDENES);
      if (!raw) {
        return [];
      }
      return JSON.parse(raw) as Order[];
    } catch {
      return [];
    }
  }

  private guardarOrdenesInterno(ordenes: Order[]): void {
    localStorage.setItem(STORAGE_ORDENES, JSON.stringify(ordenes));
  }

  registrarOrden(items: CartItem[], total: number, usuarioEmail: string): Order {
    const ordenes = this.obtenerOrdenesInterno();
    const nuevoId = ordenes.length > 0 ? Math.max(...ordenes.map(o => o.id)) + 1 : 1;

    const nuevaOrden: Order = {
      id: nuevoId,
      fecha: new Date().toISOString().substring(0, 10),
      total,
      estado: 'Procesando',
      items: items.map(i => ({ ...i })),
      usuarioEmail
    };

    ordenes.push(nuevaOrden);
    this.guardarOrdenesInterno(ordenes);
    return nuevaOrden;
  }

  obtenerOrdenesPorUsuario(email: string): Order[] {
    const ordenes = this.obtenerOrdenesInterno();
    return ordenes.filter(o => o.usuarioEmail === email);
  }
}
