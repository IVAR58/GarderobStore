/**
 * Стартовый контент магазина.
 *
 * ВНИМАНИЕ: названия товаров, описания и цены — временные нейтральные данные.
 * Для замены на реальный ассортимент достаточно отредактировать массивы ниже
 * (или заменить изображения на свои URL / файлы из /public).
 *
 * Отзывы — реальные отзывы с Яндекс Карт. Адреса магазинов — реальные.
 */
import type { ProductColor } from "./schema";

/** Временные фотографии (Pexels). Заменить на фотографии бренда. */
export const img = (id: number) =>
  `/images/products/${id}.jpg`;

export const siteImages = {
  hero: "/images/hero/hero.webp",
  heroPortrait: "/images/hero/hero-portrait.jpg",
  aboutBoutique: "/images/hero/about-boutique.jpg",
  aboutRack: "/images/hero/about-rack.jpg",
  aboutDetail: "/images/hero/about-detail.jpg",
  storeInterior: "/images/hero/store-interior.jpg",
  storeRack: "/images/hero/store-rack.jpg",
  editorial: "/images/hero/editorial.jpg",
  mannequin: "/images/hero/mannequin.jpg",
};

export const palette: Record<string, string> = {
  Чёрный: "#1C1719",
  Белый: "#F5F3F0",
  Молочный: "#F1E9DF",
  Бежевый: "#D8C3AD",
  Пудровый: "#E9C4D0",
  Серый: "#9A9A9A",
  Шоколадный: "#5B3A2E",
  Карамельный: "#B47A4A",
  Изумрудный: "#2F6B57",
  Оливковый: "#6F7A4B",
  Бордовый: "#6E1F2E",
  Красный: "#B3202C",
  Синий: "#2B3A67",
  Голубой: "#A9C4DF",
  Золотой: "#C9A24D",
  Серебряный: "#BFC3C9",
};

export const colorsOf = (...names: string[]): ProductColor[] =>
  names.map((name) => ({ name, hex: palette[name] ?? "#CCCCCC" }));

export const SIZES = {
  clothing: ["XS", "S", "M", "L", "XL"],
  shoes: ["36", "37", "38", "39", "40"],
  one: ["Единый размер"],
};

export type SeedCategory = {
  slug: string;
  name: string;
  description: string;
  image: string;
};

export const seedCategories: SeedCategory[] = [
  { slug: "dresses", name: "Платья", description: "От лаконичных миди до вечерних силуэтов.", image: "/images/categories/platya.jpg" },
  { slug: "suits", name: "Костюмы", description: "Брючные и юбочные костюмы на каждый день и для особых случаев.", image: "/images/categories/kastyoum.jpg" },
  { slug: "blouses", name: "Блузы и рубашки", description: "Базовые и акцентные модели из хлопка, вискозы и шёлка.", image: "/images/categories/roubachki.jpg" },
  { slug: "outerwear", name: "Верхняя одежда", description: "Пальто, тренчи и куртки для любого сезона.", image: "/images/categories/verkhnaya.jpg" },
  { slug: "knitwear", name: "Трикотаж", description: "Мягкие джемперы и кардиганы из натуральных волокон.", image: "/images/categories/kardigan.jpg" },
  { slug: "bottoms", name: "Юбки и брюки", description: "Актуальные силуэты для гардероба на каждый день.", image: "/images/categories/youbki.jpg" },
  { slug: "shoes", name: "Обувь", description: "Туфли и босоножки, которые завершают образ.", image: "/images/categories/obouf.jpg" },
  { slug: "jewelry", name: "Бижутерия", description: "Серьги, колье и цепочки для финального штриха.", image: "/images/categories/jewii.jpg" },
  { slug: "lingerie", name: "Бельё и домашняя одежда", description: "Шёлк, атлас и кружево для дома и отдыха.", image: "/images/categories/domachni.jpg" },
];

