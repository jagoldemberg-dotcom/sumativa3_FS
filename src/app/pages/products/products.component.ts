import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
  productos: Product[] = [];
  terminoBusqueda = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productos = this.productService.getAll();
  }

  get productosFiltrados(): Product[] {
    const termino = this.terminoBusqueda.trim().toLowerCase();
    if (!termino) {
      return this.productos;
    }
    return this.productos.filter(p =>
      p.nombre.toLowerCase().includes(termino) ||
      p.descripcion.toLowerCase().includes(termino)
    );
  }

  addToCart(producto: Product): void {
    this.cartService.add(producto);
  }
}
