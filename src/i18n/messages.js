export const messages = {
  es: {
    language: {
      label: 'Idioma',
      es: 'ES',
      en: 'EN'
    },
    meta: {
      home: 'MelloRise',
      collection: 'Productos',
      contact: 'Contacto',
      faq: 'Preguntas frecuentes',
      tracking: 'Seguir pedido',
      accountOrders: 'Mis compras',
      signIn: 'Entrar',
      signUp: 'Crear cuenta',
      checkout: 'Checkout seguro',
      checkoutSuccess: 'Pedido confirmado'
    },
    loading: {
      label: 'Cargando'
    },
    nav: {
      home: 'MelloRise',
      products: 'Produtos',
      contact: 'Contact Us',
      faq: 'FAQ',
      main: 'Navegacion principal',
      cart: 'Carrito',
      cta: 'Comprar gummies',
      menu: 'Abrir menu',
      closeMenu: 'Cerrar menu',
      accountOrders: 'Mis compras',
      tracking: 'Seguir pedido'
    },
    auth: {
      loading: 'Cargando cuenta',
      account: 'Cuenta',
      back: 'Volver',
      menu: 'Menu de cuenta',
      signIn: 'Entrar',
      signUp: 'Crear cuenta',
      signOut: 'Salir',
      orders: 'Mis compras',
      profile: 'Gestionar cuenta',
      track: 'Seguir pedido',
      support: 'Soporte'
    },
    authPage: {
      signInBadge: 'Acceso seguro',
      signInTitle: 'Entra a tu cuenta',
      signInText: 'Consulta compras, rastreo y soporte con el mismo email usado en el checkout.',
      signUpBadge: 'Cuenta MelloRise',
      signUpTitle: 'Crea tu cuenta',
      signUpText: 'Guarda tus compras, entra con Google y acompaña cada pedido en un lugar protegido.',
      ordersTitle: 'Compras protegidas',
      ordersText: 'Solo mostramos pedidos vinculados al email confirmado por Clerk.',
      securityTitle: 'Login con Google',
      securityText: 'Clerk cuida el acceso y el BFF valida cada pedido antes de mostrar datos.',
      alreadySignedInTitle: 'Ya entraste, {name}',
      alreadySignedInText: 'Tu sesión está activa. Puedes ir directo a tus compras.'
    },
    account: {
      eyebrow: 'Cuenta MelloRise',
      title: 'Mis compras',
      subtitle: 'Accede con el mismo email usado en el checkout para ver tus pedidos, estados y códigos de rastreo.',
      loadingAuth: 'Cargando autenticación segura',
      signInTitle: 'Entra para ver tus compras',
      signInText: 'Usamos Clerk para confirmar tu identidad y proteger los datos de tus pedidos.',
      signedInAs: 'Conectado como',
      refresh: 'Actualizar pedidos',
      loadingOrders: 'Buscando tus pedidos',
      errorTitle: 'No pudimos cargar tus compras',
      error: 'Intenta de nuevo en unos segundos. Si el problema continúa, usa la página de seguimiento con tu código.',
      tryAgain: 'Intentar de nuevo',
      emptyTitle: 'Aún no tienes compras',
      emptyText: 'Cuando compres con este email, tus pedidos aparecerán aquí automáticamente.',
      emptyAction: 'Ver catálogo',
      order: 'Pedido',
      trackingReady: 'Rastreo disponible',
      trackingPending: 'Aún estamos preparando el envío. Te enviaremos el código de rastreo por email cuando Wiio lo genere.',
      authUnavailableTitle: 'Activa Clerk para liberar tu cuenta',
      authUnavailableText: 'Configura VITE_CLERK_PUBLISHABLE_KEY en el front y CLERK_SECRET_KEY en el BFF para habilitar login con Google y pedidos protegidos.'
    },
    catalog: {
      bannerAlt: 'Banner MelloRise Heightener Gummies con ingredientes naturales',
      badge: 'Productos MelloRise',
      title: 'Elige una rutina nutricional simple',
      intro: 'Gummies pensadas para familias que quieren una compra clara, practica y facil de repetir.',
      featured: 'Producto destacado',
      loadingProducts: 'Cargando productos...',
      productAvailable: '{count} producto disponible',
      productsAvailable: '{count} productos disponibles',
      bundleProductsAvailable: '{count} ofertas disponibles',
      bundleAction: 'Elegir oferta',
      chips: {
        routine: 'Rutina diaria',
        gummy: 'Formato gummy',
        responsible: 'Uso responsable'
      },
      loadingTitle: 'Cargando productos...',
      loadingText: 'Estamos preparando el catalogo.',
      emptyTitle: 'No hay productos disponibles',
      emptyText: 'Conecta la API o agrega productos para llenar esta coleccion.'
    },
    contact: {
      title: 'Get in touch',
      status: 'Mensaje listo para enviar cuando conectes el endpoint del formulario.',
      name: 'Name',
      email: 'Email',
      emailRequired: 'Email *',
      phone: 'Phone number',
      comment: 'Comment',
      send: 'Send'
    },
    product: {
      topbarLabel: 'Sin hormonas, Sin gluten, Uso responsable',
      topbar: {
        hormoneFree: 'Sin hormonas',
        glutenFree: 'Sin gluten',
        responsible: 'Uso responsable',
        selected: 'Ingredientes seleccionados'
      },
      lede: 'Una gummy de apoyo nutricional pensada para familias que quieren mantener una rutina constante, practica y facil de incorporar al dia.',
      highlightsLabel: 'Puntos destacados del producto',
      chips: {
        routine: 'Rutina diaria',
        gummy: 'Formato gummy',
        guided: 'Compra guiada',
        labelUse: 'Uso conforme etiqueta'
      },
      offer: {
        title: 'Oferta familiar',
        text: 'Elige el pack que mejor encaja con tu rutina.'
      },
      bundles: {
        shipping: {
          standard: 'Envío estándar disponible',
          free: 'Envío gratis incluido',
          freePriority: 'Envío gratis con prioridad'
        }
      },
      bundleCards: {
        buyOne: {
          title: 'Buy 1',
          meta: 'Rutina inicial'
        },
        buyTwo: {
          title: 'Buy 2 Get 1 Free',
          meta: 'Más popular',
          badge: 'Más popular'
        },
        buyThree: {
          title: 'Buy 3 Get 2 Free',
          meta: 'Mejor valor',
          badge: 'Mejor valor'
        }
      },
      quantity: {
        label: 'Cantidad',
        decrease: 'Reducir cantidad',
        increase: 'Aumentar cantidad'
      },
      gallery: {
        label: 'Imagenes del producto',
        previous: 'Imagen anterior',
        next: 'Siguiente imagen',
        expanded: 'Imagen ampliada del producto',
        close: 'Cerrar imagen ampliada',
        loading: 'Cargando imagen'
      },
      addToCart: 'Agregar al carrito',
      buyNow: 'Buy Now',
      purchaseNote: 'Compra segura. Revisa siempre ingredientes, dosis y uso conforme a la etiqueta real del producto.',
      regionLock: 'Por ahora, MelloRise solo acepta compras desde Estados Unidos. Brasil esta habilitado temporalmente durante el desarrollo.',
      regionShortLock: 'No disponible en tu region',
      trust: {
        label: 'Informacion de confianza y entrega',
        freeShipping: 'Free Shipping',
        secureCheckout: 'Secure checkout',
        noArtificialHormones: 'No artificial hormones',
        noStimulants: 'No stimulants',
        dailyRoutine: 'Daily routine friendly',
        clearLabel: 'Clear label formula'
      },
      accordions: {
        details: {
          title: 'Detalles del producto',
          intro: 'Un suplemento diario de apoyo al desarrollo del crecimiento, respaldado por ciencia y diseñado para niños y adolescentes**. Cada porcion aporta vitaminas, minerales y nutrientes esenciales de apoyo al crecimiento, incluyendo:',
          items: {
            d3: 'Vitamina D3',
            k2: 'Vitamina K2 como MK-7',
            minerals: 'Calcio, magnesio y zinc',
            amino: '3 aminoacidos clave que apoyan las señales naturales de crecimiento: L-arginina, L-ornitina y L-glutamina.'
          },
          note: 'Ayuda a apoyar el desarrollo natural de la estatura, huesos fuertes, una mejor calidad de sueño y el bienestar general.'
        },
        ingredients: {
          title: 'Lista de ingredientes',
          intro: 'MelloRise Heightener Gummies es ideal para:',
          label: 'MelloRise Heightener Gummies tambien es:',
          items: {
            school: 'Niños desde 5 años y adolescentes que todavia estan en fase de crecimiento',
            bones: 'Padres que buscan apoyar el desarrollo saludable de huesos',
            picky: 'Niños selectivos para comer que tal vez no obtienen suficientes nutrientes solo con la dieta',
            active: 'Niños activos que necesitan apoyo nutricional adicional',
            routine: 'Familias que buscan una rutina diaria facil y sabrosa de apoyo al crecimiento'
          },
          claims: {
            vegan: 'Vegano',
            nonGmo: 'Non-GMO',
            glutenFree: 'Sin gluten',
            gelatinFree: 'Sin gelatina',
            halal: 'Halal'
          }
        },
        benefits: {
          title: 'Beneficios clave',
          intro: 'Apoyo diario para:',
          items: {
            height: 'Desarrollo natural de la estatura',
            bones: 'Fuerza saludable de huesos y articulaciones',
            sleep: 'Mejor calidad de sueño y recuperacion para niños y adolescentes',
            confidence: 'Mas confianza',
            skeletal: 'Salud esqueletica general'
          }
        },
        usage: {
          title: 'Como usar',
          items: {
            dose: 'Toma 2 gummies una vez al dia',
            chew: 'Mastica bien antes de tragar',
            flavor: 'Disfruta el delicioso sabor a fresa'
          },
          note: 'Sin mezclas. Sin agua. Sin complicaciones.'
        },
        shipping: {
          title: 'Envio y devoluciones',
          intro: 'MelloRise Heightener Gummies esta hecho con ingredientes cuidadosamente seleccionados y de alta calidad, diseñados para la seguridad y efectividad en cuerpos en crecimiento.',
          claims: 'Nuestras gummies son: ✓ Veganas ✓ Non-GMO ✓ Sin gluten ✓ Libres de colorantes y tintes artificiales ✓ Sin hormonas ✓ Probadas por terceros',
          note: 'Cada lote se produce bajo estrictos estandares de calidad para asegurar pureza, seguridad y consistencia.'
        }
      }
    },
    home: {
      offer: {
        ariaLabel: 'Oferta de bienvenida',
        kicker: 'Oferta de bienvenida',
        title: '¿Te gustaría ahorrar en tu primera orden?',
        subtitle: 'En tu primera compra',
        alreadySaved: 'Tu descuento está listo',
        emailLabel: 'Email para reservar el cupón',
        emailPlaceholder: 'Ingresa tu correo',
        claim: 'Sí, quiero mi descuento',
        loading: 'Generando cupón...',
        error: 'No fue posible generar el cupón. Intenta de nuevo.',
        dismiss: 'No, prefiero continuar',
        close: 'Cerrar oferta',
        shopWithDiscount: 'Comprar con descuento'
      },
      offerConfirm: {
        ariaLabel: 'Confirmar pérdida del descuento',
        loss: 'Última llamada para guardar 10%',
        title: 'Si cierras ahora, este descuento de bienvenida se pierde.',
        subtitle: 'Solo toma un email reservarlo. Puedes usarlo en el checkout de tu primera compra y seguir mirando sin compromiso.',
        keep: 'Guardar mi 10%',
        lose: 'Perder el descuento'
      },
      nutrients: {
        badge: 'All In One Nutrients',
        title: 'Todo en una presentación',
        titleStrong: 'fácil de recordar',
        intro: 'MelloRise reúne nutrientes seleccionados en formato gummy para acompañar una rutina diaria simple.',
        items: {
          calcium: {
            title: 'Calcio',
            text: 'Mineral asociado al mantenimiento normal de huesos y dientes dentro de una alimentación equilibrada.'
          },
          magnesium: {
            title: 'Magnesio',
            text: 'Participa en funciones nutricionales importantes y acompaña rutinas diarias de bienestar.'
          },
          boron: {
            title: 'Boro',
            text: 'Ingrediente de apoyo formulado para complementar la mezcla mineral del producto.'
          },
          zinc: {
            title: 'Zinc',
            text: 'Mineral utilizado en suplementos por su papel en procesos normales del organismo.'
          },
          vitaminD3: {
            title: 'Vitamina D3',
            text: 'Ayuda al aprovechamiento normal del calcio cuando se combina con hábitos saludables.'
          },
          vitaminK2: {
            title: 'Vitamina K2',
            text: 'Forma parte de una fórmula pensada para acompañar el soporte nutricional diario.'
          },
          arginine: {
            title: 'L-Arginina',
            text: 'Aminoácido incluido como parte de la combinación nutricional de la goma.'
          },
          ornithine: {
            title: 'L-Ornitina',
            text: 'Acompaña la fórmula junto con otros nutrientes seleccionados para uso responsable.'
          }
        }
      },
      ingredientMap: {
        badge: 'Formula',
        title: 'Todo en una presentación',
        titleStrong: 'fácil de recordar',
        intro: 'Nutrientes seleccionados cuidadosamente para una rutina simple, clara y fácil de seguir.',
        items: {
          calcium: {
            title: 'Calcio (250 mg)',
            text: 'Apoya una rutina nutricional diaria junto con una alimentación equilibrada.'
          },
          magnesium: {
            title: 'Magnesio (100 mg)',
            text: 'Participa en funciones nutricionales importantes para el bienestar diario.'
          },
          vitaminK2: {
            title: 'Vitamina K2',
            text: 'Forma parte de una fórmula pensada para acompañar el soporte nutricional diario.'
          },
          arginine: {
            title: 'L-Arginina (100 mg)',
            text: 'Aminoácido incluido como parte de la combinación nutricional de la goma.'
          },
          zinc: {
            title: 'Zinc (10 mg)',
            text: 'Mineral utilizado en suplementos por su papel en procesos normales del organismo.'
          },
          vitaminD3: {
            title: 'Vitamina D3 15 mcg',
            text: 'Ayuda al aprovechamiento normal del calcio cuando se combina con hábitos saludables.'
          },
          ornithine: {
            title: 'L-Ornitina',
            text: 'Acompaña la fórmula junto con otros nutrientes seleccionados para uso responsable.'
          },
          glutamine: {
            title: 'L-Glutamina (50 mg)',
            text: 'Ingrediente dentro del perfil nutricional de la rutina MelloRise.'
          }
        }
      },
      journey: {
        badge: 'Proceso y cuidado',
        title: 'Del origen a tu puerta.',
        titleStrong: 'Cada paso cuenta.',
        intro: 'Una vista simple del recorrido de MelloRise: desde la selección de ingredientes hasta la experiencia de compra, con información que puede ajustarse según la operación real de la marca.',
        ariaLabel: 'Proceso de cuidado MelloRise',
        steps: {
          selection: {
            title: 'Selección',
            text: 'Ingredientes organizados para una fórmula fácil de presentar y revisar.'
          },
          preparation: {
            title: 'Preparación',
            text: 'Formato tipo gummy pensado para integrarse a una rutina diaria simple.'
          },
          review: {
            title: 'Revisión',
            text: 'Información lista para ajustarse conforme a la etiqueta real del producto.'
          },
          care: {
            title: 'Cuidado',
            text: 'Comunicación clara, sin promesas exageradas ni datos no confirmados.'
          },
          packaging: {
            title: 'Empaque',
            text: 'Presentación de marca consistente para reforzar confianza en la compra.'
          },
          delivery: {
            title: 'Entrega',
            text: 'Ruta final hacia el carrito y la página de producto con menos fricción.'
          }
        }
      },
      faq: {
        badge: "FAQ's",
        title: '¿Tienes preguntas?',
        titleStrong: 'Tenemos respuestas',
        intro: 'Respuestas claras sobre MelloRise, la rutina diaria y los detalles antes de comprar.',
        imageAlt: 'Frasco MelloRise Heightener Gummies con gummies',
        items: {
          what: {
            question: '¿Qué son MelloRise Heightener Gummies?',
            answer: 'MelloRise Heightener Gummies son gummies de apoyo nutricional pensadas para acompañar la rutina diaria de familias con niños y adolescentes. Reúnen nutrientes presentes en la fórmula como vitamina D3, vitamina K2, calcio, magnesio, zinc y aminoácidos seleccionados.'
          },
          who: {
            question: '¿Para quién son?',
            answer: 'Para familias que buscan una forma práctica de complementar hábitos diarios durante etapas de crecimiento. Si existe una condición médica, medicación o duda de uso, consulta a un profesional antes de incorporar cualquier suplemento.'
          },
          benefits: {
            question: 'Beneficios clave',
            answer: 'MelloRise ayuda a presentar el apoyo nutricional diario de forma clara y organizada, con formato gummy pensado para familias y una rutina más práctica.'
          },
          usage: {
            question: '¿Cómo se usa?',
            answer: 'Revisa la porción indicada en la etiqueta real del producto e incluye las gummies dentro de una rutina diaria constante.'
          },
          quality: {
            question: 'Calidad y fórmula',
            answer: 'Esta sección debe reflejar únicamente características confirmadas por el rótulo final. Valida ingredientes, sellos, advertencias, dosis y beneficios permitidos antes de publicar.'
          },
          shipping: {
            question: 'Envíos y devoluciones',
            answer: 'Los plazos de envío, políticas de devolución y condiciones de garantía deben reflejar la configuración real de la tienda Shopify.'
          }
        }
      }
    },
    footer: {
      logoLabel: 'MelloRise',
      headline: 'Recibe novedades y promociones',
      intro: 'MelloRise es una gummy de apoyo nutricional pensada para acompanar rutinas familiares simples.',
      emailLabel: 'Correo electronico',
      emailPlaceholder: 'Tu email',
      subscribe: 'Suscribirme',
      consent: 'Al suscribirte aceptas recibir comunicaciones de MelloRise. Puedes darte de baja cuando quieras.',
      explore: 'Explorar',
      support: 'Soporte',
      home: 'Inicio',
      benefits: 'Beneficios',
      routine: 'Rutina',
      reviews: 'Resenas',
      buy: 'Comprar',
      contact: 'Contacto',
      faq: 'Preguntas frecuentes',
      shipping: 'Envios y devoluciones',
      tracking: 'Seguir pedido',
      privacy: 'Privacidad',
      payments: 'Metodos de pago',
      rights: 'Todos los derechos reservados.',
      privacyPolicy: 'Politica de privacidad',
      terms: 'Terminos de servicio',
      refunds: 'Reembolsos'
    },
    institutional: {
      shipping: {
        title: 'Envios y devoluciones',
        intro: 'Consulta aqui la informacion base para envios, cambios y devoluciones. Ajusta estos textos segun la politica final de la tienda antes de publicar.',
        sections: [
          ['Procesamiento', 'Los pedidos se preparan despues de la confirmacion de pago. El plazo exacto debe reflejar la operacion real de MelloRise.'],
          ['Entrega', 'Los tiempos de entrega pueden variar segun destino, transportadora y disponibilidad logistica.'],
          ['Devoluciones', 'Las condiciones de devolucion deben seguir la politica oficial publicada por la tienda y las reglas aplicables al producto.']
        ]
      },
      // Tracking is hidden until MelloRise has a real order tracking flow.
      // tracking: {
      //   title: 'Seguir pedido',
      //   intro: 'Usa esta pagina como destino temporal para rastreo hasta conectar la herramienta final de seguimiento.',
      //   sections: [
      //     ['Codigo de seguimiento', 'Cuando el pedido sea enviado, el cliente debera recibir un codigo o enlace de rastreo por email.'],
      //     ['Estado del pedido', 'La integracion final puede conectarse a una app de tracking o al backend para mostrar el estado en tiempo real.']
      //   ]
      // },
      privacy: {
        title: 'Politica de privacidad',
        intro: 'Texto base para privacidad. Reemplaza por la politica legal final antes de publicar la tienda.',
        sections: [
          ['Datos de contacto', 'La tienda puede recopilar datos necesarios para procesar pedidos, soporte y comunicaciones autorizadas.'],
          ['Uso de informacion', 'La informacion debe utilizarse para operar la tienda, mejorar la experiencia y cumplir obligaciones aplicables.'],
          ['Preferencias', 'Los clientes deben poder gestionar comunicaciones conforme a la politica final de la marca.']
        ]
      },
      terms: {
        title: 'Terminos de servicio',
        intro: 'Texto base para terminos de servicio. Valida el contenido final con la politica oficial de la tienda.',
        sections: [
          ['Uso del sitio', 'El uso del sitio debe seguir las condiciones publicadas por MelloRise.'],
          ['Compras', 'Precios, disponibilidad y condiciones comerciales deben reflejar la configuracion real de la tienda.'],
          ['Responsabilidad', 'La informacion del producto debe usarse conforme a la etiqueta real y a las politicas publicadas.']
        ]
      },
      refunds: {
        title: 'Reembolsos',
        intro: 'Texto base para politica de reembolsos. Ajusta antes de publicar segun la operacion real.',
        sections: [
          ['Solicitudes', 'Las solicitudes de reembolso deben seguir los canales y plazos oficiales de la tienda.'],
          ['Condiciones', 'Las condiciones dependen del estado del pedido, producto recibido y politica vigente.'],
          ['Soporte', 'Para dudas, el cliente puede contactar al equipo de soporte desde la pagina de contacto.']
        ]
      },
      default: {
        title: 'Informacion de la tienda',
        intro: 'Esta pagina esta lista para recibir contenido institucional de MelloRise.',
        sections: [
          ['Contenido editable', 'Actualiza esta seccion con la informacion final de la tienda.']
        ]
      }
    },
    cart: {
      title: 'Cart',
      oneItem: '1 item',
      manyItems: '{count} items',
      close: 'Cerrar carrito',
      ready: 'Tu carrito esta listo para finalizar',
      quantity: 'Cantidad',
      decrease: 'Reducir cantidad',
      increase: 'Aumentar cantidad',
      remove: 'Remover producto',
      empty: 'Tu carrito esta vacio.',
      viewProduct: 'Ver producto',
      note: 'Order special instructions',
      notePlaceholder: 'Add a note',
      subtotal: 'Subtotal',
      checkout: 'Check out',
      checkoutLoading: 'Preparando checkout...',
      regionLock: 'Checkout disponible solo para Estados Unidos por ahora. Brasil esta habilitado temporalmente durante el desarrollo.',
      shippingProtection: {
        title: 'Protección de envío',
        text: 'Protege tu pedido contra daños, pérdidas o robo durante el envío.',
        toggle: 'Activar protección de envío'
      },
      discount: {
        label: 'Descuento aplicado'
      }
    },
    checkoutTransition: {
      title: 'Preparando tu checkout',
      text: 'Estamos asegurando tu carrito y preparando el pago.'
    },
    checkoutExit: {
      ariaLabel: 'Confirmar salida del checkout',
      badge: 'Pedido en progreso',
      title: '¿Salir sin finalizar?',
      text: 'Tu descuento, cantidades seleccionadas y carrito están listos. Quédate para terminar tu compra segura.',
      keep: 'Continuar mi compra',
      leave: 'Salir del checkout'
    },
    checkoutSuccess: {
      title: 'Pedido confirmado',
      text: 'Tu pago fue recibido y estamos preparando el pedido para fulfillment.',
      orderLabel: 'Pedido',
      note: 'Cuando el tracking esté disponible, lo enviaremos por email y lo mostraremos en la página de seguimiento.',
      trackAction: 'Seguir pedido',
      action: 'Volver al producto'
    },
    tracking: {
      intro: 'Seguimiento de pedido',
      title: 'Sigue tu pedido',
      subtitle: 'Ingresa el email usado en la compra y tu número de pedido o código de rastreo. Mostramos solo la información necesaria para proteger tus datos.',
      form: {
        title: 'Busca tu pedido',
        text: 'No necesitas crear una cuenta. Usamos estos datos para confirmar que el pedido te pertenece.',
        email: 'Email de compra',
        emailPlaceholder: 'Correo electrónico',
        identifier: 'Número de pedido o código de rastreo',
        identifierPlaceholder: 'Ej: 1042 o WIIO123456',
        submit: 'Ver estado',
        loading: 'Buscando...',
        error: 'No encontramos un pedido con esos datos. Revisa el email y el número e intenta de nuevo.'
      },
      empty: {
        title: 'Tu estado aparecerá aquí',
        text: 'Cuando Wiio envíe el código de rastreo, también lo enviaremos por email y lo mostraremos en esta página.',
        codeTitle: 'Informa el código de rastreo para localizar tu entrega',
        codeText: 'Si aún no tienes el código, vuelve cuando lo recibas por email. Así protegemos los datos del pedido sin exigir una cuenta.'
      },
      result: {
        order: 'Pedido',
        trackingCode: 'Código de rastreo',
        openCarrier: 'Abrir rastreo',
        pendingTitle: 'Aún estamos preparando el envío',
        pendingText: 'Tu pago fue recibido. El código de rastreo aparecerá aquí cuando el pedido sea despachado.'
      },
      steps: {
        confirmed: 'Pedido confirmado',
        confirmedText: 'Recibimos tu pedido y lo guardamos en WooCommerce.',
        preparing: 'Preparación',
        preparingText: 'Estamos preparando los productos y datos para fulfillment.',
        shipped: 'Enviado',
        shippedText: 'El código de rastreo ya fue generado por fulfillment.',
        delivered: 'Entregado',
        deliveredText: 'El pedido llegó al destino.'
      }
    },
    checkout: {
      eyebrow: 'Checkout seguro',
      title: 'Finaliza tu compra',
      intro: 'Confirma tu email, cupón y opciones de entrega. El pago se abre en Stripe con el total final.',
      back: 'Volver al producto',
      secure: 'Pago protegido por Stripe',
      product: {
        label: 'Producto',
        badge: 'Más vendido'
      },
      quantity: {
        title: 'Cantidad',
        current: '{count} frascos pagados',
        help: 'La promoción agrega frascos gratis sin aumentar el total cobrado.',
        unitPrice: '{price} por unidad',
        decrease: 'Disminuir cantidad',
        increase: 'Aumentar cantidad'
      },
      promo: {
        activeBadge: 'Promoción activa',
        buyTwoTitle: 'Compra 2 y recibe 1 gratis está aplicado',
        buyTwoText: 'Pagas {paid} frascos y recibes {total} en total: {free} frasco gratis incluido en el pedido.',
        buyThreeTitle: 'Compra 3 y recibe 2 gratis está aplicado',
        buyThreeText: 'Pagas {paid} frascos y recibes {total} en total: {free} frascos gratis incluidos en el pedido.'
      },
      upsell: {
        buyTwoBadge: 'Oferta recomendada',
        buyTwoTitle: 'Compra 2 y recibe 1 gratis',
        buyTwoText: 'Sube a 2 frascos pagados para recibir 3 en total y reducir el costo por frasco.',
        buyTwoAction: 'Activar compra 2 y recibe 1',
        buyThreeBadge: 'Mejor ahorro',
        buyThreeTitle: 'Compra 3 y recibe 2 gratis',
        buyThreeText: 'Ya tienes compra 2 y recibe 1 gratis. Sube a 3 frascos pagados para recibir 5 en total.',
        buyThreeAction: 'Activar compra 3 y recibe 2'
      },
      contact: {
        title: 'Email de compra',
        email: 'Email',
        emailPlaceholder: 'Ingresa tu correo',
        help: 'Lo usamos para validar cupones y enviar la confirmación del pedido.'
      },
      coupon: {
        title: 'Cupón',
        label: 'Código de descuento',
        placeholder: 'MELLO10',
        apply: 'Aplicar',
        applying: 'Aplicando...',
        applied: '{percent}% reservado para este email',
        invalid: 'Cupón inválido o expirado.',
        help: 'Inserta tu cupón y aplícalo antes del pago.'
      },
      payment: {
        title: 'Medios de pago',
        secure: 'Stripe seguro',
        secureTitle: 'Pago seguro con Stripe',
        secureInline: 'Pago seguro vía',
        stripe: 'Tarjeta o wallet',
        stripeText: 'Tus datos de pago se procesan en Stripe con protección de tarjeta, wallet y checkout cifrado.'
      },
      billing: {
        title: 'Facturación'
      },
      summary: {
        title: 'Resumen de la compra',
        product: 'Producto',
        freeBonus: 'Bonificación gratis',
        freeBonusValue: '+{count} gratis',
        delivered: 'Recibirás',
        deliveredValue: '{count} frascos',
        productDiscount: 'Descuento del producto',
        total: 'Total',
        saved: 'Ahorraste {amount}',
        pay: 'Pagar y finalizar',
        loading: 'Preparando pago...',
        foot: 'Revisarás los datos finales antes de confirmar el pago en Stripe.'
      },
      empty: {
        title: 'Tu carrito está vacío',
        text: 'Agrega MelloRise Gummies para revisar el checkout.',
        action: 'Ver producto'
      }
    }
  },
  en: {
    language: {
      label: 'Language',
      es: 'ES',
      en: 'EN'
    },
    meta: {
      home: 'MelloRise',
      collection: 'Products',
      contact: 'Contact',
      faq: 'FAQ',
      tracking: 'Track order',
      accountOrders: 'My purchases',
      signIn: 'Sign in',
      signUp: 'Sign up',
      checkout: 'Secure checkout',
      checkoutSuccess: 'Order confirmed'
    },
    loading: {
      label: 'Loading'
    },
    nav: {
      home: 'MelloRise',
      products: 'Products',
      contact: 'Contact Us',
      faq: 'FAQ',
      main: 'Main navigation',
      cart: 'Cart',
      cta: 'Buy gummies',
      menu: 'Open menu',
      closeMenu: 'Close menu',
      accountOrders: 'My purchases',
      tracking: 'Track order'
    },
    auth: {
      loading: 'Loading account',
      account: 'Account',
      back: 'Back',
      menu: 'Account menu',
      signIn: 'Sign in',
      signUp: 'Sign up',
      signOut: 'Sign out',
      orders: 'My purchases',
      profile: 'Manage account',
      track: 'Track order',
      support: 'Support'
    },
    authPage: {
      signInBadge: 'Secure access',
      signInTitle: 'Sign in to your account',
      signInText: 'See purchases, tracking, and support with the same email used at checkout.',
      signUpBadge: 'MelloRise account',
      signUpTitle: 'Create your account',
      signUpText: 'Save your purchases, continue with Google, and follow every order in one protected place.',
      ordersTitle: 'Protected purchases',
      ordersText: 'We only show orders linked to the email verified by Clerk.',
      securityTitle: 'Google sign-in',
      securityText: 'Clerk protects access while the BFF validates every order before exposing details.',
      alreadySignedInTitle: 'You are already in, {name}',
      alreadySignedInText: 'Your session is active. You can go straight to your purchases.'
    },
    account: {
      eyebrow: 'MelloRise account',
      title: 'My purchases',
      subtitle: 'Sign in with the same email used at checkout to see your orders, statuses, and tracking codes.',
      loadingAuth: 'Loading secure authentication',
      signInTitle: 'Sign in to see your purchases',
      signInText: 'We use Clerk to confirm your identity and protect your order details.',
      signedInAs: 'Signed in as',
      refresh: 'Refresh orders',
      loadingOrders: 'Finding your orders',
      errorTitle: 'We could not load your purchases',
      error: 'Try again in a few seconds. If the problem continues, use the tracking page with your code.',
      tryAgain: 'Try again',
      emptyTitle: 'You do not have purchases yet',
      emptyText: 'When you buy with this email, your orders will appear here automatically.',
      emptyAction: 'Explore catalog',
      order: 'Order',
      trackingReady: 'Tracking available',
      trackingPending: 'We are still preparing shipment. We will email your tracking code when Wiio creates it.',
      authUnavailableTitle: 'Enable Clerk to unlock accounts',
      authUnavailableText: 'Set VITE_CLERK_PUBLISHABLE_KEY in the frontend and CLERK_SECRET_KEY in the BFF to enable Google sign-in and protected orders.'
    },
    catalog: {
      bannerAlt: 'MelloRise Heightener Gummies banner with natural ingredients',
      badge: 'MelloRise Products',
      title: 'Choose a simple nutrition routine',
      intro: 'Gummies designed for families who want a clear, practical purchase that is easy to repeat.',
      featured: 'Featured product',
      loadingProducts: 'Loading products...',
      productAvailable: '{count} product available',
      productsAvailable: '{count} products available',
      bundleProductsAvailable: '{count} offers available',
      bundleAction: 'Choose offer',
      chips: {
        routine: 'Daily routine',
        gummy: 'Gummy format',
        responsible: 'Responsible use'
      },
      loadingTitle: 'Loading products...',
      loadingText: 'We are preparing the catalog.',
      emptyTitle: 'No products available',
      emptyText: 'Connect the API or add products to fill this collection.'
    },
    contact: {
      title: 'Get in touch',
      status: 'Message ready to send when you connect the form endpoint.',
      name: 'Name',
      email: 'Email',
      emailRequired: 'Email *',
      phone: 'Phone number',
      comment: 'Comment',
      send: 'Send'
    },
    product: {
      topbarLabel: 'Hormone-free, gluten-free, responsible use',
      topbar: {
        hormoneFree: 'Hormone-free',
        glutenFree: 'Gluten-free',
        responsible: 'Responsible use',
        selected: 'Selected ingredients'
      },
      lede: 'A nutritional support gummy for families who want to keep a consistent, practical routine that is easy to add to the day.',
      highlightsLabel: 'Product highlights',
      chips: {
        routine: 'Daily routine',
        gummy: 'Gummy format',
        guided: 'Guided purchase',
        labelUse: 'Use according to label'
      },
      offer: {
        title: 'Family offer',
        text: 'Choose the pack that best fits your routine.'
      },
      bundles: {
        shipping: {
          standard: 'Ships with standard delivery',
          free: 'Free shipping included',
          freePriority: 'Free priority-style shipping'
        }
      },
      bundleCards: {
        buyOne: {
          title: 'Buy 1',
          meta: 'Starter routine'
        },
        buyTwo: {
          title: 'Buy 2 Get 1 Free',
          meta: 'Most popular',
          badge: 'Most popular'
        },
        buyThree: {
          title: 'Buy 3 Get 2 Free',
          meta: 'Best value',
          badge: 'Best value'
        }
      },
      quantity: {
        label: 'Quantity',
        decrease: 'Decrease quantity',
        increase: 'Increase quantity'
      },
      gallery: {
        label: 'Product images',
        previous: 'Previous image',
        next: 'Next image',
        expanded: 'Expanded product image',
        close: 'Close expanded image',
        loading: 'Loading image'
      },
      addToCart: 'Add to cart',
      buyNow: 'Buy Now',
      purchaseNote: 'Secure purchase. Always review ingredients, dosage, and use according to the real product label.',
      regionLock: 'MelloRise checkout is currently available only in the United States. Brazil is enabled temporarily during development.',
      regionShortLock: 'Not available in your region',
      trust: {
        label: 'Trust and delivery information',
        freeShipping: 'Free Shipping',
        secureCheckout: 'Secure checkout',
        noArtificialHormones: 'No artificial hormones',
        noStimulants: 'No stimulants',
        dailyRoutine: 'Daily routine friendly',
        clearLabel: 'Clear label formula'
      },
      accordions: {
        details: {
          title: 'Product details',
          intro: 'A science-backed daily growth development supplement designed for kids and teens**. Each serving provides essential vitamins, minerals, and growth-supporting nutrients including:',
          items: {
            d3: 'Vitamin D3',
            k2: 'Vitamin K2 as MK-7',
            minerals: 'Calcium, magnesium and zinc',
            amino: "3 key amino acids that support your child's natural growth signals: L-arginine, L-ornithine and L-glutamine."
          },
          note: 'It helps to support natural height development, strong bones, improved sleep quality and overall wellness.'
        },
        ingredients: {
          title: 'Ingredient list',
          intro: 'MelloRise Heightener Gummies are ideal for:',
          label: 'MelloRise Heightener Gummies are also:',
          items: {
            school: 'Kids 5+ and teenagers, still in their growth phase',
            bones: 'Parents looking to support healthy bone development',
            picky: 'Picky eaters who may not get enough nutrients from diet alone',
            active: 'Active children who need extra nutritional support',
            routine: 'Families looking for an easy and tasty daily growth-support routine'
          },
          claims: {
            vegan: 'Vegan',
            nonGmo: 'Non-GMO',
            glutenFree: 'Gluten-free',
            gelatinFree: 'Gelatin free',
            halal: 'Halal'
          }
        },
        benefits: {
          title: 'Key benefits',
          intro: 'Daily support for:',
          items: {
            height: 'Natural height development',
            bones: 'Healthy bone and joint strength',
            sleep: 'Better sleep quality and recovery for kids and teens',
            confidence: 'Boosted confidence',
            skeletal: 'Overall skeletal health'
          }
        },
        usage: {
          title: 'How to use',
          items: {
            dose: 'Take 2 gummies once per day',
            chew: 'Chew thoroughly before swallowing',
            flavor: 'Enjoy the delicious strawberry flavor'
          },
          note: 'No mixing. No water. No hassle.'
        },
        shipping: {
          title: 'Shipping and returns',
          intro: 'MelloRise Heightener Gummies are made with carefully selected, high-quality ingredients designed for safety and effectiveness for growing bodies.',
          claims: 'Our gummies are: ✓ Vegan ✓ Non-GMO ✓ Gluten-free ✓ Free of artificial colors and dyes ✓ Hormone-free ✓ Third-party tested',
          note: 'Every batch is produced under strict quality standards to ensure purity, safety and consistency.'
        }
      }
    },
    home: {
      offer: {
        ariaLabel: 'Welcome offer',
        kicker: 'Welcome offer',
        title: 'Want to save on your first order?',
        subtitle: 'On your first purchase',
        alreadySaved: 'Your discount is ready',
        emailLabel: 'Email to reserve your coupon',
        emailPlaceholder: 'Enter your email',
        claim: 'Yes, claim my discount',
        loading: 'Creating coupon...',
        error: 'We could not create the coupon. Please try again.',
        dismiss: 'No, I prefer to continue',
        close: 'Close offer',
        shopWithDiscount: 'Shop with discount'
      },
      offerConfirm: {
        ariaLabel: 'Confirm discount loss',
        loss: 'Last chance to keep 10%',
        title: 'Close this and your welcome discount is gone.',
        subtitle: 'It only takes an email to reserve it. Use it at checkout on your first order and keep browsing with no commitment.',
        keep: 'Keep my 10%',
        lose: 'Lose the discount'
      },
      nutrients: {
        badge: 'All In One Nutrients',
        title: 'Everything in one',
        titleStrong: 'easy-to-remember format',
        intro: 'MelloRise brings selected nutrients together in gummy format to support a simple daily routine.',
        items: {
          calcium: {
            title: 'Calcium',
            text: 'A mineral associated with the normal maintenance of bones and teeth as part of a balanced diet.'
          },
          magnesium: {
            title: 'Magnesium',
            text: 'Supports important nutritional functions and fits into daily wellness routines.'
          },
          boron: {
            title: 'Boron',
            text: 'A supporting ingredient formulated to complement the product mineral blend.'
          },
          zinc: {
            title: 'Zinc',
            text: 'A mineral used in supplements for its role in normal body processes.'
          },
          vitaminD3: {
            title: 'Vitamin D3',
            text: 'Helps normal calcium utilization when combined with healthy habits.'
          },
          vitaminK2: {
            title: 'Vitamin K2',
            text: 'Part of a formula designed to support daily nutritional routines.'
          },
          arginine: {
            title: 'L-Arginine',
            text: 'An amino acid included as part of the gummy nutritional combination.'
          },
          ornithine: {
            title: 'L-Ornithine',
            text: 'Complements the formula alongside other selected nutrients for responsible use.'
          }
        }
      },
      ingredientMap: {
        badge: 'Formula',
        title: 'Everything in one',
        titleStrong: 'easy-to-remember format',
        intro: 'Nutrients carefully selected for a simple, clear, and easy-to-follow routine.',
        items: {
          calcium: {
            title: 'Calcium (250 mg)',
            text: 'Supports a daily nutritional routine alongside a balanced diet.'
          },
          magnesium: {
            title: 'Magnesium (100 mg)',
            text: 'Supports important nutritional functions for everyday wellness.'
          },
          vitaminK2: {
            title: 'Vitamin K2',
            text: 'Part of a formula designed to support daily nutritional routines.'
          },
          arginine: {
            title: 'L-Arginine (100 mg)',
            text: 'An amino acid included as part of the gummy nutritional combination.'
          },
          zinc: {
            title: 'Zinc (10 mg)',
            text: 'A mineral used in supplements for its role in normal body processes.'
          },
          vitaminD3: {
            title: 'Vitamin D3 15 mcg',
            text: 'Helps normal calcium utilization when combined with healthy habits.'
          },
          ornithine: {
            title: 'L-Ornithine',
            text: 'Complements the formula alongside other selected nutrients for responsible use.'
          },
          glutamine: {
            title: 'L-Glutamine (50 mg)',
            text: 'An ingredient within the nutritional profile of the MelloRise routine.'
          }
        }
      },
      journey: {
        badge: 'Process and care',
        title: 'From origin to your door.',
        titleStrong: 'Every step matters.',
        intro: 'A simple view of the MelloRise journey: from ingredient selection to the shopping experience, with information that can be adjusted to the brand real operation.',
        ariaLabel: 'MelloRise care process',
        steps: {
          selection: {
            title: 'Selection',
            text: 'Ingredients organized for a formula that is easy to present and review.'
          },
          preparation: {
            title: 'Preparation',
            text: 'Gummy format designed to fit into a simple daily routine.'
          },
          review: {
            title: 'Review',
            text: 'Information ready to be adjusted according to the real product label.'
          },
          care: {
            title: 'Care',
            text: 'Clear communication, without exaggerated promises or unconfirmed data.'
          },
          packaging: {
            title: 'Packaging',
            text: 'Consistent brand presentation to strengthen purchase confidence.'
          },
          delivery: {
            title: 'Delivery',
            text: 'Final path to the cart and product page with less friction.'
          }
        }
      },
      faq: {
        badge: "FAQ's",
        title: 'Have questions?',
        titleStrong: 'We have answers',
        intro: 'Clear answers about MelloRise, the daily routine, and the details before buying.',
        imageAlt: 'MelloRise Heightener Gummies bottle with gummies',
        items: {
          what: {
            question: 'What are MelloRise Heightener Gummies?',
            answer: 'MelloRise Heightener Gummies are nutritional support gummies designed to fit into the daily routine of families with kids and teens. They bring together nutrients in the formula such as vitamin D3, vitamin K2, calcium, magnesium, zinc, and selected amino acids.'
          },
          who: {
            question: 'Who are they for?',
            answer: 'For families looking for a practical way to complement daily habits during growth stages. If there is a medical condition, medication, or any question about use, consult a professional before adding any supplement.'
          },
          benefits: {
            question: 'Key benefits',
            answer: 'MelloRise helps present daily nutritional support in a clear and organized way, with a gummy format designed for families and a more practical routine.'
          },
          usage: {
            question: 'How do you use it?',
            answer: 'Review the serving size listed on the real product label and include the gummies within a consistent daily routine.'
          },
          quality: {
            question: 'Quality and formula',
            answer: 'This section should reflect only characteristics confirmed by the final label. Validate ingredients, seals, warnings, dosage, and permitted benefits before publishing.'
          },
          shipping: {
            question: 'Shipping and returns',
            answer: 'Shipping times, return policies, and guarantee conditions should reflect the store real configuration.'
          }
        }
      }
    },
    footer: {
      logoLabel: 'MelloRise',
      headline: 'Sign up for news and promotions',
      intro: 'MelloRise is a nutritional gummy designed to support simple family routines.',
      emailLabel: 'Email address',
      emailPlaceholder: 'Your email',
      subscribe: 'Subscribe',
      consent: 'By subscribing, you agree to receive communications from MelloRise. You can unsubscribe anytime.',
      explore: 'Explore',
      support: 'Support',
      home: 'Home',
      benefits: 'Benefits',
      routine: 'Routine',
      reviews: 'Reviews',
      buy: 'Buy',
      contact: 'Contact',
      faq: 'FAQs',
      shipping: 'Shipping and returns',
      tracking: 'Track order',
      privacy: 'Privacy',
      payments: 'Payment methods',
      rights: 'All rights reserved.',
      privacyPolicy: 'Privacy policy',
      terms: 'Terms of service',
      refunds: 'Refunds'
    },
    institutional: {
      shipping: {
        title: 'Shipping and returns',
        intro: 'Review base shipping, exchange, and return information here. Adjust this copy to match the store final policy before publishing.',
        sections: [
          ['Processing', 'Orders are prepared after payment confirmation. Exact timing should reflect MelloRise real operation.'],
          ['Delivery', 'Delivery times may vary by destination, carrier, and logistics availability.'],
          ['Returns', 'Return conditions should follow the official store policy and any rules that apply to the product.']
        ]
      },
      // Tracking is hidden until MelloRise has a real order tracking flow.
      // tracking: {
      //   title: 'Track order',
      //   intro: 'Use this page as a temporary tracking destination until the final tracking tool is connected.',
      //   sections: [
      //     ['Tracking code', 'When the order ships, the customer should receive a tracking code or link by email.'],
      //     ['Order status', 'The final integration can connect to a tracking app or backend to show real-time status.']
      //   ]
      // },
      privacy: {
        title: 'Privacy policy',
        intro: 'Base privacy copy. Replace it with the final legal policy before publishing the store.',
        sections: [
          ['Contact data', 'The store may collect information needed to process orders, provide support, and send authorized communications.'],
          ['Information use', 'Information should be used to operate the store, improve the experience, and meet applicable obligations.'],
          ['Preferences', 'Customers should be able to manage communications according to the brand final policy.']
        ]
      },
      terms: {
        title: 'Terms of service',
        intro: 'Base terms of service copy. Validate the final content with the store official policy.',
        sections: [
          ['Site use', 'Use of the site should follow the conditions published by MelloRise.'],
          ['Purchases', 'Prices, availability, and commercial conditions should reflect the real store configuration.'],
          ['Responsibility', 'Product information should be used according to the real label and published policies.']
        ]
      },
      refunds: {
        title: 'Refunds',
        intro: 'Base refund policy copy. Adjust before publishing according to the real operation.',
        sections: [
          ['Requests', 'Refund requests should follow the store official channels and timelines.'],
          ['Conditions', 'Conditions depend on order status, received product, and active policy.'],
          ['Support', 'For questions, customers can contact the support team from the contact page.']
        ]
      },
      default: {
        title: 'Store information',
        intro: 'This page is ready for MelloRise institutional content.',
        sections: [
          ['Editable content', 'Update this section with the store final information.']
        ]
      }
    },
    cart: {
      title: 'Cart',
      oneItem: '1 item',
      manyItems: '{count} items',
      close: 'Close cart',
      ready: 'Your cart is ready for checkout',
      quantity: 'Quantity',
      decrease: 'Decrease quantity',
      increase: 'Increase quantity',
      remove: 'Remove product',
      empty: 'Your cart is empty.',
      viewProduct: 'View product',
      note: 'Order special instructions',
      notePlaceholder: 'Add a note',
      subtotal: 'Subtotal',
      checkout: 'Check out',
      checkoutLoading: 'Preparing checkout...',
      regionLock: 'Checkout is currently available only in the United States. Brazil is enabled temporarily during development.',
      shippingProtection: {
        title: 'Shipping protection',
        text: 'Protect your order against damage, loss, or theft during shipping.',
        toggle: 'Toggle shipping protection'
      },
      discount: {
        label: 'Discount applied'
      }
    },
    checkoutTransition: {
      title: 'Preparing your checkout',
      text: 'We are securing your cart and preparing payment.'
    },
    checkoutExit: {
      ariaLabel: 'Confirm leaving checkout',
      badge: 'Order in progress',
      title: 'Leave without finishing?',
      text: 'Your discount, selected bottles, and cart are ready. Stay here to finish your secure checkout.',
      keep: 'Continue my purchase',
      leave: 'Leave checkout'
    },
    checkoutSuccess: {
      title: 'Order confirmed',
      text: 'Your payment was received and the order is being prepared for fulfillment.',
      orderLabel: 'Order',
      note: 'When tracking is available, we will email it and show it on the order tracking page.',
      trackAction: 'Track order',
      action: 'Back to product'
    },
    tracking: {
      intro: 'Order tracking',
      title: 'Track your order',
      subtitle: 'Enter the email used at checkout and your order number or tracking code. We only show the details needed to protect your information.',
      form: {
        title: 'Find your order',
        text: 'No account is required. We use these details to confirm the order belongs to you.',
        email: 'Purchase email',
        emailPlaceholder: 'Email address',
        identifier: 'Order number or tracking code',
        identifierPlaceholder: 'Example: 1042 or WIIO123456',
        submit: 'Check status',
        loading: 'Checking...',
        error: 'We could not find an order with those details. Check the email and number, then try again.'
      },
      empty: {
        title: 'Your status will appear here',
        text: 'When Wiio sends the tracking code, we will email it and show it on this page.',
        codeTitle: 'Enter the tracking code to locate your delivery',
        codeText: 'If you do not have the code yet, come back when it arrives by email. This protects order details without requiring an account.'
      },
      result: {
        order: 'Order',
        trackingCode: 'Tracking code',
        openCarrier: 'Open tracking',
        pendingTitle: 'We are still preparing shipment',
        pendingText: 'Your payment was received. The tracking code will appear here when fulfillment ships the order.'
      },
      steps: {
        confirmed: 'Order confirmed',
        confirmedText: 'We received your order and saved it in WooCommerce.',
        preparing: 'Preparing',
        preparingText: 'We are preparing products and details for fulfillment.',
        shipped: 'Shipped',
        shippedText: 'The tracking code was created by fulfillment.',
        delivered: 'Delivered',
        deliveredText: 'The order arrived at its destination.'
      }
    },
    checkout: {
      eyebrow: 'Secure checkout',
      title: 'Finalize your purchase',
      intro: 'Confirm your email, coupon, and delivery options. Payment opens in Stripe with the final total.',
      back: 'Back to product',
      secure: 'Payment protected by Stripe',
      product: {
        label: 'Product',
        badge: 'Best seller'
      },
      quantity: {
        title: 'Quantity',
        current: '{count} paid bottles',
        help: 'Promotions add free bottles without increasing the charged total.',
        unitPrice: '{price} each',
        decrease: 'Decrease quantity',
        increase: 'Increase quantity'
      },
      promo: {
        activeBadge: 'Promotion active',
        buyTwoTitle: 'Buy 2, Get 1 Free is applied',
        buyTwoText: 'You pay for {paid} bottles and receive {total} total: {free} free bottle included in the order.',
        buyThreeTitle: 'Buy 3, Get 2 Free is applied',
        buyThreeText: 'You pay for {paid} bottles and receive {total} total: {free} free bottles included in the order.'
      },
      upsell: {
        buyTwoBadge: 'Recommended offer',
        buyTwoTitle: 'Buy 2, get 1 free',
        buyTwoText: 'Move to 2 paid bottles to receive 3 total and lower the cost per bottle.',
        buyTwoAction: 'Activate Buy 2 Get 1 Free',
        buyThreeBadge: 'Best savings',
        buyThreeTitle: 'Buy 3, get 2 free',
        buyThreeText: 'You already unlocked Buy 2 Get 1 Free. Move to 3 paid bottles to receive 5 total.',
        buyThreeAction: 'Activate Buy 3 Get 2 Free'
      },
      contact: {
        title: 'Purchase email',
        email: 'Email',
        emailPlaceholder: 'Enter your email',
        help: 'We use this email to validate coupons and send your order confirmation.'
      },
      coupon: {
        title: 'Coupon',
        label: 'Discount code',
        placeholder: 'MELLO10',
        apply: 'Apply',
        applying: 'Applying...',
        applied: '{percent}% reserved for this email',
        invalid: 'Coupon invalid or expired.',
        help: 'Enter your coupon and apply it before payment.'
      },
      payment: {
        title: 'Payment methods',
        secure: 'Secure Stripe',
        secureTitle: 'Payment secure with Stripe',
        secureInline: 'Secure payment via',
        stripe: 'Card or wallet',
        stripeText: 'Your payment details are processed by Stripe with encrypted card, wallet, and checkout protection.'
      },
      billing: {
        title: 'Billing'
      },
      summary: {
        title: 'Purchase summary',
        product: 'Product',
        freeBonus: 'Free bonus',
        freeBonusValue: '+{count} free',
        delivered: 'You receive',
        deliveredValue: '{count} bottles',
        productDiscount: 'Product discount',
        total: 'Total',
        saved: 'You saved {amount}',
        pay: 'Pay and finish',
        loading: 'Preparing payment...',
        foot: 'You will review final details before confirming payment in Stripe.'
      },
      empty: {
        title: 'Your cart is empty',
        text: 'Add MelloRise Gummies to review checkout.',
        action: 'View product'
      }
    }
  }
}
