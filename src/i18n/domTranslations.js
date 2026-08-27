const staticTextMap = new Map(Object.entries({
  'Rutina diaria para familias': 'Daily routine for families',
  'Apoyo nutricional en una gummy simple': 'Nutritional support in one simple gummy',
  'MelloRise acompaña una rutina equilibrada con vitaminas, minerales e ingredientes seleccionados en un formato fácil de incorporar al día.': 'MelloRise supports a balanced routine with vitamins, minerals, and selected ingredients in a format that is easy to add to the day.',
  'Comprar MelloRise': 'Shop MelloRise',
  'Ver fórmula': 'View formula',
  'Uso responsable conforme a la etiqueta real del producto.': 'Responsible use according to the real product label.',
  'Oferta de bienvenida': 'Welcome offer',
  '¿Te gustaría ahorrar en tu primera orden?': 'Would you like to save on your first order?',
  'En tu primera compra': 'On your first purchase',
  'Sí, quiero mi descuento': 'Yes, I want my discount',
  'No, prefiero continuar': 'No, I prefer to continue',
  'Sin hormonas': 'Hormone-free',
  'Etiqueta clara': 'Clear label',
  'Uso responsable': 'Responsible use',
  'Sin gluten': 'Gluten-free',
  'Ingredientes seleccionados': 'Selected ingredients',
  'Todo en una presentación fácil de recordar': 'Everything in an easy-to-remember format',
  'MelloRise reúne nutrientes seleccionados en formato gummy para acompañar una rutina diaria simple.': 'MelloRise brings selected nutrients together in gummy format to support a simple daily routine.',
  'All In One Nutrients': 'All In One Nutrients',
  'Formula': 'Formula',
  'Nutrientes seleccionados cuidadosamente para una rutina simple, clara y fácil de seguir.': 'Nutrients carefully selected for a simple, clear, and easy-to-follow routine.',
  'Comprar MelloRise Gummies': 'Shop MelloRise Gummies',
  'Ciencia y formulación': 'Science and formulation',
  'Formulado con intención. Diseñado para una rutina nutricional clara.': 'Formulated with intention. Designed for a clear nutritional routine.',
  'MelloRise combina nutrientes de apoyo en un formato simple. Esta sección organiza la información de la fórmula sin prometer resultados individuales.': 'MelloRise combines supporting nutrients in a simple format. This section organizes formula information without promising individual results.',
  'Composición destacada por porción': 'Highlighted composition per serving',
  'Formulación enfocada': 'Focused formulation',
  'Nutrientes seleccionados para presentar una rutina clara, práctica y fácil de entender.': 'Selected nutrients presented as a clear, practical, and easy-to-understand routine.',
  'Formato conveniente': 'Convenient format',
  'Una alternativa tipo gummy para familias que prefieren una experiencia simple frente a cápsulas o polvos.': 'A gummy-style alternative for families who prefer a simpler experience than capsules or powders.',
  'Mezcla equilibrada': 'Balanced blend',
  'La composición reúne vitaminas, minerales y aminoácidos en una presentación organizada.': 'The composition brings vitamins, minerals, and amino acids together in an organized presentation.',
  'Información editable': 'Editable information',
  'Textos preparados para ajustarse a la etiqueta real del producto antes de publicar.': 'Copy prepared to match the real product label before publishing.',
  'Proceso y cuidado': 'Process and care',
  'Del origen a tu puerta. Cada paso cuenta.': 'From origin to your door. Every step matters.',
  'Una vista simple del recorrido de MelloRise: desde la selección de ingredientes hasta la experiencia de compra, con información que puede ajustarse según la operación real de la marca.': 'A simple view of the MelloRise journey: from ingredient selection to the shopping experience, with information that can be adjusted to the brand real operation.',
  'Selección': 'Selection',
  'Preparación': 'Preparation',
  'Revisión': 'Review',
  'Cuidado': 'Care',
  'Empaque': 'Packaging',
  'Entrega': 'Delivery',
  'Ingredientes organizados para una fórmula fácil de presentar y revisar.': 'Ingredients organized for a formula that is easy to present and review.',
  'Formato tipo gummy pensado para integrarse a una rutina diaria simple.': 'Gummy format designed to fit into a simple daily routine.',
  'Información lista para ajustarse conforme a la etiqueta real del producto.': 'Information ready to be adjusted according to the real product label.',
  'Comunicación clara, sin promesas exageradas ni datos no confirmados.': 'Clear communication, without exaggerated promises or unconfirmed data.',
  'Presentación de marca consistente para reforzar confianza en la compra.': 'Consistent brand presentation to strengthen purchase confidence.',
  'Ruta final hacia el carrito y la página de producto con menos fricción.': 'Final path to the cart and product page with less friction.',
  'Productos': 'Products',
  'Elige tu rutina MelloRise': 'Choose your MelloRise routine',
  'Opciones pensadas para mantener una rutina familiar simple, clara y fácil de repetir.': 'Options designed to keep a family routine simple, clear, and easy to repeat.',
  'Cargando productos...': 'Loading products...',
  '¿Tienes preguntas? Tenemos respuestas': 'Have questions? We have answers',
  'Respuestas claras sobre MelloRise, la rutina diaria y los detalles antes de comprar.': 'Clear answers about MelloRise, the daily routine, and the details before buying.',
  'Dale a tu hijo el apoyo nutricional que merece.': 'Give your child the nutritional support they deserve.',
  'Nutrición diaria práctica con vitaminas, minerales e ingredientes seleccionados en dos gummies deliciosas para una rutina familiar simple.': 'Practical daily nutrition with vitamins, minerals, and selected ingredients in two delicious gummies for a simple family routine.',
  'Ver ingredientes': 'View ingredients',
  'La comparación': 'The comparison',
  'No todas las gummies son iguales': 'Not all gummies are the same',
  'Mientras muchas rutinas terminan con varios frascos y pasos, MelloRise reúne apoyo nutricional diario en un formato simple para familias.': 'While many routines end up with several bottles and steps, MelloRise brings daily nutritional support together in a simple format for families.',
  'MelloRise Heightener Gummies': 'MelloRise Heightener Gummies',
  'Otros suplementos': 'Other supplements',
  'Apoyo nutricional en una gummy': 'Nutritional support in one gummy',
  'Fácil de incorporar al día': 'Easy to add to the day',
  'Formato pensado para familias': 'Format designed for families',
  'Rutina más práctica': 'More practical routine',
  'Sabor amigable para niños': 'Kid-friendly flavor',
  'Varios suplementos': 'Several supplements',
  'Difícil de recordar': 'Hard to remember',
  'Más pasos cada mañana': 'More steps every morning',
  'Rutina confusa': 'Confusing routine',
  'Menos práctico para niños': 'Less practical for kids',
  'Ver todos los nutrientes en una gummy': 'See all nutrients in one gummy',
  'Lo que dicen las familias': 'What families say',
  'Reseñas de familias cuando estén verificadas': 'Family reviews once verified',
  'Usa estos ejemplos como estructura y reemplázalos por comentarios auténticos antes de publicar.': 'Use these examples as structure and replace them with authentic comments before publishing.',
  'Ejemplo para reemplazar': 'Example to replace',
  'Pendiente de verificación': 'Pending verification',
  'Detalles del producto': 'Product details',
  'Lista de ingredientes': 'Ingredient list',
  'Beneficios clave': 'Key benefits',
  'Como usar': 'How to use',
  'Envio y devoluciones': 'Shipping and returns',
  'Una gummy diaria pensada para acompañar rutinas familiares durante etapas de crecimiento. Cada porcion destaca nutrientes presentes en la formula, incluyendo:': 'A daily gummy designed to support family routines during growth stages. Each serving highlights nutrients present in the formula, including:',
  'Su formato gummy ayuda a mantener una rutina simple junto con alimentacion equilibrada, hidratacion y descanso.': 'Its gummy format helps maintain a simple routine alongside balanced nutrition, hydration, and rest.',
  'MelloRise Heightener Gummies es una opcion practica para familias que buscan una rutina nutricional sencilla.': 'MelloRise Heightener Gummies is a practical option for families looking for a simple nutrition routine.',
  'Niños en etapa escolar y adolescentes': 'School-age children and teens',
  'Familias que prefieren un formato gummy facil de recordar': 'Families who prefer an easy-to-remember gummy format',
  'Rutinas donde se busca complementar la alimentacion diaria': 'Routines where daily nutrition is being complemented',
  'Padres que quieren revisar ingredientes visibles en la etiqueta': 'Parents who want to review visible ingredients on the label',
  'Segun la etiqueta del producto, tambien destaca:': 'According to the product label, it also highlights:',
  'Apoyo diario para una rutina enfocada en:': 'Daily support for a routine focused on:',
  'Complementar nutrientes importantes en la alimentacion': 'Complementing important nutrients in the diet',
  'Acompañar el cuidado diario de huesos': 'Supporting daily bone care',
  'Mantener una rutina constante y facil para niños': 'Keeping a consistent, easy routine for kids',
  'Hacer mas simple el seguimiento por parte de los padres': 'Making follow-through simpler for parents',
  'Revisa la dosis indicada en la etiqueta real del producto.': 'Review the dosage listed on the real product label.',
  'Mastica las gummies antes de tragar.': 'Chew the gummies before swallowing.',
  'Incluyelas en una rutina diaria facil de recordar.': 'Include them in an easy-to-remember daily routine.',
  'Sin mezclar, sin preparacion y facil de incorporar al dia.': 'No mixing, no preparation, and easy to add to the day.',
  'La compra queda lista para finalizar en Shopify. Los plazos, costos de envio y condiciones de devolucion deben seguir las politicas reales de la tienda.': 'The purchase is ready to be completed in Shopify. Shipping times, costs, and return conditions should follow the store real policies.',
  'Antes de publicar, revisa que cualquier garantia, promocion o beneficio refleje la configuracion real del checkout.': 'Before publishing, review that any guarantee, promotion, or benefit reflects the real checkout configuration.',
  'Imagenes del producto': 'Product images',
  'Imagen anterior': 'Previous image',
  'Siguiente imagen': 'Next image',
  'Informacion del producto': 'Product information',
  'Una gummy de apoyo nutricional pensada para familias que quieren mantener una rutina constante, practica y facil de incorporar al dia.': 'A nutritional support gummy for families who want to keep a consistent, practical routine that is easy to add to the day.',
  'Puntos destacados del producto': 'Product highlights',
  'Rutina diaria': 'Daily routine',
  'Formato gummy': 'Gummy format',
  'Compra guiada': 'Guided purchase',
  'Uso conforme etiqueta': 'Use according to label',
  'Oferta familiar': 'Family offer',
  'Elige el pack que mejor encaja con tu rutina.': 'Choose the pack that best fits your routine.',
  'Antes': 'Before',
  'Precio en USD': 'Price in USD',
  'Elige tu pack': 'Choose your pack',
  'Compra directa con datos dinámicos': 'Direct purchase with dynamic data',
  'Cantidad': 'Quantity',
  'Reducir cantidad': 'Decrease quantity',
  'Aumentar cantidad': 'Increase quantity',
  'Agregar al carrito': 'Add to cart',
  'Informacion de confianza y entrega': 'Trust and delivery information',
  'Compra segura. Revisa siempre ingredientes, dosis y uso conforme a la etiqueta real del producto.': 'Secure purchase. Always review ingredients, dosage, and use according to the real product label.',
  'La rutina empieza en casa': 'The routine starts at home',
  'Su día escolar empieza con una rutina simple.': 'Their school day starts with a simple routine.',
  'Una forma práctica de acompañar las mañanas ocupadas con una goma diaria pensada para familias.': 'A practical way to support busy mornings with a daily gummy designed for families.',
  'Comprar ahora': 'Shop now',
  'No es solo una gummy': 'Not just a gummy',
  'Por que MelloRise es una eleccion mas simple para acompanar el crecimiento': 'Why MelloRise is a simpler choice for growth support',
  'Nutrientes seleccionados en una rutina gummy simple para familias.': 'Selected nutrients in a simple gummy routine for families.',
  'Como usar': 'How to use',
  'El ritual diario sin complicar la manana': 'The daily ritual without complicating the morning',
  'Por que elegir MelloRise': 'Why choose MelloRise',
  'MelloRise frente a opciones genericas': 'MelloRise vs generic options',
  'Comprar MelloRise ahora': 'Shop MelloRise now',
  'Compra protegida por las politicas de la tienda.': 'Purchase protected by store policies.',
  'Caracteristicas': 'Features',
  'Multivitaminas genericas': 'Generic multivitamins',
  'Pensado para familias': 'Designed for families',
  'Formula clara, rutina facil de mantener': 'Clear formula, easy routine to maintain',
  'Empezar mi rutina': 'Start my routine',
  'La ciencia': 'The science',
  'La matriz de apoyo nutricional': 'The nutritional support matrix',
  'Ver la diferencia': 'See the difference',
  'Rutinas que inspiran a familias y ninos': 'Routines that inspire families and kids',
  'Hecho para familias': 'Made for families',
  'Por que familias eligen la rutina MelloRise': 'Why families choose the MelloRise routine',
  'Cuatro razones para mantener una rutina diaria simple, clara y facil de recordar.': 'Four reasons to keep a simple, clear, and easy-to-remember daily routine.',
  'Una rutina sencilla para todos los dias': 'A simple routine for every day',
  'Vida diaria': 'Daily life',
  'Una experiencia pensada para familias': 'An experience designed for families',
  'Lo que dicen las familias': 'What families say',
  'Compra rapida': 'Quick buy'
}))

