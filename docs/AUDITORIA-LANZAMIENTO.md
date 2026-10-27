# Auditoría de lanzamiento — GZS WEAR BRANDS

_Última actualización: 2026-10-27. Tienda nueva (Next.js) desplegada en producción; pendiente el corte de DNS del dominio._

## 1. Identidad técnica

| Elemento | Valor |
| --- | --- |
| Repositorio | `objbik-eng/GZS-WEAR-FINAL` (privado), rama `main` |
| Proyecto Vercel nuevo | `gzs-wear-final` — `prj_tO4srVijj933tP4ZNCqZnspPlhpT` |
| Alias funcional | https://gzs-wear-final.vercel.app (200, salud OK) |
| Dominio final | https://gzswear.roadshop.online (asignado al proyecto nuevo, **pendiente verificación TXT**) |
| Proyecto Vercel viejo | `prj_5ZAMha2f71MqcJNeGYI18vHNU5V0` (HTML estático, sin dominio asignado ahora) |
| Tienda de producción | GZS WEAR BRANDS — id `29488386` |
| Stripe (live, EUR, ES) | cuenta `acct_1U5pJdGLo0cfGfuX` |
| Supabase | proyecto `apsqrzhvrlcnkffmaovt` |
| Email transaccional | Resend, dominio remitente configurado, `EMAILS_ENABLED=true` en Vercel |

## 2. Bloqueante único: corte del dominio (acción manual en el DNS)

Vercel exige una verificación TXT nueva cada vez que el dominio se reasigna entre proyectos. El registro a crear en el panel DNS de `roadshop.online` es:

- **Tipo:** TXT
- **Host/nombre:** `_vercel` (es decir, `_vercel.roadshop.online`)
- **Valor:** `vc-domain-verify=gzswear.roadshop.online,d8485c33f665b13ee799`

El registro A/CNAME ya apunta a la red edge de Vercel (responde el edge), así que en cuanto se propague el TXT y Vercel verifique, el dominio servirá la tienda nueva y se emitirá el SSL automáticamente. No volver a desasignar el dominio del proyecto nuevo: cada reasignación rota el valor del TXT.

Verificación del corte:

```bash
curl -s https://gzswear.roadshop.online/api/health      # debe responder ok:true, catalog:20
```

## 3. Checklist de requisitos

### Marca y estética
- [x] Paleta Pull&Bear streetwear: verde `#5E845F` + blanco, acento oro `#D39905`, negro tinta.
- [x] Logos verde (fondos claros) y blanco (footer oscuro) en `/public/brand`.
- [x] Tipografías Archivo (display), Inter (texto), Pirata One (acento logo), autoalojadas con `next/font`.
- [x] Marquee superior, tarjetas, botones y forms con el sistema de diseño corporativo.

### Arquitectura, URLs e i18n
- [x] URLs limpias sin `.html`; redirects 301 de las viejas `.html` en `vercel.json`.
- [x] ES por defecto sin prefijo (`/tienda`, `/producto/...`); EN bajo `/en/...` con alias ingleses (`/en/shop`, `/en/product/...`).
- [x] Middleware con reescrituras internas; activos estáticos excluidos (`/brand`, `/images`, `/models`, `/catalog`).
- [x] Página 404 bilingüe.

### SEO
- [x] Canonical y hreflang `es-ES`, `en-US`, `en`, `x-default` en home y fichas.
- [x] Open Graph + Twitter Cards; `og-default.jpg` 1200×630.
- [x] JSON-LD: Organization, WebSite, CollectionPage/ItemList y Product (fichas).
- [x] `sitemap.xml` con 56 URLs y `robots.txt` generados con el dominio real; `/api`, carrito y checkout bloqueados.
- [x] Verificación Google conservada: `public/googlec2e45e8990a69adf.html`.
- [x] Metadatos SERP (title/description) por ruta y por idioma.

### Catálogo (colección 001 DISRUPTIVE, 20 productos, unisex)
- [x] 8 camisetas (4 oversize), 8 sudaderas (4 con capucha), 2 gorras, 2 gorros.
- [x] Solo tallas S–2XL (+ talla única en accesorios); XS y >2XL desactivadas en Printify.
- [x] Precios fijos EUR: tee 27,95 · oversize 39,95 · crewneck 44,95 · hoodie 49,95 · gorra 32,95 · gorro 28,95.
- [x] Tabla de tallas métrica (cm) y GPSR (HONSON VENTURES LIMITED, gpsr@honsonventures.com, Limassol CY) en las 20 fichas.
- [x] 19/20 productos actualizados en Printify (título ES, descripción con tabla cm, `safety_information`, variantes).
- [ ] **1 producto bloqueado:** Camiseta Archivo Galería `6adfa05af621e0ea4a0e2979` — Printify devuelve código 8252 `is_locked=true`. Reintentar con:
  ```bash
  cd ~/new-repo && PRINTIFY_TOKEN=$(cat ~/.printify_token) npm run printify:apply -- --id=6adfa05af621e0ea4a0e2979
  ```
