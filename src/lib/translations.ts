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
  | "namePlaceholder"
  | "phonePlaceholder"
  | "awaitingConfirmation"
  | "confirmed"
  | "cancelled"
  | "thankYou"
  | "managerWillContact"
  | "dashboard"
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
  siteName: { RU: "Tuvis", KZ: "Tuvis", EN: "Tuvis" },
  tagline: { RU: "Аксессуары для телефонов", KZ: "Телефон аксессуарлары", EN: "Phone Accessories" },
  viewMenu: { RU: "Смотреть каталог", KZ: "Каталогты қарау", EN: "View catalog" },
  additionally: { RU: "Дополнительно:", KZ: "Қосымша:", EN: "Additionally:" },
  howToGetThere: { RU: "Как добраться?", KZ: "Қалай жетуге болады?", EN: "How to get there?" },
  writeAdmin: { RU: "Написать администратору", KZ: "Әкімшіге жазу", EN: "Write to the administrator" },
  leaveFeedback: { RU: "Оставить отзыв", KZ: "Пікір қалдыру", EN: "Leave feedback" },
  address: { RU: "Адрес магазина", KZ: "Дүкен мекенжайы", EN: "Store address" },
  addressValue: { RU: "г. Шымкент, улица Байсеитова, 1", KZ: "Шымкент қаласы, Байсейітова көшесі, 1", EN: "Shymkent, Baiseitova street, 1" },
  workSchedule: { RU: "Режим работы", KZ: "Жұмыс режимі", EN: "Work schedule" },
  scheduleValue: { RU: "10:00 – 21:00", KZ: "10:00 – 21:00", EN: "10:00 AM – 9:00 PM" },
  contacts: { RU: "Контакты", KZ: "Байланыстар", EN: "Contacts" },
  menu: { RU: "Каталог", KZ: "Каталог", EN: "Catalog" },
  cart: { RU: "Корзина", KZ: "Себет", EN: "Cart" },
  emptyCart: { RU: "Ваша корзина пуста", KZ: "Сіздің себетіңіз бос", EN: "Your cart is empty" },
  addItems: { RU: "Добавьте товары из каталога", KZ: "Каталогтан тауарлар қосыңыз", EN: "Add items from the catalog" },
  subtotal: { RU: "Подитог", KZ: "Аралық сома", EN: "Subtotal" },
  total: { RU: "Итого", KZ: "Барлығы", EN: "Total" },
  checkout: { RU: "Оформить заказ", KZ: "Тапсырыс беру", EN: "Checkout" },
  orderPlaced: { RU: "Заказ оформлен!", KZ: "Тапсырыс берілді!", EN: "Order placed!" },
  orderNumber: { RU: "Номер заказа", KZ: "Тапсырыс нөмірі", EN: "Order number" },
  orderStatus: { RU: "Статус", KZ: "Күй", EN: "Status" },
  orderItems: { RU: "Состав заказа", KZ: "Тапсырыс құрамы", EN: "Order items" },
  backToMenu: { RU: "Вернуться в каталог", KZ: "Каталогқа оралу", EN: "Back to catalog" },
  continueShopping: { RU: "Продолжить покупки", KZ: "Сатып алуды жалғастыру", EN: "Continue shopping" },
  remove: { RU: "Удалить", KZ: "Жою", EN: "Remove" },
  add: { RU: "В корзину", KZ: "Себетке", EN: "Add to cart" },
  processing: { RU: "Обработка...", KZ: "Өңдеу...", EN: "Processing..." },
  search: { RU: "Поиск товаров...", KZ: "Тауарларды іздеу...", EN: "Search products..." },
  allCategories: { RU: "Все", KZ: "Барлығы", EN: "All" },
  allSubcategories: { RU: "Все модели", KZ: "Барлық модельдер", EN: "All models" },
  currency: { RU: "₸", KZ: "₸", EN: "₸" },
  itemAdded: { RU: "Добавлено!", KZ: "Қосылды!", EN: "Added!" },
  termsOfUse: { RU: "Условия использования", KZ: "Қолдану ережелері", EN: "Terms of use" },
  paymentTerms: { RU: "Условия оплаты", KZ: "Төлем ережелері", EN: "Payment Terms" },
  poweredBy: { RU: "Работает на", KZ: "Жасаған", EN: "Powered by" },
  paymentTitle: { RU: "Оплата заказа", KZ: "Тапсырыс төлемі", EN: "Order Payment" },
  scanQr: { RU: "Отсканируйте QR-код в Kaspi", KZ: "Kaspi-де QR-кодты сканерлеңіз", EN: "Scan QR code in Kaspi" },
  scanQrDesc: { RU: "Откройте приложение Kaspi → Платежи → Оплата по QR", KZ: "Kaspi қолданбасын ашыңыз → Төлемдер → QR бойынша төлеу", EN: "Open Kaspi app → Payments → Pay by QR" },
  iPaid: { RU: "Я оплатил", KZ: "Мен төледім", EN: "I paid" },
  yourName: { RU: "Ваше имя", KZ: "Сіздің атыңыз", EN: "Your name" },
  yourPhone: { RU: "Номер телефона", KZ: "Телефон нөмірі", EN: "Phone number" },
  namePlaceholder: { RU: "Введите имя", KZ: "Атыңызды енгізіңіз", EN: "Enter your name" },
  phonePlaceholder: { RU: "+7 (___) ___-__-__", KZ: "+7 (___) ___-__-__", EN: "+7 (___) ___-__-__" },
  awaitingConfirmation: { RU: "Ожидает подтверждения", KZ: "Растауды күтуде", EN: "Awaiting confirmation" },
  confirmed: { RU: "Подтверждён", KZ: "Расталды", EN: "Confirmed" },
  cancelled: { RU: "Отменён", KZ: "Бас тартылды", EN: "Cancelled" },
  thankYou: { RU: "Спасибо за заказ!", KZ: "Тапсырыс үшін рахмет!", EN: "Thank you for your order!" },
  managerWillContact: { RU: "Наш менеджер свяжется с вами для подтверждения", KZ: "Менеджеріміз растау үшін сізбен байланысады", EN: "Our manager will contact you to confirm" },
  dashboard: { RU: "Панель менеджера", KZ: "Менеджер панелі", EN: "Manager Dashboard" },
  pendingOrders: { RU: "Ожидающие", KZ: "Күтудегілер", EN: "Pending" },
  confirmedOrders: { RU: "Подтверждённые", KZ: "Расталғандар", EN: "Confirmed" },
  allOrders: { RU: "Все заказы", KZ: "Барлық тапсырыстар", EN: "All orders" },
  confirmOrder: { RU: "Подтвердить", KZ: "Растау", EN: "Confirm" },
  cancelOrder: { RU: "Отменить", KZ: "Бас тарту", EN: "Cancel" },
  noOrders: { RU: "Нет заказов", KZ: "Тапсырыстар жоқ", EN: "No orders" },
  customer: { RU: "Клиент", KZ: "Клиент", EN: "Customer" },
  phone: { RU: "Телефон", KZ: "Телефон", EN: "Phone" },
  date: { RU: "Дата", KZ: "Күні", EN: "Date" },
  items: { RU: "Товары", KZ: "Тауарлар", EN: "Items" },
  amount: { RU: "Сумма", KZ: "Сома", EN: "Amount" },
  status: { RU: "Статус", KZ: "Күй", EN: "Status" },
  actions: { RU: "Действия", KZ: "Әрекеттер", EN: "Actions" },
  loginTitle: { RU: "Вход в панель менеджера", KZ: "Менеджер панеліне кіру", EN: "Manager Login" },
  password: { RU: "Пароль", KZ: "Құпия сөз", EN: "Password" },
  login: { RU: "Войти", KZ: "Кіру", EN: "Login" },
  wrongPassword: { RU: "Неверный пароль", KZ: "Қате құпия сөз", EN: "Wrong password" },
  logout: { RU: "Выйти", KZ: "Шығу", EN: "Logout" },
  fillAllFields: { RU: "Заполните все поля", KZ: "Барлық өрістерді толтырыңыз", EN: "Please fill in all fields" },
  orderHistory: { RU: "Мои заказы", KZ: "Менің тапсырысTuvisм", EN: "My Orders" },
  noOrderHistory: { RU: "Заказов пока нет", KZ: "Тапсырыстар әлі жоқ", EN: "No orders yet" },
  noOrderHistoryDesc: { RU: "Здесь будут ваши прошлые заказы", KZ: "Мұнда сіздің өткен тапсырысTuvisңыз болады", EN: "Your past orders will appear here" },
  clearHistory: { RU: "Очистить", KZ: "Тазалау", EN: "Clear" },
  managerCall: {RU: "Наш менеджер вам скоро позвонит! Ожидайте.", KZ: "Біз сізге жуырда хабарласамыз!", EN: "Our manager will contact you soon!"}
};

export function t(key: TranslationKeys, lang: Language): string {
  return translations[key]?.[lang] ?? translations[key]?.["EN"] ?? key;
}
