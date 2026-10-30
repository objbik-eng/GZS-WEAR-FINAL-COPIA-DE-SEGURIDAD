# GZS WEAR — traspaso completo del proyecto

Actualizado el 29 de octubre de 2026. Documento de continuidad para un nuevo chat. **Este documento no contiene claves ni contraseñas.** Al retomarlo, comprobar el estado real antes de actuar: los sistemas externos, DNS y datos pueden haber cambiado.

## Último estado y acceso para el próximo chat — 30 de octubre de 2026

- El usuario quiere cerrar este chat. Continuar desde GitHub `objbik-eng/GZS-WEAR-FINAL` rama `main`, comprobando el commit remoto más reciente y el estado de producción https://gzs-wear-final.vercel.app. El contexto debe leerse junto con el código: este archivo describe decisiones y pendientes, no sustituye al repositorio.
- Accesorios se ha actualizado con fotos suministradas 17, 17B, 18, 18B, 19, 19B, 19C, 20 y 20B. Hero verde, título blanco Ahsing, DISRUPTIVE rojo Garet; secciones alternas en PC, imagen encima en móvil, fondo fijo y selector independiente. Las variantes se han asociado a su color: 17 negro, 18 crudo Oyster, 19 blanco y 19C rosa bebé, 20 negro. Las fichas seleccionan inicialmente el color de la imagen principal; el selector de color restringe las imágenes al color correspondiente. El acceso rápido de categoría usa e indica el color fotografiado, para no añadir por error otra variante al carrito. `modelColorId` es opcional en `Product`, `catalog.json`, `CategoryShowcase` y `ProductDetailClient`. No eliminar esta correspondencia al reconstruir el catálogo.
- Se han recibido también imágenes para camisetas y sudaderas de este chat; no afirmar que se necesitan todas de nuevo. Quedan pendientes otras imágenes que el usuario quiera mejorar o corregir, la revisión de fidelidad de diseños, renombrado/descripciones y problemas de lanzamiento que se listan abajo. No generar nuevas fotos de producto salvo solicitud posterior explícita.
- **Seguridad y acceso en un chat nuevo:** conectar o activar Vercel en ese chat y comprobar acceso al proyecto/equipo correcto. En este chat el conector figuraba habilitado pero `list_projects` devolvió acceso denegado: el usuario tendrá que revisar permisos y ámbito del equipo; no está garantizado que otro agente tenga acceso automático. El CLI de este entorno sí ha servido para despliegues, pero un entorno nuevo puede no conservar sesión. No compartir tokens en el chat, documento, Git ni enlaces.
- Las variables existentes están en el proyecto Vercel; no hace falta crear un segundo entorno ni copiarlas al repositorio. Usar la configuración de Vercel y las herramientas autorizadas para despliegues; solo si se necesita desarrollo local, recuperar **variables de desarrollo** en un `.env.local` ignorado por Git mediante sesión autorizada. Verificar la existencia de variables necesarias sin imprimir ni leer sus valores para pruebas. Algunas variables de tipo sensible podrían no ser recuperables: usar el panel y el procedimiento seguro oficial. Jamás transferir claves de producción a un nuevo agente o chat en texto claro. No afirmar que una conexión futura ya está concedida.
- El usuario compartió un token de GitHub en este chat; se aconsejó revocarlo o rotarlo en GitHub. No está incluido intencionalmente en este archivo ni configurado en la URL remota. Las conexiones de GitHub deben autenticarse por medio seguro, con permisos mínimos. No inferir que el nuevo chat tenga acceso.
- **Lección de persistencia:** el workspace recuperado llegó con `HEAD` anterior y archivos de sudaderas como cambios locales, aunque GitHub ya tenía commit posterior. Antes de editar o desplegar, comparar remoto, HEAD y archivos sin perder trabajo, recuperar history con `git fetch`, verificar ancestros y hashes. No hacer reset destructivo ni forzar push. Nunca desplegar una copia antigua.

## Instrucciones prioritarias para el próximo asistente

