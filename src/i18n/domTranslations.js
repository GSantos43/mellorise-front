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
  'Formulado con intención.': 'Formulated with intention.',
  'Diseñado para una rutina nutricional clara.': 'Designed for a clear nutritional routine.',
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
  'Del origen a tu puerta.': 'From origin to your door.',
  'Cada paso cuenta.': 'Every step matters.',
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
  '¿Tienes preguntas?': 'Have questions?',
  'Tenemos respuestas': 'We have answers',
  '¿Tienes preguntas? Tenemos respuestas': 'Have questions? We have answers',
  'Respuestas claras sobre MelloRise, la rutina diaria y los detalles antes de comprar.': 'Clear answers about MelloRise, the daily routine, and the details before buying.',
  'Dale a tu hijo el apoyo nutricional que merece.': 'Give your child the nutritional support they deserve.',
  'Nutrición diaria práctica con vitaminas, minerales e ingredientes seleccionados en dos gummies deliciosas para una rutina familiar simple.': 'Practical daily nutrition with vitamins, minerals, and selected ingredients in two delicious gummies for a simple family routine.',
  'Ver ingredientes': 'View ingredients',
  'Dale a tu hijo el apoyo nutricional': 'Give your child the nutritional support',
  'que merece.': 'they deserve.',
  'MelloRise Heightener Gummies con gomitas': 'MelloRise Heightener Gummies with gummies',
  'La comparación': 'The comparison',
  'No todas las gummies son': 'Not all gummies are',
  'iguales': 'the same',
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
  'Reseñas de familias': 'Family reviews',
  'sobre MelloRise': 'about MelloRise',
  'Reseñas de familias sobre MelloRise': 'Family reviews about MelloRise',
  'Experiencias centradas en rutina, claridad de compra y uso diario.': 'Experiences focused on routine, purchase clarity, and daily use.',
  'Nos gustó que MelloRise reuniera vitaminas, minerales y aminoácidos en una gummy fácil de explicar dentro de la rutina.': 'We liked that MelloRise brought vitamins, minerals, and amino acids together in one gummy that was easy to explain as part of the routine.',
  'El formato gummy hizo más sencillo mantener el hábito diario. Menos frascos en la mesa y una experiencia que mi hijo aceptó mejor.': 'The gummy format made the daily habit easier to keep. Fewer bottles on the table and an experience my child accepted more easily.',
  'La compra fue clara desde el inicio: ingredientes, modo de uso y seguimiento del pedido quedaron fáciles de revisar.': 'The purchase felt clear from the start: ingredients, directions, and order tracking were easy to review.',
  'Familia Martínez': 'Martinez family',
  'Madre de dos': 'Mother of two',
  'Familia Rivera': 'Rivera family',
  'Rutina familiar': 'Family routine',
  'Uso diario': 'Daily use',
  'Experiencia de compra': 'Purchase experience',
  'Relato de cliente': 'Customer story',
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
  'Su día escolar empieza': 'Their school day starts',
  'con una rutina simple.': 'with a simple routine.',
  'Su día escolar empieza con una rutina simple.': 'Their school day starts with a simple routine.',
  'Una forma práctica de acompañar las mañanas ocupadas con una goma diaria pensada para familias.': 'A practical way to support busy mornings with a daily gummy designed for families.',
  'Beneficios de rutina': 'Routine benefits',
  'Una opción amigable para incluir en la rutina diaria.': 'A friendly option to include in the daily routine.',
  'Con nutrientes como D3, K2, calcio, magnesio y zinc.': 'With nutrients like D3, K2, calcium, magnesium, and zinc.',
  'Fácil de recordar antes de salir para la escuela.': 'Easy to remember before leaving for school.',
  'Formato gummy pensado para acompañar hábitos constantes.': 'Gummy format designed to support consistent habits.',
  'Comprar ahora': 'Shop now',
  'Niño tomando una goma MelloRise en la cocina antes de la escuela': 'Child taking a MelloRise gummy in the kitchen before school',
  'No es solo una gummy': 'Not just a gummy',
  'Por que MelloRise es una': 'Why MelloRise is a',
  'eleccion mas simple': 'simpler choice',
  'para acompanar el crecimiento': 'for growth support',
  'Por que MelloRise es una eleccion mas simple para acompanar el crecimiento': 'Why MelloRise is a simpler choice for growth support',
  'Nutrientes seleccionados en una rutina gummy simple para familias.': 'Selected nutrients in a simple gummy routine for families.',
  'Estatura natural': 'Natural height',
  'Nutrientes para una rutina equilibrada en etapas de crecimiento.': 'Nutrients for a balanced routine during growth stages.',
  'Huesos y estructura': 'Bones and structure',
  'Calcio, D3 y K2 para complementar el cuidado diario de huesos.': 'Calcium, D3, and K2 to complement daily bone care.',
  'Metabolismo proteico': 'Protein metabolism',
  'Aminoacidos seleccionados para acompanar la formula diaria.': 'Selected amino acids to support the daily formula.',
  'Frasco MelloRise con gomitas y nutrientes destacados': 'MelloRise bottle with gummies and highlighted nutrients',
  'Habitos simples': 'Simple habits',
  'Ingredientes pensados para una rutina diaria sin complicar la manana.': 'Ingredients designed for a daily routine without complicating the morning.',
  'Apoyo inmune diario': 'Daily immune support',
  'Zinc y D3 forman parte de funciones normales del organismo.': 'Zinc and D3 are part of normal body functions.',
  'Rutina tranquila': 'Calm routine',
  'Formato facil de recordar antes de la escuela o del descanso.': 'Easy-to-remember format before school or rest.',
  'Como usar': 'How to use',
  'El ritual diario': 'The daily ritual',
  'sin complicar la manana': 'without complicating the morning',
  'El ritual diario sin complicar la manana': 'The daily ritual without complicating the morning',
  'Incluye las gummies en una rutina familiar constante, junto con alimentacion equilibrada, agua y buen descanso.': 'Include the gummies in a consistent family routine, alongside balanced nutrition, water, and good rest.',
  'Rutina diaria sugerida': 'Suggested daily routine',
  'Dos gummies al dia': 'Two gummies per day',
  'Sigue siempre la dosis indicada en la etiqueta real del producto.': 'Always follow the serving size listed on the real product label.',
  'Mantente hidratado': 'Stay hydrated',
  'Una rutina simple funciona mejor cuando tambien hay hidratacion durante el dia.': 'A simple routine works better when there is also hydration throughout the day.',
  'La constancia gana': 'Consistency wins',
  'Mantenlo como un habito diario facil de recordar antes de escuela o desayuno.': 'Keep it as an easy-to-remember daily habit before school or breakfast.',
  'Buen descanso': 'Good rest',
  'Combinalo con horarios de sueno saludables y acompanamiento familiar.': 'Pair it with healthy sleep schedules and family support.',
  'Ingredientes que MelloRise evita': 'Ingredients MelloRise avoids',
  'Por que elegir MelloRise': 'Why choose MelloRise',
  'MelloRise frente a': 'MelloRise vs',
  'opciones genericas': 'generic options',
  'MelloRise frente a opciones genericas': 'MelloRise vs generic options',
  'Nutrientes seleccionados en una gummy practica para la rutina diaria.': 'Selected nutrients in a practical gummy for the daily routine.',
  'Comprar MelloRise ahora': 'Shop MelloRise now',
  'Compra protegida por las politicas de la tienda.': 'Purchase protected by store policies.',
  'Caracteristicas': 'Features',
  'Comparacion entre MelloRise y multivitaminas genericas': 'Comparison between MelloRise and generic multivitamins',
  'Calcio y vitamina D3': 'Calcium and vitamin D3',
  'Apoyo diario para huesos': 'Daily bone support',
  'Nutrientes para crecimiento': 'Growth nutrients',
  'Zinc y magnesio': 'Zinc and magnesium',
  'Formato facil para ninos': 'Easy format for kids',
  'Rutina simple': 'Simple routine',
  'Sabor tipo gummy': 'Gummy-style flavor',
  'Si': 'Yes',
  'No destacado': 'Not highlighted',
  'Multivitaminas genericas': 'Generic multivitamins',
  'Pensado para familias': 'Designed for families',
  'Formula clara,': 'Clear formula,',
  'rutina facil de mantener': 'easy routine to maintain',
  'Formula clara, rutina facil de mantener': 'Clear formula, easy routine to maintain',
  'MelloRise combina una presentacion amigable con informacion visible en la etiqueta para que la rutina diaria sea mas sencilla.': 'MelloRise combines a friendly presentation with visible label information so the daily routine is simpler.',
  'Diferenciales destacados en la etiqueta': 'Highlights featured on the label',
  'Sin colorantes artificiales': 'No artificial colors',
  'Nutrientes como K2, D3, zinc y calcio': 'Nutrients like K2, D3, zinc, and calcium',
  'Formato gummy para una rutina simple': 'Gummy format for a simple routine',
  'Empezar mi rutina': 'Start my routine',
  'Revisa siempre la etiqueta y las politicas reales de la tienda.': 'Always review the label and the store real policies.',
  'Frasco MelloRise Heightener Gummies abierto con gomitas': 'Open MelloRise Heightener Gummies bottle with gummies',
  'Resumen de la rutina': 'Routine summary',
  'Ingredientes destacados de forma facil de revisar.': 'Highlighted ingredients that are easy to review.',
  'Formato practico para acompanar habitos constantes.': 'Practical format to support consistent habits.',
  'Bundles listos para elegir segun la necesidad familiar.': 'Bundles ready to choose according to family needs.',
  'La ciencia': 'The science',
  'La matriz de': 'The matrix of',
  'apoyo nutricional': 'nutritional support',
  'La matriz de apoyo nutricional': 'The nutritional support matrix',
  'Minerales, vitaminas y aminoacidos reunidos en una rutina diaria simple.': 'Minerals, vitamins, and amino acids brought together in a simple daily routine.',
  'Calcio en la rutina': 'Calcium in the routine',
  'Vitamina K2 + D3': 'Vitamin K2 + D3',
  'L-Arginina': 'L-Arginine',
  'L-Ornitina': 'L-Ornithine',
  'L-Glutamina': 'L-Glutamine',
  'Ingrediente dentro del perfil nutricional de la rutina MelloRise.': 'Ingredient within the nutritional profile of the MelloRise routine.',
  'Ver la diferencia': 'See the difference',
  'Rutinas que inspiran a': 'Routines that inspire',
  'familias y ninos': 'families and kids',
  'Rutinas que inspiran a familias y ninos': 'Routines that inspire families and kids',
  'Imagen testimonial de referencia compartida por cliente': 'Reference testimonial image shared by a customer',
  'Cinco estrellas': 'Five stars',
  'Nos ayudo a ordenar la manana': 'It helped organize our morning',
  'El sabor hizo mas facil repetirlo': 'The flavor made it easier to repeat',
  'Menos frascos, menos dudas': 'Fewer bottles, fewer doubts',
  'Lo sumamos despues del desayuno y se volvio una parte simple de nuestra rutina familiar.': 'We added it after breakfast, and it became a simple part of our family routine.',
  'A mi hijo le gusto que fuera gummy. Para mi, fue mas facil recordar una rutina constante sin preparar nada.': 'My child liked that it was a gummy. For me, it was easier to remember a consistent routine without preparing anything.',
  'Me gusto tener vitaminas, minerales y aminoacidos seleccionados en un solo formato facil de revisar.': 'I liked having selected vitamins, minerals, and amino acids in one easy-to-review format.',
  'Compra con informacion clara': 'Purchase with clear information',
  'Hecho para familias': 'Made for families',
  'Por que familias eligen la rutina MelloRise': 'Why families choose the MelloRise routine',
  'Cuatro razones para mantener una rutina diaria simple, clara y facil de recordar.': 'Four reasons to keep a simple, clear, and easy-to-remember daily routine.',
  'Apoyo diario': 'Daily support',
  '2 gummies al dia para una rutina nutricional simple.': '2 gummies per day for a simple nutritional routine.',
  'Todo en uno': 'All in one',
  'Vitaminas y minerales seleccionados en formato gummy.': 'Selected vitamins and minerals in gummy format.',
  'Manana facil': 'Easy morning',
  'Sin mezclas ni preparacion, antes de la escuela.': 'No mixing or preparation before school.',
  'Para ninos': 'For kids',
  'Una rutina sencilla para familias en crecimiento.': 'A simple routine for growing families.',
  'Una rutina sencilla para todos los dias': 'A simple routine for every day',
  'Goma integrada a una rutina diaria': 'Gummy integrated into a daily routine',
  'Incluye MelloRise dentro de habitos familiares constantes y faciles de recordar.': 'Include MelloRise within consistent, easy-to-remember family habits.',
  'Incluye la goma en una rutina constante y facil de recordar.': 'Include the gummy in a consistent, easy-to-remember routine.',
  'Acompanala con alimentacion variada, descanso y actividad fisica.': 'Pair it with varied nutrition, rest, and physical activity.',
  'Consulta a un profesional si tienes dudas sobre ingredientes o uso familiar.': 'Consult a professional if you have questions about ingredients or family use.',
  'Vida diaria': 'Daily life',
  'Una experiencia pensada para familias': 'An experience designed for families',
  'Frasco de gummies en una escena clara': 'Gummy bottle in a bright scene',
  'Detalle del producto gummy': 'Gummy product detail',
  'Producto gummy con acabado premium': 'Premium gummy product presentation',
  'Sabor facil': 'Easy flavor',
  'Formato tipo gummy para una rutina mas simple que capsulas o polvos.': 'Gummy-style format for a simpler routine than capsules or powders.',
  'Uso cotidiano': 'Everyday use',
  'Una presentacion pensada para mantenerse visible y facil de incorporar al dia.': 'A presentation designed to stay visible and easy to add to the day.',
  'Opciones claras para elegir una unidad, rutina completa o mayor valor.': 'Clear options to choose one unit, a complete routine, or better value.',
  'Reviews': 'Reviews',
  'Lo que dicen las familias': 'What families say',
  'Una seccion visual para destacar opiniones y fotos reales cuando esten verificadas por la tienda.': 'A visual section to highlight real opinions and photos once verified by the store.',
  'Historias de familias usando MelloRise': 'Stories from families using MelloRise',
  'Fotos y relatos de rutinas simples con gummies, ingredientes claros y una experiencia de compra facil de acompanar.': 'Photos and stories of simple routines with gummies, clear ingredients, and an easy purchase experience to follow.',
  'Resumen de resenas': 'Review summary',
  'Promedio': 'Average',
  'Distribucion visual de resenas': 'Visual review distribution',
  'Escribir una resena': 'Write a review',
  'Resenas con fotos': 'Reviews with photos',
  '4 resenas con fotos': '4 reviews with photos',
  'Ultimas': 'Latest',
  'Foto de rutina familiar con gummies MelloRise': 'Family routine photo with MelloRise gummies',
  'Foto de evaluacion con gummies MelloRise': 'Review photo with MelloRise gummies',
  'Se volvio parte de la manana': 'It became part of the morning',
  'Lo dejamos junto al desayuno y ahora es una rutina facil de recordar antes de salir.': 'We keep it by breakfast, and now it is an easy routine to remember before leaving.',
  'Me dio mas tranquilidad': 'It gave me more peace of mind',
  'Me gusto poder revisar ingredientes y dosis con claridad antes de agregarlo al dia.': 'I liked being able to review ingredients and dosage clearly before adding it to the day.',
  'A mi hijo le gusto el formato': 'My child liked the format',
  'Que fuera gummy ayudo mucho. No tuve que mezclar nada ni pelear con capsulas.': 'The gummy format helped a lot. I did not have to mix anything or struggle with capsules.',
  'La compra fue sencilla': 'The purchase was simple',
  'Encontramos la informacion rapido y pudimos seguir el pedido sin complicarnos.': 'We found the information quickly and could track the order without complications.',
  'Mi hijo lo toma despues del desayuno y le gusto desde el primer dia. Para mi fue una forma simple de mantener la rutina sin mezclar nada.': 'My child takes it after breakfast and liked it from the first day. For me, it was a simple way to keep the routine without mixing anything.',
  'Me gusto ver el frasco, revisar la etiqueta y entender la dosis. Las gummies se ven bien y el formato hizo todo mas facil.': 'I liked seeing the bottle, reviewing the label, and understanding the dosage. The gummies look good, and the format made everything easier.',
  'Facil de recordar todos los dias': 'Easy to remember every day',
  'Lo dejamos en la cocina junto al cafe de la manana. Tener una gummy lista ayuda mucho cuando la casa esta corriendo.': 'We keep it in the kitchen by the morning coffee. Having a gummy ready helps a lot when the house is rushing.',
  'Ingredientes claros en un solo lugar': 'Clear ingredients in one place',
  'Queria algo facil de revisar antes de comprar. La informacion del producto y la rutina recomendada quedaron muy claras.': 'I wanted something easy to review before buying. The product information and recommended routine were very clear.',
  'Responder': 'Reply',
  'Cerrar resena': 'Close review',
  'Gracias': 'Thank you',
  'Recibimos tu resena': 'We received your review',
  'La revisaremos antes de publicarla para mantener la pagina clara y confiable.': 'We will review it before publishing to keep the page clear and trustworthy.',
  'Cerrar': 'Close',
  'Tu experiencia': 'Your experience',
  'Escribe una resena': 'Write a review',
  'Cuenta como MelloRise encajo en tu rutina familiar. Evita datos medicos personales.': 'Share how MelloRise fit into your family routine. Avoid personal medical details.',
  'Nombre': 'Name',
  'Tu nombre': 'Your name',
  'Email de compra': 'Purchase email',
  'tu@email.com': 'you@email.com',
  'Tu resena': 'Your review',
  'Comparte tu experiencia con el producto': 'Share your experience with the product',
  'Enviar resena': 'Send review',
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
