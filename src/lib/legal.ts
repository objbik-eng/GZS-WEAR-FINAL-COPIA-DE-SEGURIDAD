import type { Locale } from "@/i18n/dict";

export interface LegalBlock {
  h2?: { es: string; en: string };
  p?: { es: string; en: string };
  ul?: { es: string[]; en: string[] };
  table?: { head: { es: string[]; en: string[] }; rows: { es: string[][]; en: string[][] } };
}

export interface LegalDoc {
  key: string;
  title: { es: string; en: string };
  description: { es: string; en: string };
  blocks: LegalBlock[];
}

const HOLDER = {
  es: [
    "Titular: GZS WEAR BRANDS (marca comercial)",
    "NIF: 50633140C",
    "Domicilio: Calle Granada 269A, Calypo Fado, 45950 Casarrubios del Monte (Toledo), España",
    "Email: gzswear@roadshop.online",
    "Actividad: comercio electrónico de prendas y accesorios de moda de diseño propio.",
  ],
  en: [
    "Owner: GZS WEAR BRANDS (commercial brand)",
    "Tax ID (NIF): 50633140C",
    "Address: Calle Granada 269A, Calypo Fado, 45950 Casarrubios del Monte (Toledo), Spain",
    "Email: gzswear@roadshop.online",
    "Activity: online sale of own-design fashion garments and accessories.",
  ],
};