1. El usuario quiere una tienda profesional, estética y enfocada a vender, no una maqueta apresurada. Optimizar el recorrido y enriquecer el contenido, **sin eliminar elementos ni cambiar fuentes, colores o diseño sin permiso**. Mantener ES/EN, móvil y escritorio. No inventar datos, testimonios, urgencia, promociones ni garantías.
2. El usuario aportará **fotografías reales de los modelos vistiendo las prendas que vende**. No generar fotografías de modelos ni atribuir como real una imagen generada. Las imágenes generadas anteriormente no representan fielmente las prendas y están pendientes de revisión/sustitución. No generar nuevos modelos. Esperar originales y asociar cada foto al producto, cara, talla/color y variante correctos con confirmación cuando haya duda. No utilizar logos de terceros ajenos a la marca.
3. No hacer compras de prueba con dinero real. Los pagos solo se prueban en modo de pruebas. No publicar secretos, no pedirlos en el chat; emplear conexiones seguras y variables de entorno.
4. Antes de desplegar o sincronizar, comprobar la relación entre GitHub y los cambios locales. No hacer deploy desde un GitHub desactualizado ni forzar push: podría revertir producción. Leer el apartado Git antes de operar.

## Qué se ha hecho en la última petición

- Usuario detectó que al llegar desde la home, tienda repetía una gran portada y las mismas tres tarjetas de categoría, escondiendo los productos. Quería solucionar la redundancia, sin eliminar contenido.
- Producción: https://gzs-wear-final.vercel.app. Despliegue `gzs-wear-final-nhgb75uhy-gzs-wear.vercel.app`, commit de código `3cb103b`.
- La home conserva el hero, categorías, seis destacados, valores, newsletter y FAQ. Se añadió una breve sección editorial bilingüe sobre la colección. El botón principal lleva a `/tienda#todos` y su equivalente EN para llegar directamente al catálogo.
- La tienda conserva su hero WINGS ampliado y sus tarjetas de categorías, pero sitúa primero el catálogo completo, ahora visible por defecto, con filtros y ordenación; categorías pasan a continuación. Se conserva `#todos` y filtro inicial `?f=`.
- Compilación y TypeScript correctos. Probado en producción con Playwright en 390 y 1440 px: 20 productos en `/tienda` y `/en/shop`; filtro de camisetas devuelve 4; sin desbordamiento horizontal en esas vistas. Home mantiene 6 destacados. No se ha realizado una compra.
- El trabajo es una mejora concreta, **no una auditoría completa ni garantía de que todo el sitio esté terminado**. Continuar revisando páginas de categoría, fichas, cesta, accesibilidad, rendimiento, contenido, coherencia comercial y móviles/televisores si el usuario lo desea. El usuario ha usado una frase ambigua sobre televisiones: si se necesita compatibilidad TV específica, preguntar qué dispositivos y navegador tiene en mente.

## Actualización de camisetas — 30 de octubre de 2026

- El usuario envió 13 fotos, y autorizó expresamente usar tal cual las fotos que muestran «GZS WEAR BRANDS» o el logo de Nike en el calzado. No interpretar esta autorización puntual como permiso para cualquier otra imagen futura con marcas.
- Las fotos se asignaron por orden de catálogo y contraste de diseños, en `public/models/camisetas-usuario/`: principales 1–8 y extras para 2, 3, 6, 7 y 8; la imagen del puente se asoció a la camiseta 7 tras contrastar con el catálogo (en la lista del usuario faltaba su etiqueta). `modelImage` es el fondo fijo y la imagen inicial; las fotos extras están al inicio de la galería del color en `catalog.json`.
- Camisetas en `CategoryPage` usa cabecera verde, títulos Ahsing blancos y DISRUPTIVE Garet rojo. En `CategoryShowcase` alterna texto/imagen en escritorio; móvil imagen arriba. Cambiar el selector cambia solo la imagen principal, no el fondo. Las otras categorías mantienen su distribución anterior.
- Fotos suministradas por el usuario: no se ha verificado si son fotografías reales o imágenes sintéticas. No asegurar autenticidad. Typecheck y build correctos; prueba local a 390 y 1440 px de orden y selector.

