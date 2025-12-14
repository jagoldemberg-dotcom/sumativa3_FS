# Seed JSON para GitHub Pages

1) Crea un repo (ej: `tiendaderatas-seed`) en GitHub y sube este archivo `proveedores.json` a la raíz.

2) Habilita GitHub Pages:
- Settings → Pages
- Source: Deploy from a branch
- Branch: `main` / `(root)`
- Save

3) Obtén la URL pública (ejemplo):
`https://TU_USUARIO.github.io/tiendaderatas-seed/proveedores.json`

4) Copia esa URL en:
`src/app/services/proveedor.service.ts` (variable `seedUrl`)