export const LEGAL_DOCS: LegalDoc[] = [
  {
    key: "aviso-legal",
    title: { es: "Aviso legal", en: "Legal notice" },
    description: {
      es: "Datos del titular, condiciones de uso y propiedad intelectual del sitio GZS WEAR BRANDS.",
      en: "Owner details, terms of use and intellectual property of the GZS WEAR BRANDS website.",
    },
    blocks: [
      {
        h2: { es: "1. Titular del sitio", en: "1. Website owner" },
        p: {
          es: "En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSICE), se identifican los datos del responsable:",
          en: "In compliance with Article 10 of Spanish Law 34/2002 on Information Society Services and Electronic Commerce (LSSICE), the responsible party is identified as follows:",
        },
        ul: HOLDER,
      },
      {
        h2: { es: "2. Objeto y modelo de producción", en: "2. Purpose and production model" },
        p: {
          es: "Este sitio comercializa prendas y accesorios de diseño exclusivo de GZS WEAR BRANDS, fabricados bajo demanda (modelo print on demand) a través de la plataforma Printify, que asigna cada pedido a talleres especializados, principalmente en Europa. La producción bajo pedido evita sobrestock y reduce el desperdicio textil. El diseño, la marca y la relación comercial son responsabilidad de GZS WEAR BRANDS.",
          en: "This website sells garments and accessories exclusively designed by GZS WEAR BRANDS, manufactured on demand (print-on-demand model) through the Printify platform, which assigns each order to specialised workshops, mainly in Europe. Made-to-order production prevents overstock and reduces textile waste. The design, brand and commercial relationship remain the responsibility of GZS WEAR BRANDS.",
        },
      },
      {
        h2: { es: "3. Condiciones de uso", en: "3. Terms of use" },
        p: {
          es: "El acceso al sitio es libre y gratuito. El usuario se compromete a hacer un uso lícito y diligente de los contenidos, sin realizar actividades que lesionen derechos de terceros o que perturben el funcionamiento del sitio.",
          en: "Access to the website is free. Users undertake to make lawful and diligent use of its contents, without carrying out activities that infringe third-party rights or disrupt the operation of the site.",
        },
      },
      {
        h2: { es: "4. Propiedad intelectual e industrial", en: "4. Intellectual and industrial property" },
        p: {
          es: "Todos los diseños gráficos, ilustraciones, tipografías, fotografías, textos, logotipos y signos distintivos son creaciones originales de GZS WEAR BRANDS y están protegidos por la normativa de propiedad intelectual e industrial. Queda prohibida su reproducción, distribución o transformación, total o parcial, sin autorización escrita, así como su uso para fabricación por terceros.",
          en: "All graphic designs, illustrations, typography, photographs, texts, logos and distinctive signs are original creations of GZS WEAR BRANDS, protected by intellectual and industrial property law. Their reproduction, distribution or transformation, in whole or in part, as well as their use for third-party manufacturing, is prohibited without written authorisation.",
        },
      },
      {
        h2: { es: "5. Responsabilidad", en: "5. Liability" },
        p: {
          es: "El titular no se responsabiliza de interrupciones del servicio ajenas a su control, del mal uso de los contenidos por terceros, ni de los daños derivados de indisponibilidades técnicas de los proveedores de pago, logística o producción. Los enlaces a sitios de terceros se incluyen únicamente con fines informativos.",
          en: "The owner is not liable for service interruptions beyond its control, misuse of contents by third parties, or damage arising from technical unavailability of payment, logistics or production providers. Links to third-party websites are included for information purposes only.",
        },
      },
      {
        h2: { es: "6. Legislación aplicable", en: "6. Applicable law" },
        p: {
          es: "La relación entre el titular y los usuarios se rige por la legislación española y de la Unión Europea. Para cualquier controversia, las partes se someten a los juzgados y tribunales del domicilio del consumidor cuando así corresponda legalmente.",
          en: "The relationship between the owner and users is governed by Spanish and European Union law. Any dispute shall be submitted to the courts of the consumer's domicile where legally applicable.",
        },
      },
    ],
  },
  {
    key: "terminos",
    title: { es: "Términos y condiciones", en: "Terms & conditions" },
    description: {
      es: "Condiciones generales de contratación de GZS WEAR BRANDS: precios, pagos, envíos, devoluciones y garantías.",
      en: "General contracting terms of GZS WEAR BRANDS: pricing, payments, shipping, returns and warranties.",
    },
    blocks: [
      {
        h2: { es: "1. Ámbito y aceptación", en: "1. Scope and acceptance" },
        p: {
          es: "Las presentes condiciones regulan la venta online de productos GZS WEAR BRANDS a través de este sitio. La realización de un pedido implica la aceptación íntegra de las mismas. Todos los productos son unisex y se ofrecen en tallas de la S a la 2XL, salvo accesorios de talla única.",
          en: "These terms govern the online sale of GZS WEAR BRANDS products through this website. Placing an order implies full acceptance. All products are unisex and available in sizes S to 2XL, except one-size accessories.",
        },
      },
      {
        h2: { es: "2. Precios, IVA y moneda", en: "2. Prices, VAT and currency" },
        p: {
          es: "Todos los precios se muestran en euros (€) e incluyen el Impuesto sobre el Valor Añadido (IVA) aplicable. Los gastos de envío se detallan antes del pago. GZS WEAR BRANDS se reserva el derecho a modificar precios y productos, sin que los cambios afecten a pedidos ya confirmados.",
          en: "All prices are shown in euros (€) and include applicable VAT. Shipping costs are shown before payment. GZS WEAR BRANDS reserves the right to modify prices and products, without changes affecting orders already confirmed.",
        },
      },
      {
        h2: { es: "3. Proceso de compra y pago", en: "3. Ordering and payment" },
        p: {
          es: "El pago se procesa de forma segura mediante Stripe, aceptando tarjeta, Apple Pay, Google Pay y otros métodos locales como Bizum según dispositivo. GZS WEAR BRANDS no almacena datos bancarios. El contrato se entiende perfeccionado al confirmarse el pago y recibir la confirmación por email.",
          en: "Payment is securely processed by Stripe, accepting cards, Apple Pay, Google Pay and local methods such as Bizum depending on device. GZS WEAR BRANDS never stores bank details. The contract is concluded once payment is confirmed and the email confirmation is received.",
        },
      },
      {
        h2: { es: "4. Envíos", en: "4. Shipping" },
        p: {
          es: "Tarifas de envío: en la Unión Europea (UE-27, salvo Irlanda), el envío estándar es gratuito en pedidos a partir de 60 €; por debajo de ese importe la tarifa plana es de 4,95 €. Irlanda, Reino Unido, Estados Unidos y países EFTA tienen tarifas reales según zona, no subvencionadas y a cargo del cliente con independencia del importe del pedido. Los plazos orientativos (producción incluida) son: UE 5–10 días laborables; Irlanda y Reino Unido 5–15; EFTA 5–15; Estados Unidos 10–30.",
          en: "Shipping rates: within the European Union (EU-27 except Ireland), standard shipping is free for orders over €60; below that amount a flat rate of €4.95 applies. Ireland, the United Kingdom, the United States and EFTA countries have real, non-subsidised zone rates paid by the customer regardless of order value. Indicative delivery times (including production): EU 5–10 business days; Ireland and the UK 5–15; EFTA 5–15; United States 10–30.",
        },
      },
      {
        h2: { es: "5. Desistimiento y devoluciones", en: "5. Withdrawal and returns" },
        p: {
          es: "Tienes derecho a desistir de la compra en un plazo de 14 días naturales desde la recepción, sin necesidad de justificación; GZS WEAR BRANDS amplía voluntariamente este plazo a 30 días naturales. La prenda debe devolverse sin usar, con su etiquetado y embalaje original. Para iniciar una devolución, escribe a gzswear@roadshop.online indicando tu número de pedido. El reembolso se realiza al método de pago original en un máximo de 14 días tras recibir la mercancía. Los gastos de devolución corren a cargo del cliente, salvo producto defectuoso o pedido incorrecto, en cuyo caso los asumimos nosotros.",
          en: "You have the right to withdraw from the purchase within 14 calendar days of delivery without giving any reason; GZS WEAR BRANDS voluntarily extends this period to 30 calendar days. Garments must be returned unworn, with original tags and packaging. To start a return, email gzswear@roadshop.online with your order number. Refunds are issued to the original payment method within 14 days of receiving the goods. Return shipping is paid by the customer, except for defective or incorrect items, which are covered by us.",
        },
      },
      {
        h2: { es: "6. Garantía y productos defectuosos", en: "6. Warranty and defective products" },
        p: {
          es: "De conformidad con la Directiva (UE) 2019/771, los productos disponen de garantía legal de dos años por falta de conformidad. Si tu prenda presenta un defecto de fabricación, contacta con nosotros y gestionaremos la reposición o el reembolso sin coste. La garantía no cubre el desgaste por uso indebido ni los daños accidentales.",
          en: "In accordance with EU Directive (EU) 2019/771, products carry a two-year legal warranty against lack of conformity. If your garment has a manufacturing defect, contact us and we will arrange a free replacement or refund. The warranty does not cover misuse wear or accidental damage.",
        },
      },
      {
        h2: { es: "7. Información de seguridad del producto (GPSR)", en: "7. Product safety information (GPSR)" },
        p: {
          es: "En cumplimiento del Reglamento (UE) 2023/988 (Reglamento General de Seguridad de los Productos, GPSR), cada ficha de producto incluye la información de seguridad, instrucciones de cuidado y datos del representante económico en la UE. Responsable económico en la UE para los productos fabricados por los talleres: HONSON VENTURES LIMITED, gpsr@honsonventures.com, 3 Gnaftis House, flat 102, Mesa Geitonia, 4003, Limassol, Chipre.",
          en: "In compliance with Regulation (EU) 2023/988 (General Product Safety Regulation, GPSR), every product page includes safety information, care instructions and EU economic operator details. EU economic operator for workshop-manufactured products: HONSON VENTURES LIMITED, gpsr@honsonventures.com, 3 Gnaftis House, flat 102, Mesa Geitonia, 4003, Limassol, Cyprus.",
        },
      },
      {
        h2: { es: "8. Atención al cliente", en: "8. Customer support" },
        p: {
          es: "Para cualquier incidencia, escribe a gzswear@roadshop.online o utiliza el formulario de contacto. Respondemos en un plazo máximo de 24 horas laborables.",
          en: "For any issue, email gzswear@roadshop.online or use the contact form. We reply within 24 working hours at the latest.",
        },
      },
    ],
  },
  {
    key: "privacidad",
    title: { es: "Política de privacidad", en: "Privacy policy" },
    description: {
      es: "Cómo GZS WEAR BRANDS trata tus datos personales conforme al RGPD y la LOPDGDD.",
      en: "How GZS WEAR BRANDS processes your personal data under the GDPR and Spanish LOPDGDD.",
    },
    blocks: [
      {
        h2: { es: "1. Responsable del tratamiento", en: "1. Data controller" },
        ul: HOLDER,
      },
      {
        h2: { es: "2. Datos que tratamos y finalidades", en: "2. Data we process and purposes" },
        p: {
          es: "Tratamos los datos que nos facilitas (identificación, email, dirección de envío, teléfono y datos de pago, estos últimos procesados por Stripe) para: gestionar tu pedido y su producción; tramitar envíos, devoluciones y garantías; enviar confirmaciones y seguimiento; atender consultas; y, con tu consentimiento, gestionar la suscripción a la newsletter con novedades y descuentos.",
          en: "We process the data you provide (identity, email, shipping address, phone and payment details, the latter processed by Stripe) to: manage your order and its production; handle shipping, returns and warranties; send confirmations and tracking; answer enquiries; and, with your consent, manage newsletter subscriptions with news and discounts.",
        },
      },
      {
        h2: { es: "3. Base jurídica", en: "3. Legal basis" },
        p: {
          es: "La gestión del pedido se basa en la ejecución del contrato (art. 6.1.b RGPD); las obligaciones fiscales y contables, en el cumplimiento legal (art. 6.1.c); la newsletter y comunicaciones opcionales, en tu consentimiento (art. 6.1.a), que puedes retirar en cualquier momento; y la prevención del fraude, en el interés legítimo (art. 6.1.f).",
          en: "Order management is based on contract performance (Art. 6(1)(b) GDPR); tax and accounting obligations on legal compliance (Art. 6(1)(c)); the newsletter and optional communications on your consent (Art. 6(1)(a)), which you can withdraw at any time; and fraud prevention on legitimate interest (Art. 6(1)(f)).",
        },
      },
      {
        h2: { es: "4. Destinatarios y transferencias", en: "4. Recipients and transfers" },
        p: {
          es: "Compartimos datos estrictamente necesarios con: Stripe (pagos), la plataforma de producción bajo demanda Printify y sus talleres (fabricación y envío, principalmente dentro de la UE), el proveedor de correo transaccional Resend Inc. (EE. UU., amparado por garantías contractuales) y el proveedor de base de datos alojado en la UE. No vendemos datos personales.",
          en: "We share strictly necessary data with: Stripe (payments), the print-on-demand production platform Printify and its workshops (manufacturing and shipping, mainly within the EU), the transactional email provider Resend Inc. (US, covered by contractual safeguards) and a database provider hosted in the EU. We do not sell personal data.",
        },
      },
      {
        h2: { es: "5. Plazos de conservación", en: "5. Retention periods" },
        p: {
          es: "Los datos de pedidos se conservan mientras dura la relación contractual y, después, durante los plazos legales aplicables (fiscales y de garantía, hasta 5 años). Los datos de newsletter se conservan hasta que te das de baja. Los datos de contacto se conservan mientras sea necesaria la gestión de la consulta.",
          en: "Order data is kept for the duration of the contractual relationship and, afterwards, for the applicable legal periods (tax and warranty, up to 5 years). Newsletter data is kept until you unsubscribe. Contact data is kept for as long as needed to handle the enquiry.",
        },
      },
      {
        h2: { es: "6. Tus derechos", en: "6. Your rights" },
        p: {
          es: "Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a gzswear@roadshop.online, adjuntando copia de tu documento de identidad. Tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (aepd.es).",
          en: "You may exercise your rights of access, rectification, erasure, objection, restriction and portability by emailing gzswear@roadshop.online with a copy of your ID. You may also lodge a complaint with the Spanish Data Protection Agency (aepd.es).",
        },
      },
    ],
  },
  {
    key: "cookies",
    title: { es: "Política de cookies", en: "Cookie policy" },
    description: {
      es: "Uso de cookies técnicas y de preferencias en el sitio GZS WEAR BRANDS.",
      en: "Use of technical and preference cookies on the GZS WEAR BRANDS website.",
    },
    blocks: [
      {
        h2: { es: "1. ¿Qué son las cookies?", en: "1. What are cookies?" },
        p: {
          es: "Las cookies son pequeños archivos que se almacenan en tu dispositivo al navegar y que permiten recordar preferencias y mantener la cesta de compra.",
          en: "Cookies are small files stored on your device while browsing that remember preferences and keep your shopping cart.",
        },
      },
      {
        h2: { es: "2. Cookies que utilizamos", en: "2. Cookies we use" },
        p: {
          es: "Este sitio utiliza únicamente cookies estrictamente necesarias y de preferencias: mantenimiento de la cesta de compra, idioma elegido y seguridad de sesión. No utilizamos cookies publicitarias ni de seguimiento entre sitios. El proveedor de pago Stripe puede utilizar sus propias cookies técnicas durante el proceso de pago, fuera de nuestro control.",
          en: "This website only uses strictly necessary and preference cookies: shopping cart persistence, chosen language and session security. We do not use advertising or cross-site tracking cookies. The payment provider Stripe may use its own technical cookies during checkout, beyond our control.",
        },
      },
      {
        h2: { es: "3. Gestión en el navegador", en: "3. Browser management" },
        p: {
          es: "Puedes bloquear o eliminar cookies desde la configuración de tu navegador. Ten en cuenta que, si las desactivas, la cesta de compra y algunas preferencias podrían no funcionar correctamente.",
          en: "You can block or delete cookies through your browser settings. Note that disabling them may prevent the shopping cart and some preferences from working correctly.",
        },
      },
    ],
  },
  {
    key: "envios-devoluciones",
    title: { es: "Envíos y devoluciones", en: "Shipping & returns" },
    description: {
      es: "Zonas, plazos, tarifas de envío y política de devoluciones de GZS WEAR BRANDS.",
      en: "Shipping zones, delivery times, rates and the GZS WEAR BRANDS returns policy.",
    },
    blocks: [
      {
        h2: { es: "1. Producción bajo pedido", en: "1. Made-to-order production" },
        p: {
          es: "Cada prenda se produce expresamente para ti tras el pago. La producción tarda habitualmente de 2 a 5 días laborables; a este plazo se suma el transporte según la zona.",
          en: "Each garment is produced for you after payment. Production usually takes 2–5 business days, on top of the transport time for your zone.",
        },
      },
      {
        h2: { es: "2. Zonas y tarifas de envío", en: "2. Shipping zones and rates" },
        table: {
          head: {
            es: ["Zona", "Tarifa", "Plazo total orientativo"],
            en: ["Zone", "Rate", "Indicative total time"],
          },
          rows: {
            es: [
              ["Unión Europea (UE-27, salvo Irlanda)", "Gratis ≥ 60 € · 4,95 € si no", "5–10 días laborables"],
              ["Irlanda", "Tarifa real según producto (a cargo del cliente)", "5–15 días laborables"],
              ["Reino Unido", "Tarifa real según producto (a cargo del cliente)", "5–15 días laborables"],
              ["EFTA (Noruega, Islandia, Suiza, Liechtenstein)", "Tarifa real según producto (a cargo del cliente)", "5–15 días laborables"],
              ["Estados Unidos", "Tarifa real según producto (a cargo del cliente)", "10–30 días laborables"],
            ],
            en: [
              ["European Union (EU-27 except Ireland)", "Free over €60 · €4.95 otherwise", "5–10 business days"],
              ["Ireland", "Real product-based rate (paid by customer)", "5–15 business days"],
              ["United Kingdom", "Real product-based rate (paid by customer)", "5–15 business days"],
              ["EFTA (Norway, Iceland, Switzerland, Liechtenstein)", "Real product-based rate (paid by customer)", "5–15 business days"],
              ["United States", "Real product-based rate (paid by customer)", "10–30 business days"],
            ],
          },
        },
      },
      {
        h2: { es: "3. Envío gratuito en la UE", en: "3. Free EU shipping" },
        p: {
          es: "El umbral de envío gratuito (60 €) se calcula sobre el importe de los productos, antes de impuestos ya incluidos en el precio. En Irlanda, Reino Unido, EE. UU. y EFTA no aplica el umbral de envío gratuito: se cobra la tarifa real de la zona aunque el pedido supere los 60 €, dado el mayor coste logístico.",
          en: "The free-shipping threshold (€60) is calculated on the product amount, with taxes already included in price. In Ireland, the UK, the US and EFTA the free-shipping threshold does not apply: the real zone rate is charged even above €60, due to higher logistics costs.",
        },
      },
      {
        h2: { es: "4. Seguimiento", en: "4. Tracking" },
        p: {
          es: "Recibirás un email con el número de seguimiento en cuanto el paquete salga del taller. También puedes consultar el estado desde tu página de pedido con el enlace recibido en la confirmación.",
          en: "You will receive an email with the tracking number as soon as the parcel leaves the workshop. You can also check status from your order page using the link in the confirmation email.",
        },
      },
      {
        h2: { es: "5. Devoluciones (30 días)", en: "5. Returns (30 days)" },
        p: {
          es: "Dispones de 30 días naturales desde la recepción. La prenda debe estar sin usar, sin lavar, con etiquetas y embalaje original. Escribe a gzswear@roadshop.online con tu número de pedido y te indicaremos los pasos. El reembolso se realiza al método de pago original en un máximo de 14 días tras recibir la devolución. Los gastos de devolución son a cargo del cliente, salvo producto defectuoso o pedido incorrecto.",
          en: "You have 30 calendar days from delivery. The garment must be unworn, unwashed, with tags and original packaging. Email gzswear@roadshop.online with your order number and we will guide you. Refunds go to the original payment method within 14 days of receiving the return. Return shipping is paid by the customer, except for defective or incorrect items.",
        },
      },
      {
        h2: { es: "6. Productos defectuosos o incorrectos", en: "6. Defective or incorrect products" },
        p: {
          es: "Si recibes una prenda defectuosa o que no se corresponde con tu pedido, asumimos los gastos de recogida y reposición. Envíanos fotos del producto y del embalaje a gzswear@roadshop.online en los 14 días siguientes a la recepción.",
          en: "If you receive a defective or incorrect item, we cover collection and replacement costs. Send photos of the product and packaging to gzswear@roadshop.online within 14 days of delivery.",
        },
      },
      {
        h2: { es: "7. Aduanas e impuestos", en: "7. Customs and taxes" },
        p: {
          es: "Los pedidos con destino fuera de la UE (Reino Unido, EE. UU., etc.) pueden estar sujetos a tasas aduaneras o impuestos locales, a cargo del cliente según la normativa del país de destino.",
          en: "Orders delivered outside the EU (UK, US, etc.) may be subject to customs duties or local taxes, payable by the customer under the destination country's rules.",
        },
      },
    ],
  },
];

export function getLegalDoc(key: string, _locale: Locale): LegalDoc | undefined {
  return LEGAL_DOCS.find((d) => d.key === key);
}
