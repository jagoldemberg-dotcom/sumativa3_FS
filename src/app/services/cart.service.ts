import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

export interface CartItem {
  producto: Product;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];

  add(producto: Product): void {
    const existing = this.items.find(i => i.producto.id === producto.id);
    if (existing) {
      existing.cantidad++;
    } else {
      this.items.push({ producto, cantidad: 1 });
    }
  }

  getItems(): CartItem[] {
    return this.items;
  }

  clear(): void {
    this.items = [];
  }

  getTotalQuantity(): number {
    return this.items.reduce((acc, item) => acc + item.cantidad, 0);
  }

  getTotalAmount(): number {
    return this.items.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);
  }
}