## Actualización de sudaderas — 30 de octubre de 2026

- El usuario aportó las imágenes 9–16 y variantes B, más 13C. Las principales van en `public/models/sudaderas-usuario/<n>-principal.jpg` y las variantes a la galería de cada producto, respetando el orden del catálogo. Hero verde con Ahsing blanco y DISRUPTIVE rojo Garet, igual a camisetas; secciones alternadas escritorio, foto arriba en móvil y fondo fijo.
- Aviso de calidad: la foto 13C parece escribir «NOISSE» en lugar de «NOISE», distinto de 13B. El usuario pidió usarla, pero conviene sustituirla por una imagen fiel al producto si lo confirma. No generar ni retocar la prenda sin autorización.
- Tests locales 390/1440 y ES/EN: ocho secciones, alternancia, selector, fondo inmutable y sin desbordamiento.

## Identidad y requisitos del usuario

- Marca pública: **GZS WEAR**, nunca añadir BRANDS a la denominación visible. No mencionar proveedor salvo donde corresponda legalmente; no usar “bajo demanda”. No mencionar Stripe en textos de cliente. Sin promociones.
- Paleta: verde `#5e845f`, verde oscuro `#2e4a33`, rojo `#c1272d`, además de negro tinta, crema y dorado. No rediseñar colores ni tipografías sin indicación.
- Ahsing local en wordmark y títulos especificados; Garet Book/Heavy en textos indicados. Home: titular hero todo blanco en Ahsing, subtítulo rojo grande en Garet Heavy, botón verde. Tienda: COLECCIÓN/COLLECTION blanco en Ahsing y DISRUPTIVE rojo en Garet.
- **Licencia pendiente**: la copia de Ahsing conseguida estaba indicada para uso personal; obtener licencia web comercial adecuada antes de uso comercial. Garet Book/Heavy se consideró libre para uso comercial; verificar términos vigentes.
- Marquee en bucle sin huecos, con tres mensajes y separadores ✦. Newsletter verde sobre FAQ; Google Forms invisible con consentimiento. Menú móvil sin desbordamiento.
- Devoluciones 14 días; precios EUR; tallas S–2XL o talla única. Envío gratis en la UE desde 60 € según petición del usuario; envíos fuera UE a tarifa real. Nombres de producto EN idénticos en ambas versiones ES/EN cuando se renombren. No hacer promociones. Datos y promesas comerciales deben corresponder al funcionamiento real.

## Portadas e imágenes

- HOME: `/public/images/hero-home.jpg`, creada a partir de `/home/user/uploads/1.jpg`, tríptico pareja A-LTER/GOOD VIBES. MD5 del JPEG procesado: `2f235c6666b2551b08c906cb18218945`.
- TIENDA: `/public/images/hero-tienda.jpg`, de `/home/user/uploads/2 (2).jpg`, tríptico camiseta WINGS y esculturas. MD5 procesado: `4d029d3e1b56914a2309422573ffc202`.
- Ambos son originales facilitados por el usuario, convertidos a 1920×960 JPEG q85 progresivo. Mantener asignación: la pareja en home, WINGS en tienda. Tienda `min-h-[60vh] lg:min-h-[70vh]`, gradiente `from-black/50 via-black/28 to-black/10`; el usuario pidió que la portada se viera grande y no muy oscurecida.
- Tarjetas de categoría son imágenes facilitadas por usuario bajo `public/images/categorias`. No confundir las fotos originales con los modelos previamente generados en `public/models`. El usuario aportará sustituciones reales.
- Si se reemplaza una imagen en la misma ruta, Next Image puede servir una versión antigua: borrar `.next/cache` y reiniciar el servidor local; en producción verificar el despliegue, fichero directo y renderizado real. La caché del navegador/CDN también puede influir.
- Los originales en `uploads/` **no están incluidos en el historial Git del repositorio**. Guardar aparte los originales que el usuario quiera conservar; los procesados sí están en `public`.

## Pendientes de mayor prioridad

