import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable()
export class ProductService {
  private productos: Product[] = [
    {
      id: 1,
      nombre: 'Audífonos gamer',
      descripcion: 'Audífonos con sonido envolvente para tu setup.',
      precio: 29990,
      imagenUrl: 'assets/img/audifonos.jpg'
    },
    {
      id: 2,
      nombre: 'Mouse gamer',
      descripcion: 'Mouse con alta precisión y luces RGB.',
      precio: 19990,
      imagenUrl: 'assets/img/mouse.jpg'
    },
    {
      id: 3,
      nombre: 'Teclado mecánico',
      descripcion: 'Teclado mecánico retroiluminado para largas sesiones de juego.',
      precio: 39990,
      imagenUrl: 'assets/img/teclado.jpg'
    }
  ];

  getAll(): Product[] {
    return this.productos;
  }

  getById(id: number): Product | undefined {
    return this.productos.find(p => p.id === id);
  }
}
