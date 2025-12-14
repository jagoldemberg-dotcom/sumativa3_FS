import { Component, OnInit } from '@angular/core';
import { CartItem, CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  compraFinalizada = false;
  mensajeError = '';

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.items = this.cartService.getItems();
  }

  get total(): number {
    return this.cartService.getTotalAmount();
  }

  finalizarCompra(): void {
    this.mensajeError = '';

    if (this.items.length === 0) {
      return;
    }

    const usuario = this.authService.getUsuarioActual();
    if (!usuario) {
      this.mensajeError = 'Debes iniciar sesión para finalizar la compra.';
      this.router.navigate(['/login']);
      return;
    }

    this.orderService.registrarOrden(this.items, this.total, usuario.email);
    this.cartService.clear();
    this.items = [];
    this.compraFinalizada = true;
  }
}