1. Revisar las fotos ya facilitadas y recibir las sustituciones adicionales que el usuario desee; comprobar fidelidad con cada prenda y variante. Se pidió originalmente cubrir hasta 20 productos, cuatro vistas por producto (hombre/mujer, frente/espalda), pero dependerá de los originales que entregue el usuario. No generar ni simular fotos de prendas.
2. Completar revisión profesional del recorrido de compra y contenido sin borrar ni cambiar identidad visual: páginas categoría, detalle de producto, tallas, información veraz, cesta/checkout, ayudas, SEO y accesibilidad. Probar ES/EN y móviles, escritorio y, si se concreta, televisión.
3. Renombrar y reescribir nombres y descripciones de los 20 productos ES/EN, de forma coherente y fiel; nombres en inglés pueden ser idénticos en ambas versiones. No afirmar materiales, resultados o características sin verificar.
4. **Inconsistencia comercial crítica: Irlanda.** El usuario solicitó envío gratis UE a partir de 60 €, pero `src/lib/shipping.ts` separa Irlanda en zona `ie` y aplica tarifa real, aunque Irlanda pertenece a la UE. La FAQ también dice que Irlanda paga tarifa real mientras el banner promete UE. Alinear política, checkout, legales y mensajes con la petición, verificando costes y consultando si es necesario antes de modificar tarifas; no asumir que ya está solucionado.
5. `Printify` producto `6adfa05af621e0ea4a0e2979` estaba bloqueado `is_locked` (código 8252); reintentar solo cuando el estado haya cambiado y con el alcance autorizado. Hay pendientes GPSR: contrastar datos, variantes y tabla de tallas. No cambiar listas de variantes parcialmente: PUT puede reemplazarlas.
6. DNS de `gzswear.roadshop.online`: pendiente TXT en `roadshop.online`, host `_vercel`, valor `vc-domain-verify=gzswear.roadshop.online,d8485c33f665b13ee799`. Comprobar el valor vigente en Vercel antes de aplicarlo: la verificación podría cambiar. Tras el corte, verificar SSL, formularios, checkout en test y webhook de pagos; desactivar webhook anterior solo tras validar el nuevo. Hay tres webhooks Printify obsoletos cuyo borrado por API dio 404: revisar en el panel, sin reintentos ciegos.
7. Sincronizar GitHub sin perder commits locales. Comprar/confirmar licencia Ahsing. Revisar legal, precios, envíos, garantía y textos de pago antes de lanzamiento.

## Arquitectura y ubicación del código

- En el workspace previo: `/home/user/new-repo`. Next.js 16 / React 19 / TypeScript / Tailwind 4. Bilingüe: ES raíz, EN `/en/...`; alias en `src/lib/routes.ts`, middleware/rewrite en raíz.
- Home `src/app/[lang]/page.tsx`; tienda `src/app/[lang]/tienda/page.tsx` y `ShopClient.tsx`; categorías `src/app/[lang]/camisetas`, `sudaderas`, `accesorios`; fichas `src/app/[lang]/producto`; componentes en `src/components`.
- Catálogo local: `src/lib/data/catalog.json`, lógica `src/lib/catalog.ts`; 20 productos, 8 camisetas (incluye 4 oversize), 8 sudaderas (incluye 4 hoodies), 2 gorras y 2 gorros. Imágenes `public/catalog`, `public/models`, `public/images`. Fuentes en `src/app/fonts`. `src/i18n/dict.ts` contiene traducciones; verificar también cadenas locales en componentes.
- Estado del carrito `src/context/CartContext.tsx`; checkout/API en `src/app/api`; envíos `src/lib/shipping.ts`; SEO `src/lib/seo.ts`; newsletter/contacto y Google Forms en `src/lib/google-forms.ts`. Formularios requieren consentimiento; ID formulario `1FAIpQLSfq9K9NKywkqZ8sdAUaeosRebWTjzBJTFAdEl_kO3wiVpl9xA`, campo `entry.624944565`. No supone prueba actual de entrega de formularios.
- Menú móvil: `HeaderClient.tsx` usa `createPortal(document.body)` porque backdrop blur en header creaba un containing block de fixed. Body scroll lock, Escape y `overflow-x: clip`; carrito aplica patrón similar. No revertir sin probar 320/360/390.
- Regla de titulares en `@layer base` para que clases de fuente ganen. Evitar regresión en marquee. `docs/AUDITORIA-LANZAMIENTO.md` es una auditoría histórica: contiene afirmaciones obsoletas, incluida denominación anterior, fuentes antiguas y políticas antiguas; prevalece este documento y la implementación verificada.

