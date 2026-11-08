import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PHONE = 'tel:+79992223333';

async function open(page: Page) {
  const problems: string[] = [];
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('console', (m) => m.type() === 'error' && problems.push(`console: ${m.text()}`));
  page.on('response', (r) => r.status() >= 400 && problems.push(`${r.status()} ${r.url()}`));
  await page.goto('/');
  return problems;
}
const isDesktop = (page: Page) => (page.viewportSize()?.width ?? 0) >= 900;

test('smoke: заголовок, один h1, нет ошибок', async ({ page }) => {
  const problems = await open(page);
  await expect(page).toHaveTitle(/CoffeeFy/);
  await expect(page.locator('h1')).toHaveCount(1);
  await page.waitForLoadState('networkidle');
  expect(problems).toEqual([]);
});

test('все якоря ведут на существующие элементы', async ({ page }) => {
  await open(page);
  const missing = await page.evaluate(() =>
    [...new Set([...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href')!.slice(1)))].filter(
      (id) => id && !document.getElementById(id),
    ),
  );
  expect(missing).toEqual([]);
});

test('нет горизонтального скролла', async ({ page }) => {
  await open(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});

test('меню: открытие, Escape с возвратом фокуса, клик вне', async ({ page }) => {
  await open(page);
  if (isDesktop(page)) {
    const btn = page.locator('button[aria-controls="dd-space"]');
    await btn.click();
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#dd-space')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
    await expect(btn).toBeFocused();
    await btn.click();
    await page.mouse.click(700, 600);
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
  } else {
    const burger = page.locator('[data-burger]');
    await expect(page.locator('#site-nav')).toBeHidden();
    await burger.click();
    await expect(page.locator('#site-nav')).toBeVisible();
    await expect(burger).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(page.locator('#site-nav')).toBeHidden();
    await expect(burger).toBeFocused();
  }
});

test('слайдер: кнопки, стрелки, перетаскивание', async ({ page }) => {
  await open(page);
  const current = page.locator('[data-current]');
  const next = page.locator('[data-next]');
  const prev = page.locator('[data-prev]');
  await expect(prev).toBeDisabled();
  await next.scrollIntoViewIfNeeded();
  await next.click();
  await expect(current).not.toHaveText('1');
  await prev.click();
  await expect(current).toHaveText('1');
  await page.locator('[data-viewport]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(current).not.toHaveText('1');
  await page.keyboard.press('ArrowLeft');
  await expect(current).toHaveText('1');
  if (isDesktop(page)) {
    const box = (await page.locator('[data-viewport]').boundingBox())!;
    const before = await page.locator('.slider__track').evaluate((e) => (e as HTMLElement).style.transform);
    await page.mouse.move(box.x + 800, box.y + 200);
    await page.mouse.down();
    await page.mouse.move(box.x + 300, box.y + 200, { steps: 10 });
    await page.mouse.up();
    await expect.poll(() => page.locator('.slider__track').evaluate((e) => (e as HTMLElement).style.transform)).not.toBe(before);
  }
});

test('ссылки: телефон, внешние с rel, нет Instagram', async ({ page }) => {
  await open(page);
  expect(await page.locator(`a[href="${PHONE}"]`).count()).toBeGreaterThan(0);
  const bad = await page.evaluate(() =>
    [...document.querySelectorAll('a[href^="http"]')]
      .filter((a) => !(a.getAttribute('target') === '_blank' && /noopener/.test(a.getAttribute('rel') ?? '')))
      .map((a) => a.getAttribute('href')),
  );
  expect(bad).toEqual([]);
  await expect(page.locator('a[href*="instagram"]')).toHaveCount(0);
});

test('FAQ открывается с клавиатуры', async ({ page }) => {
  await open(page);
  const first = page.locator('details summary').first();
  await first.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('details').first()).toHaveAttribute('open', '');
  await page.keyboard.press('Space');
  await expect(page.locator('details').first()).not.toHaveAttribute('open', '');
});

test('цели Метрики: вызов reachGoal по типу ссылки', async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as any;
    w.__ymId = 1;
    w.__calls = [];
    w.ym = (...a: unknown[]) => w.__calls.push(a);
    document.addEventListener('click', (e) => (e.target as Element).closest('a')?.addEventListener('click', (ev) => ev.preventDefault(), { once: true }), true);
  });
  await page.goto('/');
  const expected: Record<string, string> = {
    [`footer a[href="${PHONE}"]`]: 'call',
    'footer a[href^="https://t.me/"]': 'telegram',
    'footer a[href^="https://wa.me/"]': 'whatsapp',
    '#location a[href*="yandex.ru/maps"]': 'route',
  };
  for (const [selector, goal] of Object.entries(expected)) {
    await page.evaluate(() => ((window as any).__calls.length = 0));
    await page.locator(selector).first().scrollIntoViewIfNeeded();
    await page.locator(selector).first().evaluate((a) => (a as HTMLElement).click());
    const calls = await page.evaluate(() => (window as any).__calls);
    expect(calls, selector).toEqual([[1, 'reachGoal', goal]]);
  }
});

test('доступность (axe): без нарушений', async ({ page }) => {
  await open(page);
  await page.evaluate(() => document.querySelectorAll('img').forEach((i) => (i.loading = 'eager')));
  await page.waitForLoadState('networkidle');
  const run = () => new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect((await run()).violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' | ')}`)).toEqual([]);
  if (isDesktop(page)) {
    await page.locator('button[aria-controls="dd-space"]').click();
    expect((await run()).violations.map((v) => v.id)).toEqual([]);
  }
});

test('скриншот страницы целиком', async ({ page }, info) => {
  await open(page);
  await page.evaluate(() => document.querySelectorAll('img').forEach((i) => (i.loading = 'eager')));
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `test-results/screens/${info.project.name}.png`, fullPage: true });
});
