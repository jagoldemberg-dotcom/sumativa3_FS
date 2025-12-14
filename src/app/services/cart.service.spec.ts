// src/app/services/cart.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { CartService, CartItem } from './cart.service';
import { Product } from '../models/product.model';

describe('CartService', () => {
  let service: CartService;

  const mockProduct: Product = {
    id: 1,
    nombre: 'Mouse gamer',
    descripcion: 'Mouse gamer de prueba',
    precio: 10000,
    imagenUrl: 'assets/img/mouse.jpg'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);

    // Aseguramos partir “limpio”
    service.clear();
  });

  it('debería agregar un producto nuevo al carrito', () => {
    service.add(mockProduct);
    const items = service.getItems();

    expect(items.length).toBe(1);
    expect(items[0].producto.id).toBe(mockProduct.id);
    expect(items[0].cantidad).toBe(1);
  });

  it('debería aumentar la cantidad si se agrega el mismo producto', () => {
    service.add(mockProduct);
    service.add(mockProduct);

    const items = service.getItems();
    expect(items.length).toBe(1);
    expect(items[0].cantidad).toBe(2);
  });

  it('debería calcular cantidad total y monto total correctamente', () => {
    service.add(mockProduct); // 1 x 10000
    service.add(mockProduct); // 2 x 10000 = 20000

    const totalQty = service.getTotalQuantity();
    const totalAmount = service.getTotalAmount();

    expect(totalQty).toBe(2);
    expect(totalAmount).toBe(20000);
  });
});
