import { Language } from "@/types";

type TranslationKeys =
  | "siteName"
  | "tagline"
  | "viewMenu"
  | "additionally"
  | "howToGetThere"
  | "writeAdmin"
  | "leaveFeedback"
  | "address"
  | "addressValue"
  | "workSchedule"
  | "scheduleValue"
  | "contacts"
  | "menu"
  | "cart"
  | "emptyCart"
  | "addItems"
  | "subtotal"
  | "total"
  | "checkout"
  | "orderPlaced"
  | "orderNumber"
  | "orderStatus"
  | "orderItems"
  | "backToMenu"
  | "continueShopping"
  | "remove"
  | "add"
  | "processing"
  | "search"
  | "allCategories"
  | "allBrands"
  | "allSubcategories"
  | "currency"
  | "itemAdded"
  | "termsOfUse"
  | "paymentTerms"
  | "poweredBy"
  | "paymentTitle"
  | "scanQr"
  | "scanQrDesc"
  | "iPaid"
  | "yourName"
  | "yourPhone"
  | "yourEmail"
  | "namePlaceholder"
  | "phonePlaceholder"
  | "emailPlaceholder"
  | "invalidPhone"
  | "invalidEmail"
  | "phoneHelp"
  | "awaitingConfirmation"
  | "confirmed"
  | "cancelled"
  | "thankYou"
  | "managerWillContact"
  | "dashboard"
  | "ordersTab"
  | "itemsTab"
  | "addItem"
  | "editItem"
  | "newItem"
  | "nameRu"
  | "nameKz"
  | "descriptionRu"
  | "descriptionKz"
  | "price"
  | "availability"
  | "available"
  | "hidden"
  | "category"
  | "model"
  | "noModel"
  | "image"
  | "imageHint"
  | "saveChanges"
  | "saving"
  | "itemsTotal"
  | "noItems"
  | "edit"
  | "deleteItem"
  | "loadMore"
  | "loadingProducts"
  | "updateCatalog"
  | "updatingCatalog"
  | "pendingOrders"
  | "confirmedOrders"
  | "allOrders"
  | "confirmOrder"
  | "cancelOrder"
  | "noOrders"
  | "customer"
  | "phone"
  | "date"
  | "items"
  | "amount"
  | "status"
  | "actions"
  | "loginTitle"
  | "password"
  | "login"
  | "wrongPassword"
  | "logout"
  | "fillAllFields"
  | "orderHistory"
  | "noOrderHistory"
  | "noOrderHistoryDesc"
  | "clearHistory"
  | "managerCall";

