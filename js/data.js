/* ==========================================================================
   data.js — справочные данные: сроки, скидки и каталог сервисов
   ========================================================================== */

/** Доступные сроки подписки в месяцах. */
const TERMS=[1,3,6,12];
/** Скидка за срок: ключ — число месяцев, значение — доля от 0 до 1. */
const DISCOUNT={1:0,3:.05,6:.10,12:.20};

/** Логотип с Simple Icons: slug сервиса и цвет в hex без «#». */
const si=(slug,hex)=>`https://cdn.simpleicons.org/${slug}/${hex}`;
/** Фавикон сайта через сервис Google (для сервисов, которых нет в Simple Icons). */
const fav=d=>`https://www.google.com/s2/favicons?domain=${d}&sz=128`;

/**
 * Каталог. Поля: id — уникальный ключ, name — название, cat — категория,
 * price — условная цена за месяц в рублях, icon — ссылка на иконку,
 * isFav — флаг фавикона (иконка растягивается на весь квадрат),
 * includes — необязательно: список [название, домен] того, что входит в подписку.
 */
const SERVICES=[
  // Кино и ТВ
  {id:'netflix',name:'Netflix',cat:'Кино и ТВ',price:799,icon:si('netflix','E50914')},
  {id:'okko',name:'Okko',cat:'Кино и ТВ',price:299,icon:fav('okko.tv'),isFav:1},
  {id:'ivi',name:'ivi',cat:'Кино и ТВ',price:399,icon:fav('ivi.ru'),isFav:1},
  {id:'max',name:'Max',cat:'Кино и ТВ',price:449,icon:si('max','002BE7')},
  {id:'appletv',name:'Apple TV+',cat:'Кино и ТВ',price:499,icon:si('appletv','000000')},
  {id:'youtube',name:'YouTube Premium',cat:'Кино и ТВ',price:700,icon:si('youtube','FF0000')},
  {id:'twitch',name:'Twitch',cat:'Кино и ТВ',price:449,icon:si('twitch','9146FF')},
  // Музыка
  {id:'spotify',name:'Spotify Premium',cat:'Музыка',price:310,icon:si('spotify','1DB954')},
  {id:'vkmusic',name:'VK Музыка',cat:'Музыка',price:199,icon:si('vk','0077FF')},
  {id:'applemusic',name:'Apple Music',cat:'Музыка',price:199,icon:si('applemusic','FA243C')},
  {id:'zvuk',name:'Звук',cat:'Музыка',price:299,icon:fav('zvuk.com'),isFav:1},
  {id:'deezer',name:'Deezer',cat:'Музыка',price:219,icon:si('deezer','A238FF')},
  // Игры
  {id:'xbox',name:'Xbox Game Pass',cat:'Игры',price:1100,icon:fav('xbox.com'),isFav:1},
  {id:'psplus',name:'PlayStation Plus',cat:'Игры',price:599,icon:si('playstation','0070D1')},
  {id:'eaplay',name:'EA Play',cat:'Игры',price:499,icon:si('ea','000000')},
  {id:'epic',name:'Epic Games',cat:'Игры',price:349,icon:si('epicgames','313131')},
  // Сервисы
  {id:'yaplus',name:'Яндекс Плюс',cat:'Сервисы',price:449,icon:fav('plus.yandex.ru'),isFav:1,includes:[
    ['Кинопоиск','kinopoisk.ru'],['Яндекс Музыка','music.yandex.ru'],['Такси (кешбэк)','taxi.yandex.ru'],
    ['Маркет','market.yandex.ru'],['Книги','books.yandex.ru'],['Диск','disk.yandex.ru'],['Еда','eda.yandex.ru']]},
  {id:'tgpremium',name:'Telegram Premium',cat:'Сервисы',price:299,icon:si('telegram','26A5E4')},
  {id:'discord',name:'Discord Nitro',cat:'Сервисы',price:799,icon:si('discord','5865F2')},
  {id:'chatgpt',name:'ChatGPT Plus',cat:'Сервисы',price:1900,icon:fav('chatgpt.com'),isFav:1},
  {id:'duolingo',name:'Duolingo Super',cat:'Сервисы',price:560,icon:si('duolingo','58CC02')},
];

/** Категории для фильтра: «Все» плюс уникальные категории из каталога. */
const CATS=['Все',...new Set(SERVICES.map(s=>s.cat))];
