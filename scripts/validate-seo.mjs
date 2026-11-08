// S-019: проверка dist/index.html без зависимостей. Запуск после `pnpm build`: pnpm run validate
import { readFileSync, existsSync } from 'node:fs';

const html = readFileSync('dist/index.html', 'utf8');
const errors = [];
const ok = (cond, msg) => { if (!cond) errors.push(msg); };
const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

ok(/<html[^>]*lang="ru"/.test(html), 'html lang=ru');
const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
ok(title.length > 0 && title.length <= 70, `title 1..70 символов (сейчас ${title.length})`);
const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
ok(desc.length >= 70 && desc.length <= 180, `description 70..180 символов (сейчас ${desc.length})`);
ok(/<link rel="canonical" href="https?:\/\/[^"]+"/.test(html), 'canonical');
for (const p of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type', 'og:locale']) ok(html.includes(`property="${p}"`), `meta ${p}`);

const hs = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
ok(hs.filter((h) => h === 1).length === 1, 'ровно один h1');
hs.reduce((prev, h) => { ok(h <= prev + 1, `пропуск уровня заголовка: h${prev} -> h${h}`); return h; }, 0);

for (const m of html.matchAll(/<img\b[^>]*>/g)) {
  ok(/\balt="/.test(m[0]), 'img без alt');
  ok(/\bwidth="/.test(m[0]) && /\bheight="/.test(m[0]), 'img без width/height');
}
ok(!/href=""/.test(html), 'пустой href');
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
ok(ids.length === new Set(ids).size, 'дубли id');
for (const m of html.matchAll(/href="#([^"]+)"/g)) ok(ids.includes(m[1]), `якорь #${m[1]} без цели`);

const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
ok(ld.length === 1, 'один блок JSON-LD');
try {
  const d = JSON.parse(ld[0]);
  ok(d['@type'] === 'CafeOrCoffeeShop', 'JSON-LD @type');
  for (const k of ['name', 'url', 'image', 'telephone', 'address', 'openingHoursSpecification']) ok(d[k], `JSON-LD поле ${k}`);
  ok(d.address?.streetAddress && d.address?.addressLocality, 'JSON-LD address');
  ok(text.includes('набережная реки Фонтанки, 126'), 'адрес из JSON-LD есть в видимом тексте');
  ok(text.includes('8 999 222 33 33'), 'телефон есть в видимом тексте');
  ok(text.includes('с 9:00 до 22:00') && d.openingHoursSpecification[0].opens === '09:00' && d.openingHoursSpecification[0].closes === '22:00', 'часы в разметке и тексте совпадают');
  ok(!JSON.stringify(d).includes('instagram'), 'Instagram не в sameAs');
} catch (e) { errors.push(`JSON-LD не парсится: ${e.message}`); }

ok(existsSync('dist/robots.txt'), 'robots.txt в сборке');
ok(existsSync('dist/favicon.svg') && existsSync('dist/og.png'), 'favicon и og.png в сборке');

if (errors.length) { console.error('SEO-проверка: ОШИБКИ\n- ' + errors.join('\n- ')); process.exit(1); }
console.log('SEO-проверка: всё в порядке');
