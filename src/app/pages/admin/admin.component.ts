import { Component } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent {
  productos: Product[] = [];

  constructor(private productService: ProductService) {
    this.productos = this.productService.getAll();
  }
}
