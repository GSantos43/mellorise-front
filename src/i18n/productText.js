const PRODUCT_TITLE_TRANSLATIONS = {
  '9-in-1 natural growth & bone support gummies for kids & teens': {
    es: 'Gomitas 9 en 1 para apoyo natural al crecimiento y los huesos de niños y adolescentes'
  }
}

export function translateProductTitle(title, locale) {
  const normalizedTitle = String(title || '').trim().toLowerCase()

  return PRODUCT_TITLE_TRANSLATIONS[normalizedTitle]?.[locale] || title
}
