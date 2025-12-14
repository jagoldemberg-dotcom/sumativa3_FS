import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit {
  pedidos: Order[] = [];

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.getUsuarioActual();
    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }

    this.pedidos = this.orderService.obtenerOrdenesPorUsuario(usuario.email);
  }
}