export const translations: Record<TranslationKeys, Record<Language, string>> = {
  siteName: { RU: "DDD optom", KZ: "DDD optom" },
  tagline: { RU: "Аксессуары для телефонов", KZ: "Телефон аксессуарлары" },
  viewMenu: { RU: "Смотреть каталог", KZ: "Каталогты қарау" },
  additionally: { RU: "Дополнительно:", KZ: "Қосымша:" },
  howToGetThere: { RU: "Как добраться?", KZ: "Қалай жетуге болады?" },
  writeAdmin: { RU: "Написать администратору", KZ: "Әкімшіге жазу" },
  leaveFeedback: { RU: "Оставить отзыв", KZ: "Пікір қалдыру" },
  address: { RU: "Адрес магазина", KZ: "Дүкен мекенжайы" },
  addressValue: { RU: "г. Шымкент, улица Байсеитова, 1", KZ: "Шымкент қаласы, Байсейітова көшесі, 1" },
  workSchedule: { RU: "Режим работы", KZ: "Жұмыс режимі" },
  scheduleValue: { RU: "10:00 – 21:00", KZ: "10:00 – 21:00" },
  contacts: { RU: "Контакты", KZ: "Байланыстар" },
  menu: { RU: "Каталог", KZ: "Каталог" },
  cart: { RU: "Корзина", KZ: "Себет" },
  emptyCart: { RU: "Ваша корзина пуста", KZ: "Сіздің себетіңіз бос" },
  addItems: { RU: "Добавьте товары из каталога", KZ: "Каталогтан тауарлар қосыңыз" },
  subtotal: { RU: "Подитог", KZ: "Аралық сома" },
  total: { RU: "Итого", KZ: "Барлығы" },
  checkout: { RU: "Оформить заказ", KZ: "Тапсырыс беру" },
  orderPlaced: { RU: "Заказ оформлен!", KZ: "Тапсырыс берілді!" },
  orderNumber: { RU: "Номер заказа", KZ: "Тапсырыс нөмірі" },
  orderStatus: { RU: "Статус", KZ: "Күй" },
  orderItems: { RU: "Состав заказа", KZ: "Тапсырыс құрамы" },
  backToMenu: { RU: "Вернуться в каталог", KZ: "Каталогқа оралу" },
  continueShopping: { RU: "Продолжить покупки", KZ: "Сатып алуды жалғастыру" },
  remove: { RU: "Удалить", KZ: "Жою" },
  add: { RU: "В корзину", KZ: "Себетке" },
  processing: { RU: "Обработка...", KZ: "Өңдеу..." },
  search: { RU: "Поиск товаров...", KZ: "Тауарларды іздеу..." },
  allCategories: { RU: "Все", KZ: "Барлығы" },
  allBrands: { RU: "Все бренды", KZ: "Барлық брендтер" },
  allSubcategories: { RU: "Все модели", KZ: "Барлық модельдер" },
  currency: { RU: "₸", KZ: "₸" },
  itemAdded: { RU: "Добавлено!", KZ: "Қосылды!" },
  termsOfUse: { RU: "Условия использования", KZ: "Қолдану ережелері" },
  paymentTerms: { RU: "Условия оплаты", KZ: "Төлем ережелері" },
  poweredBy: { RU: "Работает на", KZ: "Жасаған" },
  paymentTitle: { RU: "Оплата заказа", KZ: "Тапсырыс төлемі" },
  scanQr: { RU: "Отсканируйте QR-код в Kaspi", KZ: "Kaspi-де QR-кодты сканерлеңіз" },
  scanQrDesc: { RU: "Откройте приложение Kaspi → Платежи → Оплата по QR", KZ: "Kaspi қолданбасын ашыңыз → Төлемдер → QR бойынша төлеу" },
  iPaid: { RU: "Я оплатил", KZ: "Мен төледім" },
  yourName: { RU: "Ваше имя", KZ: "Сіздің атыңыз" },
  yourPhone: { RU: "Номер телефона", KZ: "Телефон нөмірі" },
  yourEmail: { RU: "Email", KZ: "Email" },
  namePlaceholder: { RU: "Введите имя", KZ: "Атыңызды енгізіңіз" },
  phonePlaceholder: { RU: "777 123 45 67", KZ: "777 123 45 67" },
  emailPlaceholder: { RU: "name@example.com", KZ: "name@example.com" },
  invalidPhone: { RU: "Неверный формат номера телефона.", KZ: "Телефон нөмірінің форматы қате." },
  invalidEmail: { RU: "Введите корректный email.", KZ: "Дұрыс email енгізіңіз." },
  phoneHelp: { RU: "Код страны добавляется автоматически. Для +7 введите 10 цифр после кода.", KZ: "Ел коды автоматты түрде қосылады. +7 үшін кодтан кейін 10 сан енгізіңіз." },
  awaitingConfirmation: { RU: "Ожидает подтверждения", KZ: "Растауды күтуде" },
  confirmed: { RU: "Подтверждён", KZ: "Расталды" },
  cancelled: { RU: "Отменён", KZ: "Бас тартылды" },
  thankYou: { RU: "Спасибо за заказ!", KZ: "Тапсырыс үшін рахмет!" },
  managerWillContact: { RU: "Наш менеджер свяжется с вами для подтверждения", KZ: "Менеджеріміз растау үшін сізбен байланысады" },
  dashboard: { RU: "Панель менеджера", KZ: "Менеджер панелі" },
  ordersTab: { RU: "Заказы", KZ: "Тапсырыстар" },
  itemsTab: { RU: "Товары", KZ: "Тауарлар" },
  addItem: { RU: "Добавить товар", KZ: "Тауар қосу" },
  editItem: { RU: "Редактировать товар", KZ: "Тауарды өзгерту" },
  newItem: { RU: "Новый товар", KZ: "Жаңа тауар" },
  nameRu: { RU: "Название на русском", KZ: "Орысша атауы" },
  nameKz: { RU: "Название на казахском", KZ: "Қазақша атауы" },
  descriptionRu: { RU: "Описание на русском", KZ: "Орысша сипаттама" },
  descriptionKz: { RU: "Описание на казахском", KZ: "Қазақша сипаттама" },
  price: { RU: "Цена", KZ: "Баға" },
  availability: { RU: "Статус", KZ: "Күйі" },
  available: { RU: "Доступен", KZ: "Қолжетімді" },
  hidden: { RU: "Скрыт", KZ: "Жасырылған" },
  category: { RU: "Категория", KZ: "Санат" },
  model: { RU: "Модель", KZ: "Модель" },
  noModel: { RU: "Без модели", KZ: "Модель жоқ" },
  image: { RU: "Изображение", KZ: "Сурет" },
  imageHint: { RU: "Файл сжимается до 200px и сохраняется в Firebase Storage.", KZ: "Файл 200px-ке дейін қысылып, Firebase Storage-қа сақталады." },
  saveChanges: { RU: "Сохранить изменения", KZ: "Өзгерістерді сақтау" },
  saving: { RU: "Сохранение...", KZ: "Сақталуда..." },
  itemsTotal: { RU: "товаров", KZ: "тауар" },
  noItems: { RU: "В Firestore пока нет товаров.", KZ: "Firestore ішінде әзірге тауар жоқ." },
  edit: { RU: "Изменить", KZ: "Өзгерту" },
  deleteItem: { RU: "Удалить", KZ: "Жою" },
  loadMore: { RU: "Показать еще", KZ: "Тағы көрсету" },
  loadingProducts: { RU: "Загружаем товары...", KZ: "Тауарлар жүктелуде..." },
  updateCatalog: { RU: "Обновить", KZ: "Жаңарту" },
  updatingCatalog: { RU: "Обновляем...", KZ: "Жаңартылуда..." },
  pendingOrders: { RU: "Ожидающие", KZ: "Күтудегілер" },
  confirmedOrders: { RU: "Подтверждённые", KZ: "Расталғандар" },
  allOrders: { RU: "Все заказы", KZ: "Барлық тапсырыстар" },
  confirmOrder: { RU: "Подтвердить", KZ: "Растау" },
  cancelOrder: { RU: "Отменить", KZ: "Бас тарту" },
  noOrders: { RU: "Нет заказов", KZ: "Тапсырыстар жоқ" },
  customer: { RU: "Клиент", KZ: "Клиент" },
  phone: { RU: "Телефон", KZ: "Телефон" },
  date: { RU: "Дата", KZ: "Күні" },
  items: { RU: "Товары", KZ: "Тауарлар" },
  amount: { RU: "Сумма", KZ: "Сома" },
  status: { RU: "Статус", KZ: "Күй" },
  actions: { RU: "Действия", KZ: "Әрекеттер" },
  loginTitle: { RU: "Вход в панель менеджера", KZ: "Менеджер панеліне кіру" },
  password: { RU: "Пароль", KZ: "Құпия сөз" },
  login: { RU: "Войти", KZ: "Кіру" },
  wrongPassword: { RU: "Неверный пароль", KZ: "Қате құпия сөз" },
  logout: { RU: "Выйти", KZ: "Шығу" },
  fillAllFields: { RU: "Заполните все поля", KZ: "Барлық өрістерді толтырыңыз" },
  orderHistory: { RU: "Мои заказы", KZ: "Менің тапсырыстарым" },
  noOrderHistory: { RU: "Заказов пока нет", KZ: "Тапсырыстар әлі жоқ" },
  noOrderHistoryDesc: { RU: "Здесь будут ваши прошлые заказы", KZ: "Мұнда сіздің өткен тапсырыстарыңыз болады" },
  clearHistory: { RU: "Очистить", KZ: "Тазалау" },
  managerCall: { RU: "Наш менеджер вам скоро позвонит! Ожидайте.", KZ: "Біз сізге жуырда хабарласамыз!" },
};

export function t(key: TranslationKeys, lang: Language): string {
  return translations[key]?.[lang] ?? translations[key]?.RU ?? key;
}