export type SeedProduct = {
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  images: number[];
  colors: string[];
  sizes?: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
  popularity: number;
  description: string;
  details: string[];
};

const careClothing = ["Деликатная стирка при 30°C", "Не отбеливать", "Гладить при низкой температуре"];

export const seedProducts: SeedProduct[] = [
  // ——— Платья ———
  { slug: "plate-midi-s-drapirovkoy", name: "Платье-миди с драпировкой", category: "dresses", price: 4990, compareAtPrice: 6490, images: [8989492, 34171256], colors: ["Изумрудный", "Чёрный"], isNew: true, isFeatured: true, popularity: 88, description: "Платье длины миди с мягкой драпировкой по лифу и струящейся юбкой. Подчёркивает талию и красиво ложится в движении — универсальный вариант для офиса и вечера.", details: ["Состав: 95% вискоза, 5% эластан", "Длина по спинке: 118 см (размер S)", ...careClothing] },
  { slug: "atlasnoe-plate-kombinaciya", name: "Атласное платье-комбинация", category: "dresses", price: 3990, images: [27580017, 14275812], colors: ["Молочный", "Пудровый", "Чёрный"], isBestseller: true, popularity: 95, description: "Лаконичное платье-комбинация на тонких бретелях из гладкого атласа с благородным блеском. Носите самостоятельно или поверх тонкого джемпера.", details: ["Состав: 100% полиэстер (атлас)", "Регулируемые бретели", ...careClothing] },
  { slug: "vechernee-plate-s-otkrytymi-plechami", name: "Вечернее платье с открытыми плечами", category: "dresses", price: 7490, images: [34160661, 38748647], colors: ["Красный", "Чёрный"], isFeatured: true, popularity: 76, description: "Эффектное платье с открытой линией плеч и корсетной посадкой. Плотная ткань держит форму и создаёт безупречный силуэт.", details: ["Состав: 70% полиэстер, 27% вискоза, 3% эластан", "Потайная молния на спинке", "Только сухая чистка"] },
  { slug: "plate-v-goroh-s-volanami", name: "Платье в горох с воланами", category: "dresses", price: 3490, compareAtPrice: 4290, images: [8576047, 25111218], colors: ["Бордовый", "Чёрный"], popularity: 64, description: "Романтичное платье с принтом в горох, воланами по подолу и рукавами-фонариками. Лёгкая ткань приятна к телу и не сковывает движений.", details: ["Состав: 100% вискоза", "Длина миди", ...careClothing] },
  { slug: "kruzhevnoe-plate-maksi", name: "Кружевное платье макси", category: "dresses", price: 6990, images: [14235248, 18731383], colors: ["Чёрный", "Молочный"], isNew: true, popularity: 70, description: "Платье в пол из тонкого кружева на подкладке. Изысканная модель для торжественного вечера, которая не требует дополнительных акцентов.", details: ["Верх: 100% полиамид (кружево)", "Подкладка: 100% вискоза", "Только сухая чистка"] },

  // ——— Костюмы ———
  { slug: "bryuchnyy-kostyum-iz-kostyumnoy-sherst", name: "Брючный костюм из костюмной шерсти", category: "suits", price: 8990, compareAtPrice: 10990, images: [18718843, 19318304], colors: ["Чёрный", "Бежевый"], isBestseller: true, isFeatured: true, popularity: 99, description: "Классический костюм-двойка: однобортный жакет с мягкой линией плеча и прямые брюки со стрелками. Ткань с добавлением шерсти не мнётся и держит форму весь день.", details: ["Состав: 60% полиэстер, 35% шерсть, 5% эластан", "Жакет на подкладке", "Только сухая чистка"] },
  { slug: "kostyum-s-zhiletom", name: "Костюм с жилетом", category: "suits", price: 7990, images: [19272278, 10040258], colors: ["Чёрный", "Серый"], isNew: true, popularity: 82, description: "Костюм-тройка с приталенным жилетом, который можно носить отдельно с рубашкой или на голое тело. Современная интерпретация мужской классики.", details: ["Состав: 65% полиэстер, 33% вискоза, 2% эластан", "В комплекте: жакет, жилет, брюки", "Только сухая чистка"] },
  { slug: "kostyum-v-pastelnyh-tonah", name: "Костюм в пастельных тонах", category: "suits", price: 6490, images: [8483838, 6702630], colors: ["Пудровый", "Белый"], popularity: 71, description: "Лёгкий костюм в нежной пастельной гамме с укороченным жакетом и брюками прямого кроя. Идеальный выбор для весенних и летних мероприятий.", details: ["Состав: 72% полиэстер, 25% вискоза, 3% эластан", "Жакет на одной пуговице", ...careClothing] },
  
  

  // ——— Блузы и рубашки ———
  { slug: "oversayz-rubashka-iz-hlopka", name: "Оверсайз-рубашка из хлопка", category: "blouses", price: 2990, images: [7945547, 27599411], colors: ["Белый", "Голубой"], isBestseller: true, popularity: 93, description: "Свободная рубашка из плотного хлопка со спущенной линией плеча. База, которая работает с джинсами, брюками и юбками любой длины.", details: ["Состав: 100% хлопок", "Нагрудный карман", ...careClothing] },
  { slug: "shelkovaya-bluza-s-bantom", name: "Шёлковая блуза с бантом", category: "blouses", price: 4490, images: [40529591, 18205652], colors: ["Молочный", "Пудровый"], isNew: true, isFeatured: true, popularity: 80, description: "Блуза из шёлковистой ткани с завязками-бантом у горловины. Романтичная деталь, которая преображает даже самый строгий костюм.", details: ["Состав: 100% полиэстер (имитация шёлка)", "Съёмный бант", "Деликатная ручная стирка"] },
 

  // ——— Верхняя одежда ———
  { slug: "dvubortnoe-palto-iz-shersti", name: "Двубортное пальто из шерсти", category: "outerwear", price: 12900, compareAtPrice: 15900, images: [35114789, 38117548], colors: ["Серый", "Бежевый"], isBestseller: true, isFeatured: true, popularity: 97, description: "Прямое двубортное пальто из плотной шерстяной ткани с английским воротником. Тёплое, статусное и вне времени.", details: ["Состав: 70% шерсть, 20% полиэстер, 10% полиамид", "Подкладка: 100% вискоза", "Только сухая чистка"] },
  { slug: "klassicheskiy-trench", name: "Классический тренч", category: "outerwear", price: 9990, images: [19169279, 36352974], colors: ["Бежевый", "Чёрный"], isNew: true, popularity: 90, description: "Тренч из водоотталкивающего хлопка с поясом, погонами и двубортной застёжкой. Вещь, которая не выходит из моды десятилетиями.", details: ["Состав: 65% хлопок, 35% полиэстер", "Водоотталкивающая пропитка", "Только сухая чистка"] },

  // ——— Трикотаж ———
  { slug: "kardigan-krupnoy-vyazki", name: "Кардиган крупной вязки", category: "knitwear", price: 4290, images: [5712104, 6968308], colors: ["Бежевый", "Серый"], isBestseller: true, popularity: 91, description: "Объёмный кардиган крупной вязки с накладными карманами. Мягкий, уютный и тёплый — для дома, прогулок и путешествий.", details: ["Состав: 50% шерсть, 50% акрил", "Свободный крой", "Ручная стирка, сушить горизонтально"] },
  { slug: "dzhemper-iz-merinosa", name: "Джемпер из мериноса", category: "knitwear", price: 4990, compareAtPrice: 5990, images: [5845789, 5845783], colors: ["Молочный", "Чёрный", "Серый"], popularity: 79, description: "Тонкий джемпер из мериносовой шерсти с круглым вырезом. Не колется, отлично держит тепло и легко сочетается с чем угодно.", details: ["Состав: 100% шерсть мериноса", "Тонкая вязка", "Ручная стирка, сушить горизонтально"] },

  // ——— Юбки и брюки ———
  { slug: "shirokie-bryuki-palacco", name: "Широкие брюки палаццо", category: "bottoms", price: 3990, images: [17705366, 14577095], colors: ["Чёрный", "Бежевый"], isBestseller: true, popularity: 92, description: "Брюки с высокой посадкой и широкими струящимися штанинами. Визуально удлиняют ноги и смотрятся элегантно с любым верхом.", details: ["Состав: 75% полиэстер, 20% вискоза, 5% эластан", "Застёжка на молнию", ...careClothing] },
  { slug: "yubka-midi-s-zapahom", name: "Юбка-миди с запахом", category: "bottoms", price: 3290, images: [33272123, 31064320], colors: ["Чёрный", "Шоколадный"], popularity: 67, description: "Юбка на запах с асимметричным подолом и завязками на талии. Ткань мягко драпируется и красиво двигается при ходьбе.", details: ["Состав: 100% вискоза", "Длина миди", ...careClothing] },

  // ——— Обувь ———
  { slug: "tufli-lodochki-na-shpilke", name: "Туфли-лодочки на шпильке", category: "shoes", price: 5490, images: [10686370, 37595216], colors: ["Чёрный"], sizes: SIZES.shoes, isBestseller: true, popularity: 89, description: "Классические лодочки с заострённым мысом на шпильке 9 см. Удобная колодка и мягкая стелька — можно провести на ногах весь вечер.", details: ["Верх: экокожа", "Высота каблука: 9 см", "Протирать мягкой тканью"] },
  { slug: "bosonozhki-na-kabluke", name: "Босоножки на каблуке", category: "shoes", price: 4990, compareAtPrice: 5990, images: [31450733, 29393718], colors: ["Бежевый", "Шоколадный"], sizes: SIZES.shoes, popularity: 70, description: "Босоножки на тонких ремешках с застёжкой вокруг щиколотки. Нейтральный оттенок, который подойдёт к любому летнему платью.", details: ["Верх: экокожа", "Высота каблука: 8 см", "Протирать мягкой тканью"] },
 
  // ——— Бижутерия ———
  { slug: "sergi-kolca", name: "Серьги-кольца", category: "jewelry", price: 1290, images: [9649265, 7615245], colors: ["Золотой", "Серебряный"], sizes: SIZES.one, isBestseller: true, popularity: 94, description: "Классические серьги-кольца среднего диаметра с гладкой полированной поверхностью. Универсальное украшение на каждый день.", details: ["Материал: сплав с покрытием", "Диаметр: 3 см", "Беречь от воды и парфюма"] },
 
  // ——— Бельё и домашняя одежда ———
  { slug: "shelkovyy-halat", name: "Шёлковый халат", category: "lingerie", price: 3990, images: [37692039, 34631585], colors: ["Пудровый", "Молочный"], isFeatured: true, popularity: 83, description: "Короткий халат из гладкого шёлковистого атласа с поясом и широкими рукавами. Прохладный к телу и приятно переливается на свету.", details: ["Состав: 100% полиэстер (атлас)", "Длина выше колена", "Деликатная ручная стирка"] },
  { slug: "atlasnaya-pizhama-s-bryukami", name: "Атласная пижама с брюками", category: "lingerie", price: 3490, compareAtPrice: 3990, images: [15957843, 11564181], colors: ["Пудровый", "Чёрный"], isBestseller: true, popularity: 86, description: "Комплект из рубашки на пуговицах и свободных брюк. Атлас с мягким блеском — для тех, кто ценит комфорт дома без компромиссов в красоте.", details: ["Состав: 100% полиэстер (атлас)", "Брюки на резинке с завязками", "Деликатная ручная стирка"] },
  
];

