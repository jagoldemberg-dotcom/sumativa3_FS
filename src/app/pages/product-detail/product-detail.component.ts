import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit {
  producto?: Product;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : NaN;
    if (!isNaN(id)) {
      this.producto = this.productService.getById(id);
    }
  }

  volverAlListado(): void {
    this.router.navigate(['/products']);
  }

  agregarAlCarrito(producto?: Product): void {
    if (!producto) {
      return;
    }
    this.cartService.add(producto);
  }
}