const reverseTextMap = new Map([...staticTextMap].map(([source, translated]) => [translated, source]))
const textOriginals = new WeakMap()
const attributeOriginals = new WeakMap()

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function findTranslation(map, normalizedValue) {
  for (const [source, translated] of map) {
    if (normalizeText(source) === normalizedValue) return translated
  }

  return null
}

function translateValue(value, locale) {
  const normalized = normalizeText(value)
  if (!normalized) return value

  if (locale === 'en') {
    return findTranslation(staticTextMap, normalized) || value
  }

  return findTranslation(reverseTextMap, normalized) || value
}

function translateTextNode(node, locale) {
  const originalValue = textOriginals.get(node) || node.nodeValue
  const translatedValue = locale === 'en' ? translateValue(originalValue, locale) : originalValue

  if (!textOriginals.has(node)) {
    textOriginals.set(node, originalValue)
  }

  if (normalizeText(node.nodeValue) !== normalizeText(translatedValue)) {
    node.nodeValue = translatedValue
  }
}

function translateAttribute(element, attribute, locale) {
  if (!element.hasAttribute(attribute)) return

  let originals = attributeOriginals.get(element)

  if (!originals) {
    originals = new Map()
    attributeOriginals.set(element, originals)
  }

  if (!originals.has(attribute)) {
    originals.set(attribute, element.getAttribute(attribute))
  }

  const originalValue = originals.get(attribute)
  const nextValue = locale === 'en' ? translateValue(originalValue, locale) : originalValue
  if (nextValue !== element.getAttribute(attribute)) {
    element.setAttribute(attribute, nextValue)
  }
}

export function translateStaticDom(root, locale) {
  if (!root || !['es', 'en'].includes(locale)) return

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!normalizeText(node.nodeValue)) return NodeFilter.FILTER_REJECT
      if (node.parentElement?.closest('script, style, noscript, option, .mello-page-header, .mellow-footer, .mello-cart-drawer, .mello-catalog, .mellorise-contact, .mello-institutional')) {
        return NodeFilter.FILTER_REJECT
      }
      return NodeFilter.FILTER_ACCEPT
    }
  })

  const textNodes = []
  let currentNode = walker.nextNode()
  while (currentNode) {
    textNodes.push(currentNode)
    currentNode = walker.nextNode()
  }

  textNodes.forEach((node) => translateTextNode(node, locale))

  root.querySelectorAll('[aria-label], [alt], [placeholder]').forEach((element) => {
    if (element.closest('.mello-page-header, .mellow-footer, .mello-cart-drawer, .mello-catalog, .mellorise-contact, .mello-institutional')) return
    translateAttribute(element, 'aria-label', locale)
    translateAttribute(element, 'alt', locale)
    translateAttribute(element, 'placeholder', locale)
  })
}
