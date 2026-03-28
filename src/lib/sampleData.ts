import { MenuCategory, MenuSubcategory, MenuItem } from "@/types";

export const sampleCategories: MenuCategory[] = [
  { id: "cases", name: { RU: "Чехлы", KZ: "Қаптар", EN: "Phone Cases" }, order: 1, icon: "📱" },
  { id: "earphones", name: { RU: "Наушники", KZ: "Құлаққаптар", EN: "Earphones" }, order: 2, icon: "🎧" },
  { id: "chargers", name: { RU: "Зарядки", KZ: "Зарядтағыштар", EN: "Chargers" }, order: 3, icon: "🔌" },
  { id: "cables", name: { RU: "Кабели", KZ: "Кабельдер", EN: "Cables" }, order: 4, icon: "🔗" },
  { id: "powerbanks", name: { RU: "Повербанки", KZ: "Повербанктар", EN: "Power Banks" }, order: 5, icon: "🔋" },
  { id: "screen-protectors", name: { RU: "Защитные стёкла", KZ: "Қорғаныш әйнектер", EN: "Screen Protectors" }, order: 6, icon: "🛡️" },
  { id: "holders", name: { RU: "Держатели", KZ: "Ұстағыштар", EN: "Holders & Stands" }, order: 7, icon: "🗄️" },
  { id: "speakers", name: { RU: "Колонки", KZ: "Динамиктер", EN: "Speakers" }, order: 8, icon: "🔊" },
];

export const sampleSubcategories: MenuSubcategory[] = [
  // Cases
  { id: "cases-iphone17", name: { RU: "iPhone 17", KZ: "iPhone 17", EN: "iPhone 17" }, categoryId: "cases", order: 1 },
  { id: "cases-iphone16", name: { RU: "iPhone 16", KZ: "iPhone 16", EN: "iPhone 16" }, categoryId: "cases", order: 2 },
  { id: "cases-iphone15", name: { RU: "iPhone 15", KZ: "iPhone 15", EN: "iPhone 15" }, categoryId: "cases", order: 3 },
  { id: "cases-samsung-s24", name: { RU: "Samsung S24", KZ: "Samsung S24", EN: "Samsung S24" }, categoryId: "cases", order: 4 },
  { id: "cases-samsung-s25", name: { RU: "Samsung S25", KZ: "Samsung S25", EN: "Samsung S25" }, categoryId: "cases", order: 5 },
  { id: "cases-xiaomi", name: { RU: "Xiaomi", KZ: "Xiaomi", EN: "Xiaomi" }, categoryId: "cases", order: 6 },
  // Chargers
  { id: "chargers-typec", name: { RU: "Type-C", KZ: "Type-C", EN: "Type-C" }, categoryId: "chargers", order: 1 },
  { id: "chargers-lightning", name: { RU: "Lightning", KZ: "Lightning", EN: "Lightning" }, categoryId: "chargers", order: 2 },
  { id: "chargers-wireless", name: { RU: "Беспроводные", KZ: "Сымсыз", EN: "Wireless" }, categoryId: "chargers", order: 3 },
  { id: "chargers-laptop", name: { RU: "Для ноутбуков", KZ: "Ноутбуктарға", EN: "Laptop Chargers" }, categoryId: "chargers", order: 4 },
  { id: "chargers-car", name: { RU: "Автомобильные", KZ: "Автокөлік", EN: "Car Chargers" }, categoryId: "chargers", order: 5 },
  // Earphones
  { id: "ear-airpods", name: { RU: "AirPods", KZ: "AirPods", EN: "AirPods" }, categoryId: "earphones", order: 1 },
  { id: "ear-earpods", name: { RU: "EarPods (проводные)", KZ: "EarPods (сымды)", EN: "EarPods (Wired)" }, categoryId: "earphones", order: 2 },
  { id: "ear-samsung", name: { RU: "Samsung Buds", KZ: "Samsung Buds", EN: "Samsung Buds" }, categoryId: "earphones", order: 3 },
  { id: "ear-budget", name: { RU: "Бюджетные TWS", KZ: "Бюджетті TWS", EN: "Budget TWS" }, categoryId: "earphones", order: 4 },
  // Cables
  { id: "cables-typec", name: { RU: "Type-C", KZ: "Type-C", EN: "Type-C" }, categoryId: "cables", order: 1 },
  { id: "cables-lightning", name: { RU: "Lightning", KZ: "Lightning", EN: "Lightning" }, categoryId: "cables", order: 2 },
  { id: "cables-micro", name: { RU: "Micro USB", KZ: "Micro USB", EN: "Micro USB" }, categoryId: "cables", order: 3 },
  // Screen protectors
  { id: "sp-iphone", name: { RU: "Для iPhone", KZ: "iPhone үшін", EN: "For iPhone" }, categoryId: "screen-protectors", order: 1 },
  { id: "sp-samsung", name: { RU: "Для Samsung", KZ: "Samsung үшін", EN: "For Samsung" }, categoryId: "screen-protectors", order: 2 },
];

