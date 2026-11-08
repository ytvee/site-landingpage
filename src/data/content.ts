import type { ImageMetadata } from 'astro';
import work from '../assets/photos/work.png';
import meetings from '../assets/photos/meetings.png';
import entrance from '../assets/photos/entrance.png';
import hall from '../assets/photos/hall.png';
import { site } from './site';

// Тексты по фактам владельца. Итоговая редактура в S-011.
export const workBlock = {
  id: 'work',
  label: 'Пространство',
  title: 'Для работы',
  text: 'Спокойное место, где удобно работать с ноутбуком. Приходите на несколько часов.',
  facts: ['Wi-Fi', 'Розетки', 'Тихие зоны'],
  image: work as ImageMetadata,
  alt: 'Светлое пространство кофейни с барной стойкой и кофемашинами',
};

export const meetingsBlock = {
  id: 'meetings',
  label: 'Пространство',
  title: 'Для встреч',
  text: 'Здесь можно спокойно поговорить: в переговорной части нет музыки. Столы можно забронировать заранее.',
  facts: ['Переговорная часть без музыки', 'Бронь столов по телефону и в мессенджерах'],
  image: meetings as ImageMetadata,
  alt: 'Люди разговаривают за встречей в кофейне',
};

export const gallery: { image: ImageMetadata; alt: string }[] = [
  { image: hall, alt: 'Тёплый зал кофейни со столиками и барной стойкой' },
  { image: entrance, alt: 'Вход во двор с аркой и столиками у кофейни' },
  { image: work, alt: 'Барная стойка и кофемашины в светлом зале' },
  { image: meetings, alt: 'Гости беседуют у стойки кофейни' },
];

export const booking = {
  id: 'booking',
  title: 'Бронь стола',
  text: 'Бронируем по телефону и в мессенджерах. Напишите или позвоните, подберём время.',
  phone: site.phone,
  phoneDisplay: site.phoneDisplay,
};

export const telegramBlock = {
  id: 'telegram',
  title: 'Новости в Telegram',
  text: 'Анонсы и новости кофейни в нашем канале.',
};

export const faq = [
  { q: 'Во сколько вы работаете?', a: 'Ежедневно с 9:00 до 22:00.' },
  { q: 'Где находится кофейня?', a: 'Санкт-Петербург, набережная реки Фонтанки, 126.' },
  { q: 'Есть ли Wi-Fi и розетки?', a: 'Да, у нас есть Wi-Fi и розетки.' },
  { q: 'Можно ли работать с ноутбуком?', a: 'Да, в кофейне есть тихие зоны. Можно приходить на несколько часов.' },
  { q: 'Можно ли провести встречу или переговоры?', a: 'Да, в переговорной части нет музыки, а столы можно забронировать заранее.' },
  { q: 'Как забронировать стол?', a: `По телефону ${site.phoneDisplay} или в Telegram и WhatsApp.` },
];
