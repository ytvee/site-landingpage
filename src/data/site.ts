import { siTelegram, siVk, siInstagram } from 'simple-icons';

export const site = {
  name: 'CoffeeFy',
  hours: 'Ежедневно с 9 до 22',
  address: 'Фонтанки, 126',
  phone: '+79992223333',
  phoneDisplay: '8 999 222 33 33',
} as const;

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
