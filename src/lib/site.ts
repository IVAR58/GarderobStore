/**
 * Центральная конфигурация бренда.
 * Все контактные данные, ссылки и настройки доставки меняются здесь.
 * Поля с пометкой TODO — временные значения, которые нужно заменить.
 */
export const site = {
  name: "Garderob_store",
  displayName: "Garderob",
  monogram: "GB",
  tagline: "Женская одежда",
  city: "Казань",
  description:
    "Garderob_store — сеть магазинов женской одежды в Казани. Костюмы, платья, трикотаж, обувь, бижутерия и бельё: всё, что в тренде, по честным ценам.",
  url: "https://garderob-store.ru", // TODO: заменить на реальный домен
  phone: "+7 (965) 583-52-59", // TODO: заменить на реальный номер
  phoneHref: "tel:+78430000000", // TODO: заменить на реальный номер
  email: "hello@garderob-store.ru", // TODO: заменить на реальный e-mail
  socials: {
    telegram: "https://t.me/GARDEROB_Centr", // TODO: проверить ссылку
    whatsapp: "https://wa.me/79655835259", // TODO: заменить на реальный номер
    vk: "https://vk.ru/public211047284", // TODO: проверить ссылку
    yandexMaps: "https://yandex.ru/maps/?text=Garderob_store%20Казань",
  },
  hoursShort: "Ежедневно 10:00–21:00",
  hours: [
    { day: "Понедельник", time: "10:00–21:00" },
    { day: "Вторник", time: "10:00–21:00" },
    { day: "Среда", time: "10:00–21:00" },
    { day: "Четверг", time: "10:00–21:00" },
    { day: "Пятница", time: "10:00–21:00" },
    { day: "Суббота", time: "10:00–21:00" },
    { day: "Воскресенье", time: "10:00–21:00" },
  ],
  delivery: {
    freeFrom: 5000,
    courier: 350,
    cdek: 450,
    pickup: 0,
  },
  promoCodes: {
    GB10: 10,
    WELCOME: 5,
  } as Record<string, number>,
  announcement: "Бесплатная доставка по Казани от 5 000 ₽ · 4 магазина в городе",
};

export const mainNav = [
  { label: "Новинки", href: "/new" },
  { label: "Каталог", href: "/catalog" },
  { label: "Sale", href: "/sale", accent: true },
  { label: "О бренде", href: "/about" },
  { label: "Магазины", href: "/stores" },
  { label: "Отзывы", href: "/reviews" },
];

export const customerLinks = [
  { label: "Доставка и возврат", href: "/delivery" },
  { label: "Таблица размеров", href: "/size-guide" },
  { label: "Отзывы", href: "/reviews" },
  { label: "Контакты", href: "/stores" },
];

export const companyLinks = [
  { label: "О бренде", href: "/about" },
  { label: "Магазины", href: "/stores" },
  { label: "Политика конфиденциальности", href: "/privacy" },
];