export type SeedReview = {
  author: string;
  badge: string;
  dateLabel: string;
  rating: number;
  body: string;
};

/** Реальные отзывы с Яндекс Карт. */
export const seedReviews: SeedReview[] = [
  {
    author: "Юлия Сочи",
    badge: "Знаток города 5 уровня",
    dateLabel: "23 июня",
    rating: 5,
    body: "Девочки, я в шоке!!! Зашла сегодня первый раз и обалдела, костюмы, платья, бижутерия, обувь — всё, что в тренде. Я себе покупала костюм за 15000, а здесь он 3000. Нижнее бельё шикарное. Всем рекомендую. Персонал добрый, отзывчивый, милый. Причём очень много девочек-консультантов ❤️❤️❤️ на всех хватит, всё чисто, красиво, убрано. Я под впечатлением ❤️❤️❤️ приду сюда обязательно",
  },
  {
    author: "Анастасия",
    badge: "Знаток города 4 уровня",
    dateLabel: "6 мая",
    rating: 5,
    body: "Недавно посетила магазин garderob и осталась очень довольна как выбором, так и обслуживанием. В ассортименте представлены стильные и качественные вещи для любого случая: от повседневной одежды до более нарядных вариантов. Приятно удивила возможность подобрать интересные аксессуары, которые отлично дополняют образ.\n\nОтдельно хочу отметить работу консультантов: вежливые, внимательные, не навязывают своё мнение, а помогают найти именно то, что нужно. Атмосфера в магазине уютная, всё аккуратно разложено, легко ориентироваться.\n\nЦены вполне соответствуют качеству, часто бывают акции и скидки. После покупки остались только положительные эмоции. Рекомендую garderob всем, кто ценит стиль, комфорт и хороший сервис!",
  },
  {
    author: "Алёна Морозкина",
    badge: "Знаток города 3 уровня",
    dateLabel: "19 мая",
    rating: 5,
    body: "Заказываю вещи только в этом магазине уже на протяжении 3-х лет, персонал вежливый, всегда помогает подобрать нужный размер (для меня это очень важно, потому что никогда не знаю свой размер 😁), всегда отправляют фото и видео как будет смотреться вещь. Одежда стильная, можно подобрать образ на любое мероприятие.\nВ самом магазине была один раз, так как живу в другом городе, очень стильно и уютно 🤍",
  },
  {
    author: "Ксения Виджюнас",
    badge: "Знаток города 4 уровня",
    dateLabel: "10 марта",
    rating: 5,
    body: "Отличный магазин ❤️🫶🏻 Очень понравился менеджер, который помог мне определиться с размером и, главное, помог с доставкой 💕 очень довольна ❤️ обязательно буду заказывать ещё безумно модные стильные вещи 🫶🏻 хочу сказать, цены очень приятные! И конечно же качество 👍",
  },
];

export type SeedStore = {
  name: string;
  address: string;
  city: string;
  hours: string;
  phone?: string;
  mapUrl: string;
};

const mapsLink = (address: string) =>
  `https://yandex.ru/maps/?text=${encodeURIComponent(`Казань, ${address}`)}`;

/** Реальные адреса магазинов. */
export const seedStores: SeedStore[] = [
  { name: "Garderob на Спартаковской", address: "ул. Спартаковская, 2к1", city: "Казань", hours: "Ежедневно 10:00–21:00", mapUrl: mapsLink("Спартаковская, 2к1") },
  { name: "Garderob на Ямашева", address: "пр-т Ямашева, 45а", city: "Казань", hours: "Ежедневно 10:00–21:00", mapUrl: mapsLink("Ямашева, 45а") },
  { name: "Garderob на Братьев Касимовых", address: "ул. Братьев Касимовых, 35", city: "Казань", hours: "Ежедневно 10:00–21:00", mapUrl: mapsLink("Братьев Касимовых, 35") },
  { name: "Garderob на Декабристов", address: "ул. Декабристов, 83", city: "Казань", hours: "Ежедневно 10:00–21:00", mapUrl: mapsLink("Декабристов, 83") },
];
