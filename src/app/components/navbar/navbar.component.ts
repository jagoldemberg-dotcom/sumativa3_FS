import { Component, Input } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  @Input() titulo = 'Tienda de ratas';

  isCollapsed = true;
  usuarioActual: Usuario | null = null;

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe(usuario => {
      this.usuarioActual = usuario;
    });
  }

  get totalItems(): number {
    return this.cartService.getTotalQuantity();
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
  }
}
