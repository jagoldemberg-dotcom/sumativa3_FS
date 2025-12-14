// src/app/services/product.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
  });

  it('debería devolver una lista de productos', () => {
    const productos = service.getAll();
    expect(productos.length).toBeGreaterThan(0);
  });

  it('debería encontrar un producto por id existente', () => {
    const productos = service.getAll();
    const id = productos[0].id;

    const encontrado = service.getById(id);

    expect(encontrado).toBeTruthy();
    expect(encontrado?.id).toBe(id);
  });

  it('debería devolver undefined para un id inexistente', () => {
    const encontrado = service.getById(999999);
    expect(encontrado).toBeUndefined();
  });
});
