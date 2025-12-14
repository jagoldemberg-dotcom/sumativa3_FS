# TiendaderatasAngular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.17.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


---

## Mantenedor de Proveedores (JSON seed + CRUD LocalStorage)

La app incluye un mantenedor de **Proveedores** accesible solo para rol **admin**:

- Ruta: `/admin/proveedores`
- Seed inicial: lee un JSON remoto (recomendado subirlo a **GitHub Pages**)
- CRUD: Create/Update/Delete se persisten en **LocalStorage**

### 1) Configurar URL del JSON remoto

Edita en: `src/app/services/proveedor.service.ts`

```ts
private readonly seedUrl = 'https://TU_USUARIO.github.io/TU_REPO/proveedores.json';
```

> Si el JSON remoto no responde, la app hace fallback a `assets/data/proveedores.json`.

### 2) Formato de proveedores.json

El archivo debe ser un arreglo:

```json
[
  {
    "id": 1,
    "nombre": "RataSupply Ltda.",
    "contacto": "Carla Rivas",
    "email": "contacto@ratasupply.cl",
    "telefono": "+56 9 1111 2222",
    "direccion": "Av. Queso 123, Santiago",
    "activo": true,
    "categorias": ["Accesorios", "Periféricos"]
  }
]
```

---

## Docker (FrontEnd Angular)

### Build imagen

```bash
docker build -t tiendaderatas-frontend .
```

### Run contenedor

```bash
docker run --rm -p 8080:80 tiendaderatas-frontend
```

Abrir: `http://localhost:8080`
