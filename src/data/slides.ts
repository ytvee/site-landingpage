import type { ImageMetadata } from 'astro';
import entrance from '../assets/photos/entrance.png';
import work from '../assets/photos/work.png';
import meetings from '../assets/photos/meetings.png';
import hall from '../assets/photos/hall.png';

export interface Slide {
  label: string;
  title: string;
  text: string;
  href: string;
  image: ImageMetadata;
  alt: string;
}

// Фото временные (присланные владельцем), финальный подбор в S-012/S-013.
export const slides: Slide[] = [
  { label: 'Фонтанки, 126', title: 'Заходите во двор', text: 'Ежедневно с 9 до 22.', href: '#location', image: entrance, alt: 'Вход во двор с аркой и столиками у кофейни' },
  { label: 'Пространство', title: 'Для работы', text: 'Wi-Fi, розетки и тихие зоны.', href: '#work', image: work, alt: 'Светлое пространство кофейни с барной стойкой и кофемашинами' },
  { label: 'Пространство', title: 'Для встреч', text: 'Переговорная часть без музыки.', href: '#meetings', image: meetings, alt: 'Люди разговаривают за встречей в кофейне' },
  { label: 'Бронь', title: 'Столы по брони', text: 'По телефону и в мессенджерах.', href: '#booking', image: hall, alt: 'Тёплый зал кофейни со столиками и барной стойкой' },
];
