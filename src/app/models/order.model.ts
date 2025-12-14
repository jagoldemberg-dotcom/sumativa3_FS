import { CartItem } from '../services/cart.service';

export interface Order {
  id: number;
  fecha: string;      // YYYY-MM-DD
  total: number;
  estado: string;
  items: CartItem[];
  usuarioEmail: string;
}
