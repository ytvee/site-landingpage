import { siTelegram, siVk, siInstagram } from 'simple-icons';

export const site = {
  name: 'CoffeeFy',
  hours: 'Ежедневно с 9 до 22',
  address: 'Фонтанки, 126',
  phone: '+79992223333',
  phoneDisplay: '8 999 222 33 33',
  addressFull: 'Санкт-Петербург, набережная реки Фонтанки, 126',
  hoursFull: 'Ежедневно с 9:00 до 22:00',
  // Ссылка на Telegram-канал: пока не передана владельцем. Пока пусто, блок подписки не выводится.
  telegramChannel: '' as string,
  telegramChat: 'https://t.me/+79992223333',
  whatsapp: 'https://wa.me/79992223333',
  vk: 'https://vk.com/812831',
} as const;

const q = encodeURIComponent('Санкт-Петербург, набережная реки Фонтанки, 126');
export const routes = [
  { label: 'Маршрут в Яндекс Картах', href: `https://yandex.ru/maps/?text=${q}` },
  { label: 'Маршрут в 2ГИС', href: `https://2gis.ru/spb/search/${q}` },
];

export interface Social {
  id: string;
  label: string;
  href: string;
  path: string;
  enabled: boolean;
}

// Instagram отключён до решения владельца по юридической маркировке.
export const socials: Social[] = [
  { id: 'telegram', label: 'Telegram', href: 'https://t.me/+79992223333', path: siTelegram.path, enabled: true },
  { id: 'vk', label: 'ВКонтакте', href: 'https://vk.com/812831', path: siVk.path, enabled: true },
  { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/coffeefy_sbp', path: siInstagram.path, enabled: false },
];

export interface NavLink { label: string; href: string; external?: boolean }
export type NavItem =
  | { type: 'link'; label: string; href: string }
  | { type: 'group'; id: string; label: string; items: NavLink[] };

export const nav: NavItem[] = [
  {
    type: 'group', id: 'space', label: 'Пространство',
    items: [
      { label: 'Для работы', href: '#work' },
      { label: 'Для встреч', href: '#meetings' },
      { label: 'Галерея', href: '#gallery' },
    ],
  },
  { type: 'link', label: 'Бронь', href: '#booking' },
  { type: 'link', label: 'Как добраться', href: '#location' },
  {
    type: 'group', id: 'contacts', label: 'Контакты',
    items: [
      { label: 'Позвонить', href: `tel:${site.phone}` },
      { label: 'Telegram', href: 'https://t.me/+79992223333', external: true },
      { label: 'WhatsApp', href: 'https://wa.me/79992223333', external: true },
      { label: 'ВКонтакте', href: 'https://vk.com/812831', external: true },
    ],
  },
];