- [x] Imágenes de producto autoalojadas en `/public/catalog` (119 archivos, 12 MB): ninguna URL pública revela al proveedor.
- [x] 10/20 fotos de modelo hiperrealistas (productos 0–9) en `/public/models`, integradas como primera imagen de galería + sección "Llevada en la calle".
- [ ] Resto de fotos de modelo (10 productos, índices 10–19): siguientes turnos, máximo 10 imágenes por turno.

### Confidencialidad de marca
- [x] Cero menciones al proveedor o "print on demand" en páginas de cliente (verificado con barrido del HTML, incluye payload RSC).
- [x] Únicas menciones: aviso legal y política de privacidad, donde es legalmente exigible.
- [x] Campo interno `printifyId` renombrado a `productId`; endpoint de salud con claves neutras (`catalogShop`, `catalogConfigured`).
- [x] Webhook de producción renombrado a ruta neutra `/api/fulfillment-webhook` (firma HMAC obligatoria, 401 sin firma válida).
- [x] Sin código de descuento del 10% ni promos (GZS10/ENVIOGRATIS eliminados).

### Carrito, pagos y envíos
- [x] Carrito responsive con persistencia; Stripe Checkout live en EUR.
- [x] Probado: ES 60,90 € → envío 0 €; GB 60,90 € + 8,16 € = 69,06 €; cesta vacía rechazada; talla inválida rechazada; sesión crea pedido `pending` en Supabase.
- [x] Umbral envío gratis UE: 60 €; tarifa plana 4,95 € por debajo.
- [x] Irlanda, Reino Unido y EE. UU.: tarifa real íntegra aunque se supere el umbral.
- [x] Newsletter "Únete a GZS WEAR BRANDS" operativa (Supabase) y página de contacto con gzswear@roadshop.online.
- [x] Documentos legales actualizados: aviso legal, privacidad, términos, cookies, envíos/devoluciones (30 días, garantía 2 años GPSR).

### Integración y webhooks
- [x] 4 webhooks de Printify apuntando a `https://gzswear.roadshop.online/api/fulfillment-webhook` (temas sent-to-production, shipment created/delivered, order updated), firmados con secreto.
- [x] Webhook Stripe nuevo `we_1UVB4uGLo0cfGfuXq3BR8WLA` (secreto en env de Vercel), eventos `checkout.session.completed`, `async_payment_succeeded`, `charge.refunded`.
- [ ] **Tras el corte DNS:** enviar evento de prueba Stripe y verificar firma 200; entonces desactivar el webhook viejo `we_1USxWpGLo0cfGfuXBEbefP18`.
- [x] Limpieza: 3 webhooks viejos de Printify (ruta `/api/printify-webhook`) no se pueden borrar por un bug del API (404 persistente en DELETE/PUT). Como la ruta ya no existe, nunca procesan; borrado manual pendiente desde el panel de Printify. IDs: `6ae0b247685e9cba6c035dff`, `6ae0b247f4a444fbc8011440`, `6ae0b247a9f5f4a3f8019776`.

## 4. Evidencias de calidad (producción, alias nuevo)

- Rutas clave ES/EN/legales/robots/sitemap: todas 200.
- Barrido de términos prohibidos: 0 ocurrencias en cliente; 1 por página legal (exigible).
- `/api/health`: `ok:true`, `catalog:20`, Stripe/catálogo/Supabase configurados, `emailsEnabled:true`.
- Imágenes estáticas y optimizadas (`/_next/image`) de catálogo y modelos: 200 `image/jpeg`.
- Build: 76 páginas estáticas, sin errores TypeScript ni ESLint.

## 5. Tareas pendientes tras el corte

1. Verificar TXT y SSL del dominio (sección 2).
2. Probar webhook Stripe nuevo y desactivar el viejo.
3. Reintentar el producto Printify bloqueado.
4. Generar las 10 fotos de modelo restantes (y regenerar la foto "Alas del Silencio" con calzado sin logotipos ajenos).
5. Borrar manualmente los 3 webhooks obsoletos en el panel Printify.
6. Decidir el destino del proyecto Vercel viejo (conservar como respaldo o archivar).
7. Auditoría visual final en móvil/escritorio y prueba de compra real con pago pequeño + reembolso.