// Tiny image helper: 200×200, q=60, WebP auto-format → ~5-10KB each instead of 40-80KB
const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=200&h=200&fit=crop&q=60&auto=format`;

export const sampleMenuItems: MenuItem[] = [
  // === CASES ===
  // iPhone 17
  { id: "case-ip17-clear", name: { RU: "Прозрачный чехол iPhone 17", KZ: "iPhone 17 мөлдір қап", EN: "Clear Case iPhone 17" }, description: { RU: "Тонкий прозрачный силиконовый чехол", KZ: "Жіңішке мөлдір силикон қап", EN: "Slim transparent silicone case" }, price: 2500, image: img("1601784551446-20c9e07cdbdb"), categoryId: "cases", subcategoryId: "cases-iphone17", available: true },
  { id: "case-ip17-magsafe", name: { RU: "MagSafe чехол iPhone 17", KZ: "iPhone 17 MagSafe қап", EN: "MagSafe Case iPhone 17" }, description: { RU: "Чехол с поддержкой MagSafe, мягкое покрытие", KZ: "MagSafe қолдауымен, жұмсақ жабын", EN: "MagSafe compatible, soft touch coating" }, price: 5500, image: img("1592899677977-9c10ca588bbd"), categoryId: "cases", subcategoryId: "cases-iphone17", available: true },
  { id: "case-ip17-armor", name: { RU: "Противоударный iPhone 17", KZ: "iPhone 17 соққыға берік", EN: "Armor Case iPhone 17" }, description: { RU: "Усиленная защита с подставкой", KZ: "Тіреуішпен күшейтілген қорғаныс", EN: "Heavy-duty protection with kickstand" }, price: 4500, image: img("1609081219090-a6d81d3085bf"), categoryId: "cases", subcategoryId: "cases-iphone17", available: true },
  // iPhone 16
  { id: "case-ip16-clear", name: { RU: "Прозрачный чехол iPhone 16", KZ: "iPhone 16 мөлдір қап", EN: "Clear Case iPhone 16" }, description: { RU: "Тонкий прозрачный чехол с защитой камеры", KZ: "Камера қорғанысымен жіңішке мөлдір қап", EN: "Slim clear case with camera protection" }, price: 2000, image: img("1603891128711-11b4b03bb138"), categoryId: "cases", subcategoryId: "cases-iphone16", available: true },
  { id: "case-ip16-leather", name: { RU: "Кожаный чехол iPhone 16", KZ: "iPhone 16 былғары қап", EN: "Leather Case iPhone 16" }, description: { RU: "Премиум кожаный чехол ручной работы", KZ: "Қолдан жасалған премиум былғары қап", EN: "Premium handcrafted leather case" }, price: 7000, image: img("1585386959984-a4155224a1ad"), categoryId: "cases", subcategoryId: "cases-iphone16", available: true },
  // iPhone 15
  { id: "case-ip15-silicone", name: { RU: "Силиконовый чехол iPhone 15", KZ: "iPhone 15 силикон қап", EN: "Silicone Case iPhone 15" }, description: { RU: "Мягкий силиконовый чехол, 12 цветов", KZ: "Жұмсақ силикон қап, 12 түс", EN: "Soft silicone case, 12 colors available" }, price: 1800, image: img("1541807084-5c52b6b3adef"), categoryId: "cases", subcategoryId: "cases-iphone15", available: true },
  { id: "case-ip15-wallet", name: { RU: "Чехол-кошелёк iPhone 15", KZ: "iPhone 15 әмиян-қап", EN: "Wallet Case iPhone 15" }, description: { RU: "Чехол с отделениями для карт", KZ: "Карталарға арналған бөліктері бар қап", EN: "Case with card holder compartments" }, price: 3500, image: img("1512054502232-10a0a035d672"), categoryId: "cases", subcategoryId: "cases-iphone15", available: true },
  // Samsung S24
  { id: "case-s24-clear", name: { RU: "Прозрачный чехол Samsung S24", KZ: "Samsung S24 мөлдір қап", EN: "Clear Case Samsung S24" }, description: { RU: "Тонкий чехол из прочного поликарбоната", KZ: "Берік поликарбонаттан жіңішке қап", EN: "Slim hard polycarbonate clear case" }, price: 2000, image: img("1610945265064-0e34e5519bbf"), categoryId: "cases", subcategoryId: "cases-samsung-s24", available: true },
  { id: "case-s24-rugged", name: { RU: "Защитный чехол Samsung S24", KZ: "Samsung S24 қорғаныш қап", EN: "Rugged Case Samsung S24" }, description: { RU: "Военный стандарт защиты MIL-STD-810G", KZ: "MIL-STD-810G әскери қорғаныс стандарты", EN: "Military-grade MIL-STD-810G protection" }, price: 5000, image: img("1574944985070-8f3ebc6b79d2"), categoryId: "cases", subcategoryId: "cases-samsung-s24", available: true },
  // Samsung S25
  { id: "case-s25-clear", name: { RU: "Прозрачный чехол Samsung S25", KZ: "Samsung S25 мөлдір қап", EN: "Clear Case Samsung S25" }, description: { RU: "Ультратонкий прозрачный чехол 0.5мм", KZ: "0.5мм ультра жіңішке мөлдір қап", EN: "Ultra-thin 0.5mm transparent case" }, price: 2500, image: img("1598327105666-5b89351aff97"), categoryId: "cases", subcategoryId: "cases-samsung-s25", available: true },
  // Xiaomi
  { id: "case-xiaomi-14", name: { RU: "Чехол Xiaomi 14", KZ: "Xiaomi 14 қап", EN: "Case Xiaomi 14" }, description: { RU: "Матовый силиконовый чехол", KZ: "Күңгірт силикон қап", EN: "Matte silicone case" }, price: 1500, image: img("1606220945770-b5b6c2c55bf1"), categoryId: "cases", subcategoryId: "cases-xiaomi", available: true },

  // === EARPHONES ===
  // AirPods
  { id: "airpods-pro2", name: { RU: "AirPods Pro 2", KZ: "AirPods Pro 2", EN: "AirPods Pro 2" }, description: { RU: "Активное шумоподавление, адаптивный звук", KZ: "Белсенді шуды басу, бейімделгіш дыбыс", EN: "Active noise cancellation, adaptive audio" }, price: 89000, image: img("1606741965326-cb990ae01bb2"), categoryId: "earphones", subcategoryId: "ear-airpods", available: true },
  { id: "airpods-3", name: { RU: "AirPods 3", KZ: "AirPods 3", EN: "AirPods 3" }, description: { RU: "Пространственное аудио, до 6 часов работы", KZ: "Кеңістіктік аудио, 6 сағатқа дейін", EN: "Spatial audio, up to 6 hours battery" }, price: 65000, image: img("1588423771073-b8903fbb85b5"), categoryId: "earphones", subcategoryId: "ear-airpods", available: true },
  { id: "airpods-max", name: { RU: "AirPods Max", KZ: "AirPods Max", EN: "AirPods Max" }, description: { RU: "Полноразмерные наушники Apple премиум-класса", KZ: "Apple премиум-класс толық өлшемді құлаққап", EN: "Premium full-size Apple headphones" }, price: 189000, image: img("1625245488600-f03fef636a3c"), categoryId: "earphones", subcategoryId: "ear-airpods", available: true },
  // EarPods wired
  { id: "earpods-typec", name: { RU: "EarPods Type-C", KZ: "EarPods Type-C", EN: "EarPods USB-C" }, description: { RU: "Проводные наушники Apple с разъёмом Type-C", KZ: "Type-C ұяшығымен Apple сымды құлаққап", EN: "Wired Apple earphones with USB-C connector" }, price: 8000, image: img("1572536147248-ac59a8abfa4b"), categoryId: "earphones", subcategoryId: "ear-earpods", available: true },
  { id: "earpods-lightning", name: { RU: "EarPods Lightning", KZ: "EarPods Lightning", EN: "EarPods Lightning" }, description: { RU: "Проводные наушники с разъёмом Lightning", KZ: "Lightning ұяшығымен сымды құлаққап", EN: "Wired earphones with Lightning connector" }, price: 7500, image: "https://images.satu.kz/63477935_w1280_h640_63477935.jpg", categoryId: "earphones", subcategoryId: "ear-earpods", available: true },
  // Samsung Buds
  { id: "buds3-pro", name: { RU: "Galaxy Buds3 Pro", KZ: "Galaxy Buds3 Pro", EN: "Galaxy Buds3 Pro" }, description: { RU: "ANC, 360 Audio, до 7 часов работы", KZ: "ANC, 360 Audio, 7 сағатқа дейін", EN: "ANC, 360 Audio, up to 7 hours battery" }, price: 72000, image: img("1590658165737-15a047b7c0b0"), categoryId: "earphones", subcategoryId: "ear-samsung", available: true },
  // Budget TWS
  { id: "tws-budget-1", name: { RU: "TWS i12 Pro", KZ: "TWS i12 Pro", EN: "TWS i12 Pro" }, description: { RU: "Бюджетные беспроводные наушники", KZ: "Бюджетті сымсыз құлаққап", EN: "Budget wireless earbuds" }, price: 3500, image: img("1606220588913-b3aacb4d2f46"), categoryId: "earphones", subcategoryId: "ear-budget", available: true },
  { id: "tws-budget-2", name: { RU: "Lenovo LP40 Pro", KZ: "Lenovo LP40 Pro", EN: "Lenovo LP40 Pro" }, description: { RU: "Сенсорное управление, хороший звук", KZ: "Сенсорлық басқару, жақсы дыбыс", EN: "Touch controls, good sound quality" }, price: 5500, image: img("1631867675167-90a456a90863"), categoryId: "earphones", subcategoryId: "ear-budget", available: true },

  // === CHARGERS ===
  // Type-C
  { id: "charger-tc-20w", name: { RU: "Зарядка Type-C 20W", KZ: "Type-C 20W зарядтағыш", EN: "Type-C 20W Charger" }, description: { RU: "Быстрая зарядка 20 Вт для телефонов", KZ: "Телефондарға 20 Вт жылдам зарядтау", EN: "Fast charging 20W for phones" }, price: 3000, image: img("1583863788434-e58a36330cf0"), categoryId: "chargers", subcategoryId: "chargers-typec", available: true },
  { id: "charger-tc-65w", name: { RU: "Зарядка Type-C 65W GaN", KZ: "Type-C 65W GaN зарядтағыш", EN: "Type-C 65W GaN Charger" }, description: { RU: "GaN зарядка для телефонов и планшетов", KZ: "Телефон мен планшетке GaN зарядтағыш", EN: "GaN charger for phones and tablets" }, price: 7500, image: "https://portdesigns.com/6526-large_default/gan-65w-usb-c-usb-a-wall-charger.jpg", categoryId: "chargers", subcategoryId: "chargers-typec", available: true },
  // Lightning
  { id: "charger-lightning-20w", name: { RU: "Зарядка Lightning 20W", KZ: "Lightning 20W зарядтағыш", EN: "Lightning 20W Charger" }, description: { RU: "Оригинальный адаптер Apple 20W", KZ: "Apple 20W түпнұсқа адаптер", EN: "Original Apple 20W adapter" }, price: 8000, image: img("1589739900243-4b52cd9b104e"), categoryId: "chargers", subcategoryId: "chargers-lightning", available: true },
  // Wireless
  { id: "charger-wireless-15w", name: { RU: "Беспроводная зарядка 15W", KZ: "15W сымсыз зарядтағыш", EN: "Wireless Charger 15W" }, description: { RU: "Qi совместимая беспроводная зарядка", KZ: "Qi үйлесімді сымсыз зарядтағыш", EN: "Qi compatible wireless charging pad" }, price: 5000, image: img("1615526675159-e248c3021d3f"), categoryId: "chargers", subcategoryId: "chargers-wireless", available: true },
  { id: "charger-magsafe", name: { RU: "MagSafe зарядка", KZ: "MagSafe зарядтағыш", EN: "MagSafe Charger" }, description: { RU: "Магнитная беспроводная зарядка для iPhone", KZ: "iPhone үшін магниттік сымсыз зарядтағыш", EN: "Magnetic wireless charger for iPhone" }, price: 12000, image: img("1622782914767-404fb9ab3f57"), categoryId: "chargers", subcategoryId: "chargers-wireless", available: true },
  // Laptop
  { id: "charger-laptop-100w", name: { RU: "Зарядка для ноутбука 100W", KZ: "100W ноутбук зарядтағыш", EN: "Laptop Charger 100W" }, description: { RU: "Универсальная GaN зарядка 100W Type-C", KZ: "Әмбебап 100W Type-C GaN зарядтағыш", EN: "Universal 100W GaN USB-C charger" }, price: 15000, image: img("1621259182978-fbf93132d53d"), categoryId: "chargers", subcategoryId: "chargers-laptop", available: true },
  // Car
  { id: "charger-car-dual", name: { RU: "Автозарядка 2×USB", KZ: "2×USB автозарядтағыш", EN: "Car Charger 2×USB" }, description: { RU: "Автомобильная зарядка с двумя портами", KZ: "Екі порты бар автокөлік зарядтағышы", EN: "Dual-port car charger with fast charging" }, price: 3500, image: "https://images.satu.kz/131142224_w640_h320_avtomobilnoe-zaryadnoe-ustrojstvo.jpg", categoryId: "chargers", subcategoryId: "chargers-car", available: true },

  // === CABLES ===
  { id: "cable-tc-1m", name: { RU: "Кабель Type-C 1м", KZ: "Type-C 1м кабель", EN: "Type-C Cable 1m" }, description: { RU: "Нейлоновый кабель Type-C, 60W", KZ: "Нейлон Type-C кабель, 60W", EN: "Braided nylon USB-C cable, 60W" }, price: 1500, image: img("1612815154858-60aa4c59eaa6"), categoryId: "cables", subcategoryId: "cables-typec", available: true },
  { id: "cable-tc-2m", name: { RU: "Кабель Type-C 2м", KZ: "Type-C 2м кабель", EN: "Type-C Cable 2m" }, description: { RU: "Длинный кабель для зарядки и передачи данных", KZ: "Зарядтау мен деректер тасымалдауға арналған ұзын кабель", EN: "Long cable for charging and data transfer" }, price: 2200, image: img("1624823183493-ed5832f48f18"), categoryId: "cables", subcategoryId: "cables-typec", available: true },
  { id: "cable-lightning-1m", name: { RU: "Кабель Lightning 1м", KZ: "Lightning 1м кабель", EN: "Lightning Cable 1m" }, description: { RU: "Сертифицированный MFi кабель Lightning", KZ: "MFi сертификатталған Lightning кабель", EN: "MFi certified Lightning cable" }, price: 3000, image: "https://images.satu.kz/114355231_w1280_h640_114355231.jpg", categoryId: "cables", subcategoryId: "cables-lightning", available: true },
  { id: "cable-micro-1m", name: { RU: "Кабель Micro USB 1м", KZ: "Micro USB 1м кабель", EN: "Micro USB Cable 1m" }, description: { RU: "Универсальный кабель Micro USB", KZ: "Әмбебап Micro USB кабель", EN: "Universal Micro USB cable" }, price: 800, image: "https://static.shop.kz/upload/resize_cache/iblock/1f4/8jk7zap49e3ks4et147d6o63fb184qe7/450_450_1/189441e1.webp", categoryId: "cables", subcategoryId: "cables-micro", available: true },

  // === POWER BANKS ===
  { id: "pb-10000", name: { RU: "Повербанк 10 000 мАч", KZ: "10 000 мАч повербанк", EN: "Power Bank 10,000 mAh" }, description: { RU: "Компактный повербанк с двумя USB портами", KZ: "Екі USB порты бар ықшам повербанк", EN: "Compact power bank with dual USB ports" }, price: 6000, image: img("1609091839311-d5365f9ff1c5"), categoryId: "powerbanks", available: true },
  { id: "pb-20000", name: { RU: "Повербанк 20 000 мАч", KZ: "20 000 мАч повербанк", EN: "Power Bank 20,000 mAh" }, description: { RU: "Быстрая зарядка PD 22.5W, дисплей", KZ: "PD 22.5W жылдам зарядтау, дисплей", EN: "Fast charging PD 22.5W with display" }, price: 10000, image: img("1585338107529-13afc5f02586"), categoryId: "powerbanks", available: true },
  { id: "pb-magsafe", name: { RU: "MagSafe повербанк 5000 мАч", KZ: "MagSafe 5000 мАч повербанк", EN: "MagSafe Power Bank 5,000 mAh" }, description: { RU: "Магнитный повербанк для iPhone", KZ: "iPhone үшін магниттік повербанк", EN: "Magnetic power bank for iPhone" }, price: 12000, image: "https://snpmarket.com/images/catalog/xl-370463-power-bank-magsafe-battery-pack-proda-pd-v11-5000--432-321.jpg", categoryId: "powerbanks", available: true },

  // === SCREEN PROTECTORS ===
  { id: "sp-ip16", name: { RU: "Стекло iPhone 16", KZ: "iPhone 16 әйнек", EN: "iPhone 16 Screen Protector" }, description: { RU: "Закалённое стекло 9H, полное покрытие", KZ: "9H шыңдалған әйнек, толық жабу", EN: "9H tempered glass, full coverage" }, price: 2500, image: img("1511385348-a52b4a160dc2"), categoryId: "screen-protectors", subcategoryId: "sp-iphone", available: true },
  { id: "sp-ip15", name: { RU: "Стекло iPhone 15", KZ: "iPhone 15 әйнек", EN: "iPhone 15 Screen Protector" }, description: { RU: "Антибликовое защитное стекло", KZ: "Антижарқыраулық қорғаныш әйнек", EN: "Anti-glare tempered glass protector" }, price: 2000, image: img("1598327105666-5b89351aff97"), categoryId: "screen-protectors", subcategoryId: "sp-iphone", available: true },
  { id: "sp-s24", name: { RU: "Стекло Samsung S24", KZ: "Samsung S24 әйнек", EN: "Samsung S24 Screen Protector" }, description: { RU: "UV-клей стекло для изогнутого экрана", KZ: "Қисық экранға UV-желім әйнек", EN: "UV glue glass for curved screen" }, price: 3500, image: img("1574944985070-8f3ebc6b79d2"), categoryId: "screen-protectors", subcategoryId: "sp-samsung", available: true },

  // === HOLDERS ===
  { id: "holder-car-magnetic", name: { RU: "Магнитный автодержатель", KZ: "Магниттік автоұстағыш", EN: "Magnetic Car Mount" }, description: { RU: "Магнитный держатель в воздуховод", KZ: "Ауа шығарғышқа магниттік ұстағыш", EN: "Magnetic air vent phone mount" }, price: 3000, image: "https://content.rozetka.com.ua/goods/images/big/423326632.jpg", categoryId: "holders", available: true },
  { id: "holder-desk", name: { RU: "Настольная подставка", KZ: "Үстел үсті тіреуіш", EN: "Desktop Phone Stand" }, description: { RU: "Регулируемая алюминиевая подставка", KZ: "Реттелетін алюминий тіреуіш", EN: "Adjustable aluminum phone stand" }, price: 4000, image: img("1586495777744-4413f21062fa"), categoryId: "holders", available: true },
  { id: "holder-ring", name: { RU: "Кольцо-держатель", KZ: "Сақина-ұстағыш", EN: "Ring Holder" }, description: { RU: "Кольцо-подставка на заднюю панель", KZ: "Артқы панельге сақина-тіреуіш", EN: "Finger ring stand for back panel" }, price: 800, image: img("1615526675159-e248c3021d3f"), categoryId: "holders", available: true },

  // === SPEAKERS ===
  { id: "speaker-jbl-go3", name: { RU: "Колонка JBL Go 3", KZ: "JBL Go 3 динамик", EN: "JBL Go 3 Speaker" }, description: { RU: "Портативная колонка, водозащита IP67", KZ: "IP67 суға төзімді портативті динамик", EN: "Portable speaker, IP67 waterproof" }, price: 15000, image: img("1608043152269-423dbba4e7e1"), categoryId: "speakers", available: true },
  { id: "speaker-mini", name: { RU: "Мини-колонка Bluetooth", KZ: "Bluetooth мини-динамик", EN: "Mini Bluetooth Speaker" }, description: { RU: "Компактная колонка с карабином", KZ: "Карабинмен ықшам динамик", EN: "Compact speaker with carabiner clip" }, price: 4500, image: img("1589003077984-894e133dabab"), categoryId: "speakers", available: true },
];