## Producción, Git y recuperación

- Proyecto GitHub indicado en contexto previo: `objbik-eng/GZS-WEAR-FINAL`, rama `main`. Se preparó la sincronización mediante autenticación facilitada por el usuario. Antes de la subida se verificó que la rama remota era ancestro de la rama local, sin divergencia. Verificar siempre la historia remota y el estado del último push antes de continuar; no asumir que un despliegue implica sincronización. Los commits de código recientes incluyen `f16d5ba`, `0623b6d`, `e4583d5`, `5fc909f` y `3cb103b`.
- Vercel se actualizó mediante CLI desde el repositorio local, independientemente de GitHub. El proyecto de producción es `gzs-wear-final`, alias https://gzs-wear-final.vercel.app. Autor git usado para evitar rechazo del despliegue: `objbik-eng <objbik@gmail.com>`.
- Para recuperar el código en otro chat, guardar y adjuntar el bundle de Git complementario si se facilitó. Git bundle contiene historial y archivos versionados, no variables `.env.local`, secretos ni imágenes originales de `uploads`. Ejemplo: `git clone GZS-WEAR-repositorio.bundle nuevo-proyecto`, y consultar `git log --oneline` y `git status`. Restaurar la configuración de entorno por canal seguro y conectar el proyecto Vercel si se requiere. Verificar también las imágenes originales faltantes con el usuario.
- Para sincronizar: conectar GitHub de forma segura o trabajar desde un entorno autenticado del usuario; añadir remoto sin incluir tokens en URL almacenada, inspeccionar `git fetch`, `git log --left-right` y divergencia. Integrar sin sobrescribir historia remota. No pegar PAT en el chat ni incluirlo en archivos/comandos compartidos. No forzar push.
- Nunca asumir que un workspace de un chat nuevo tendrá los archivos del anterior: el usuario debe adjuntar el MD y el bundle, o acceder al repositorio sincronizado. La fuente de verdad es Git + archivos originales + configuraciones externas por separado.

## Pruebas técnicas y despliegue

- `npm ci`; `npm run typecheck`; `npm run build`. Desarrollo o pruebas: servidor Next vinculado a `0.0.0.0` en entorno preview. Revisar móvil, escritorio, rutas ES/EN, enlaces, filtros, fichas, navegación, imagen y ausencia de desbordamiento. No hacer compras reales.
- Mantener variables de entorno fuera de Git, según `.env.example`; no poner secretos en este documento ni en el repositorio. `.env.local`, `.vercel`, tokens y configuraciones de terceros no se incluyen en bundle.
- Históricamente se usó `npx vercel --prod` con credenciales seguras en el entorno. Validar qué proyecto/cuenta y autorización aplican antes de desplegar. Verificar alias y resultado efectivo tras cada despliegue. Un deploy Vercel exitoso no equivale a sincronización GitHub.
- No instalar ni usar `sharp` manualmente si el entorno da problemas; Pillow ha funcionado para imágenes. Para nuevas fotos usar sólo las facilitadas, preservar originales y optimizar sin falsear el producto.

## Datos comerciales históricos: verificar antes de confiar

Precios publicados previamente: tee 27,95 €, oversize 39,95 €, crewneck 44,95 €, hoodie 49,95 €, gorra 32,95 €, gorro 28,95 €. Costes de proveedor y transporte cambian: revisar fuente oficial antes de decisiones económicas. Hay política y código de envíos en conflicto para Irlanda; no presentar esta parte como resuelta. La antigua auditoría contiene cifras, verificaciones, enlaces y posibles afirmaciones ya obsoletas.
